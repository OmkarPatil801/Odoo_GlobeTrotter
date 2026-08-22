/**
 * UserRepository contract.
 *
 * This is the interface the database teammate must implement (backed by
 * MySQL) and wire into src/repositories/index.js. Everything above this
 * layer — services, controllers, routes, the auth middleware, JWT logic —
 * only ever talks to this shape. Swapping the implementation must not
 * require changing any of those layers.
 *
 * All methods are async (return a Promise) so a real database-backed
 * implementation is a drop-in replacement for the in-memory one used until
 * then (see ../inMemoryUserRepository.js).
 *
 * User record shape returned by findUserByEmail / findUserById / createUser:
 *   {
 *     id: string,          // stable unique identifier
 *     name: string,
 *     email: string,       // stored normalized (lowercase, trimmed)
 *     passwordHash: string,// bcrypt hash — never sent to clients, see src/utils/sanitizeUser.js
 *     createdAt: string,   // ISO 8601 timestamp (UTC)
 *   }
 *
 * Required methods:
 *
 *   findUserByEmail(email: string): Promise<User | null>
 *     Look up a user by normalized email. Resolves to the user record,
 *     or null if no user has that email. Callers already normalize the
 *     email (lowercase/trim) before calling this.
 *
 *   findUserById(id: string): Promise<User | null>
 *     Look up a user by id. Resolves to the user record, or null if not
 *     found.
 *
 *   createUser(data: { name: string, email: string, passwordHash: string }): Promise<User>
 *     Persist a new user and resolve to the full created record (including
 *     generated id/createdAt). The service layer has already checked for
 *     an existing email before calling this, but a real implementation
 *     should still enforce uniqueness at the database level (e.g. a
 *     UNIQUE constraint on email) as a safety net against races.
 *
 *   updateUser(id: string, data: Partial<{ name: string, email: string }>): Promise<User>
 *     Apply a partial update to an existing user — currently only `name`
 *     and/or `email` are ever passed — and resolve to the full updated
 *     record. Only call this after confirming the user exists (via
 *     findUserById); implementations are not required to handle an
 *     unknown id gracefully. The service layer has already re-checked
 *     email uniqueness before calling this when email is changing, but a
 *     real implementation should still enforce it at the database level
 *     as a safety net against races. `data` never contains `passwordHash`
 *     or `id` — this method must not be used to change either.
 *
 * Do not assume any particular ORM/driver (no Prisma, no raw SQL client
 * assumed here) — implement this contract however MySQL access ends up
 * being wired.
 */
const USER_REPOSITORY_METHODS = ['findUserByEmail', 'findUserById', 'createUser', 'updateUser'];

module.exports = { USER_REPOSITORY_METHODS };
