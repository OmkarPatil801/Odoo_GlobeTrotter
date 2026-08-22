const crypto = require('crypto');

// In-memory implementation of the UserRepository contract
// (see ./contracts/userRepository.contract.js). Used until the database
// teammate provides a MySQL-backed implementation, and directly by tests
// to exercise the auth layer without a real database.
//
// Every call to this factory returns a fresh, isolated store — nothing is
// shared between instances.
function createInMemoryUserRepository() {
  const usersById = new Map();

  async function findUserByEmail(email) {
    for (const user of usersById.values()) {
      if (user.email === email) return { ...user };
    }
    return null;
  }

  async function findUserById(id) {
    const user = usersById.get(id);
    return user ? { ...user } : null;
  }

  async function createUser({ name, email, passwordHash }) {
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    usersById.set(user.id, user);
    return { ...user };
  }

  async function updateUser(id, data) {
    const existing = usersById.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...data };
    usersById.set(id, updated);
    return { ...updated };
  }

  return { findUserByEmail, findUserById, createUser, updateUser };
}

module.exports = createInMemoryUserRepository;
