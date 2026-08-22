/**
 * TripRepository contract.
 *
 * This is the interface the database teammate must implement (backed by
 * whatever the eventual database layer is) and wire into
 * src/repositories/index.js. Services, controllers, and routes are
 * written only against this shape — swapping the implementation must not
 * require changing any of those layers.
 *
 * All methods are async (return a Promise) so a real database-backed
 * implementation is a drop-in replacement for the in-memory one used
 * until then (see ../inMemoryTripRepository.js).
 *
 * Trip record shape:
 *   {
 *     id: string,             // API-facing id — same string<->number
 *                              // conversion rule as every other repository
 *                              // in this codebase (see cityRepository.contract.js).
 *     userId: string,         // owning user's id, same conversion rule.
 *     name: string,
 *     description: string | null,
 *     startDate: string,      // calendar date, "YYYY-MM-DD" — no time or
 *                              // timezone component. Trip dates represent
 *                              // a day on a calendar, not an instant.
 *     endDate: string,        // calendar date, "YYYY-MM-DD"
 *     coverImageUrl: string | null,
 *     status: 'PLANNED' | 'ONGOING' | 'COMPLETED',
 *     isPublic: boolean,
 *     createdAt: string,      // ISO 8601 timestamp (UTC)
 *     updatedAt: string,      // ISO 8601 timestamp (UTC)
 *   }
 *
 * Required methods:
 *
 *   findTripById(id: string): Promise<Trip | null>
 *     Resolve null (not throw) if `id` isn't a valid id or no trip
 *     matches — the service layer turns that into a 404, and also uses
 *     this to check ownership (comparing the resolved trip's `userId`
 *     against the authenticated user).
 *
 *   listTripsByUser(userId: string, filters: {
 *     status?: 'PLANNED' | 'ONGOING' | 'COMPLETED',
 *     page?: number,
 *     limit?: number,
 *   }): Promise<{ items: Trip[], total: number }>
 *     Returns only trips owned by `userId`. `page`/`limit` are already
 *     normalized positive integers by the time they reach here.
 *
 *   createTrip(userId: string, data: {
 *     name: string,
 *     description?: string | null,
 *     startDate: string,
 *     endDate: string,
 *     coverImageUrl?: string | null,
 *   }): Promise<Trip>
 *     Creates a trip owned by `userId`. `status`/`isPublic` are not
 *     accepted here — a new trip always starts at the database's default
 *     (PLANNED / not public); callers use updateTrip to change them
 *     afterward.
 *
 *   updateTrip(id: string, data: Partial<{
 *     name: string,
 *     description: string | null,
 *     startDate: string,
 *     endDate: string,
 *     coverImageUrl: string | null,
 *     status: 'PLANNED' | 'ONGOING' | 'COMPLETED',
 *     isPublic: boolean,
 *   }>): Promise<Trip | null>
 *     Ownership has already been verified by the service layer before
 *     this is called — this may assume `id` belongs to a trip the caller
 *     is allowed to modify. Resolve null if `id` no longer exists (race
 *     with a delete) rather than throwing.
 *
 *   deleteTrip(id: string): Promise<void>
 *     Ownership has already been verified. Deleting an id that no longer
 *     exists is not an error (idempotent).
 *
 * Do not assume any particular ORM or driver — implement this contract
 * however database access ends up being wired.
 */
const TRIP_REPOSITORY_METHODS = ['findTripById', 'listTripsByUser', 'createTrip', 'updateTrip', 'deleteTrip'];

module.exports = { TRIP_REPOSITORY_METHODS };
