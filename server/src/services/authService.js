const bcrypt = require('bcrypt');

const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');
const { signToken } = require('../utils/jwt');
const { sanitizeUser } = require('../utils/sanitizeUser');

const SALT_ROUNDS = 10;

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
    // is wrong — never reveal which one it was.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
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
