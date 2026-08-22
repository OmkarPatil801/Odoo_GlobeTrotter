const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');
const { sanitizeUser } = require('../utils/sanitizeUser');

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Factory so the service can be wired to any repository implementation
// that satisfies the UserRepository contract
// (see src/repositories/contracts/userRepository.contract.js).
function createUserService(userRepository) {
  async function getProfile(userId) {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return sanitizeUser(user);
  }

  // `updates` is expected to already be limited to { name?, email? } by the
  // controller — this never touches id/passwordHash regardless of what's
  // in the raw request body.
  async function updateProfile(userId, { name, email }) {
    const existingUser = await userRepository.findUserById(userId);
    if (!existingUser) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');
    }

    const changes = {};

    if (name !== undefined) {
      changes.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = normalizeEmail(email);

      if (normalizedEmail !== existingUser.email) {
        const owner = await userRepository.findUserByEmail(normalizedEmail);
        if (owner && owner.id !== userId) {
          throw new AppError(
            'An account with this email already exists',
            HTTP_STATUS.CONFLICT,
            'EMAIL_ALREADY_EXISTS'
          );
        }
      }

      changes.email = normalizedEmail;
    }

    const updatedUser = await userRepository.updateUser(userId, changes);
    return sanitizeUser(updatedUser);
  }

  return { getProfile, updateProfile };
}

module.exports = createUserService;
