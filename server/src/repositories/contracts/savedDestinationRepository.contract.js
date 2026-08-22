/**
 * SavedDestinationRepository contract.
 *
 * Mirrors the pattern in tripStopRepository.contract.js — services,
 * controllers, and routes are written only against this shape, never a
 * specific ORM. Unlike most resources in this codebase, a saved
 * destination has no single-column id — it's identified by the
 * (userId, cityId) pair, matching the database's composite primary key.
 *
 * SavedDestination record shape:
 *   {
 *     userId: string,
 *     cityId: string,
 *     savedAt: string,   // ISO 8601 timestamp (UTC)
 *   }
 *
 * Required methods:
 *
 *   listSavedByUser(userId: string): Promise<SavedDestination[]>
 *     All destinations the user has saved, most recently saved first.
 *
 *   saveDestination(userId: string, cityId: string): Promise<SavedDestination>
 *     Saving a city the user has already saved is idempotent — resolve
 *     the existing record rather than throwing (the service layer does
 *     not treat re-saving as an error).
 *
 *   removeSavedDestination(userId: string, cityId: string): Promise<void>
 *     Idempotent — removing a pair that was never saved is not an error.
 *
 * Do not assume any particular ORM or driver — implement this contract
 * however database access ends up being wired.
 */
const SAVED_DESTINATION_REPOSITORY_METHODS = ['listSavedByUser', 'saveDestination', 'removeSavedDestination'];

module.exports = { SAVED_DESTINATION_REPOSITORY_METHODS };
