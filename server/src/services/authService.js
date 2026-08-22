const bcrypt = require('bcrypt');

const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');
const { signToken } = require('../utils/jwt');
const { sanitizeUser } = require('../utils/sanitizeUser');
const { logSecurityEvent } = require('../utils/securityLogger');

// OWASP currently recommends a bcrypt cost factor of at least 10-12 for
// new hashes. 12 is a deliberate bump from a previous 10 — this is safe
// and doesn't invalidate anything: bcrypt embeds the cost factor used in
// the hash string itself, so bcrypt.compare() still verifies existing
// (cost-10) hashes correctly; only newly created hashes use the new cost.
const SALT_ROUNDS = 12;

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Factory so the service can be wired to any repository implementation
// that satisfies the UserRepository contract
// (see src/repositories/contracts/userRepository.contract.js) — the
// default in-memory one today, a MySQL-backed one later, or a per-test
// instance in tests.
function createAuthService(userRepository) {
  async function register({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email);

    const existingUser = await userRepository.findUserByEmail(normalizedEmail);
    if (existingUser) {
      throw new AppError(
        'An account with this email already exists',
        HTTP_STATUS.CONFLICT,
        'EMAIL_ALREADY_EXISTS'
      );
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepository.createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = signToken({ sub: user.id });
    return { user: sanitizeUser(user), token };
  }

  async function login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const user = await userRepository.findUserByEmail(normalizedEmail);

    // Same generic error whether the email doesn't exist or the password
    // is wrong — never reveal which one it was. The security log below is
    // server-side only and never reaches the API response, so it's safe
    // to note which case it was there without weakening the external
    // anti-enumeration guarantee.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      logSecurityEvent('LOGIN_FAILURE', {
        email: normalizedEmail,
        reason: user ? 'invalid_password' : 'unknown_email',
      });
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED, 'INVALID_CREDENTIALS');
    }

    const token = signToken({ sub: user.id });
    return { user: sanitizeUser(user), token };
  }

  async function getCurrentUser(userId) {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return sanitizeUser(user);
  }

  return { register, login, getCurrentUser };
}

module.exports = createAuthService;
