/**
 * TripShareRepository contract.
 *
 * Mirrors the pattern in tripStopRepository.contract.js — services,
 * controllers, and routes are written only against this shape, never a
 * specific ORM.
 *
 * TripShare record shape:
 *   {
 *     id: string,
 *     tripId: string,
 *     shareToken: string,       // opaque, unguessable, unique
 *     isActive: boolean,
 *     createdAt: string,        // ISO 8601 timestamp (UTC)
 *     expiresAt: string | null, // ISO 8601 timestamp (UTC), or null (never expires)
 *   }
 *
 * Required methods:
 *
 *   findActiveShareByTripId(tripId: string): Promise<TripShare | null>
 *     The trip's current active share, if any (a trip has at most one
 *     active share at a time in this app's usage pattern — the service
 *     layer reuses it instead of creating duplicates on repeat "share"
 *     calls).
 *
 *   findShareByToken(shareToken: string): Promise<TripShare | null>
 *     Resolve null (not throw) if no share has that token. The service
 *     layer checks `isActive`/`expiresAt` itself — this method resolves
 *     whatever row matches, active or not.
 *
 *   createShare(tripId: string, data: { shareToken: string, expiresAt?: string | null }): Promise<TripShare>
 *
 *   deactivateShare(tripId: string): Promise<void>
 *     Marks the trip's active share (if any) inactive. Idempotent — a
 *     trip with no active share is not an error.
 *
 * Do not assume any particular ORM or driver — implement this contract
 * however database access ends up being wired.
 */
const TRIP_SHARE_REPOSITORY_METHODS = ['findActiveShareByTripId', 'findShareByToken', 'createShare', 'deactivateShare'];

module.exports = { TRIP_SHARE_REPOSITORY_METHODS };
