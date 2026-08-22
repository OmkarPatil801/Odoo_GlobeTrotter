const AppError = require('../../utils/appError');
const HTTP_STATUS = require('../../utils/httpStatus');

const PRISMA_UNIQUE_CONSTRAINT = 'P2002';
const PRISMA_RECORD_NOT_FOUND = 'P2025';

function toApiUser(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role,
    country: row.country,
    phone: row.phone,
    profileImageUrl: row.profileImageUrl,
    createdAt: row.createdAt.toISOString(),
  };
}

function emailAlreadyExistsError() {
  return new AppError('An account with this email already exists', HTTP_STATUS.CONFLICT, 'EMAIL_ALREADY_EXISTS');
}

// Prisma-backed implementation of the UserRepository contract
// (see ../contracts/userRepository.contract.js). API ids are strings —
// the database's autoincrement Int id is converted at this boundary only.
//
// `prisma` defaults to the shared client (../../config/prismaClient),
// resolved lazily so importing this factory never requires
// @prisma/client to be generated unless it's actually instantiated
// without an injected client (used by src/repositories/index.js only
// when env.useDatabase is true).
function createPrismaUserRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function findUserByEmail(email) {
    const row = await client.user.findUnique({ where: { email } });
    return toApiUser(row);
  }

  async function findUserById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = await client.user.findUnique({ where: { id: numericId } });
    return toApiUser(row);
  }

  async function createUser({ name, email, passwordHash }) {
    try {
      const row = await client.user.create({ data: { name, email, passwordHash } });
      return toApiUser(row);
    } catch (err) {
      // The service layer already checks for an existing email before
      // calling this — this is a safety net against races, per the
      // UserRepository contract.
      if (err.code === PRISMA_UNIQUE_CONSTRAINT) throw emailAlreadyExistsError();
      throw err;
    }
  }

  async function updateUser(id, data) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    try {
      const row = await client.user.update({ where: { id: numericId }, data });
      return toApiUser(row);
    } catch (err) {
      if (err.code === PRISMA_RECORD_NOT_FOUND) return null;
      if (err.code === PRISMA_UNIQUE_CONSTRAINT) throw emailAlreadyExistsError();
      throw err;
    }
  }

  return { findUserByEmail, findUserById, createUser, updateUser };
}

module.exports = createPrismaUserRepository;
