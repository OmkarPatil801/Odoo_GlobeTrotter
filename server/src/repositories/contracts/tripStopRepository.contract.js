/**
 * TripStopRepository contract.
 *
 * This is the interface the database teammate must implement (backed by
 * whatever the eventual database layer is) and wire into
 * src/repositories/index.js. Services, controllers, and routes are
 * written only against this shape.
 *
 * All methods are async (return a Promise) so a real database-backed
 * implementation is a drop-in replacement for the in-memory one used
 * until then (see ../inMemoryTripStopRepository.js).
 *
 * TripStop record shape:
 *   {
 *     id: string,             // same string<->number conversion rule as
 *                              // every other repository in this codebase.
 *     tripId: string,
 *     cityId: string,
 *     stopOrder: number,      // 1-based position within the trip.
 *     arrivalDate: string | null,   // calendar date, "YYYY-MM-DD"
 *     departureDate: string | null, // calendar date, "YYYY-MM-DD"
 *     notes: string | null,
 *     createdAt: string,      // ISO 8601 timestamp (UTC)
 *     updatedAt: string,      // ISO 8601 timestamp (UTC)
 *   }
 *
 * Required methods:
 *
 *   listStopsByTrip(tripId: string): Promise<TripStop[]>
 *     All stops for the trip, ordered by stopOrder ascending. Trip
 *     ownership has already been verified by the service layer.
 *
 *   findStopById(id: string): Promise<TripStop | null>
 *     Resolve null (not throw) if `id` isn't a valid id or no stop
 *     matches. The service layer is responsible for also checking the
 *     resolved stop's `tripId` matches the trip in the URL.
 *
 *   createStop(tripId: string, data: {
 *     cityId: string,
 *     stopOrder: number,
 *     arrivalDate?: string | null,
 *     departureDate?: string | null,
 *     notes?: string | null,
 *   }): Promise<TripStop>
 *     Trip ownership and city existence have already been verified by
 *     the service layer.
 *
 *   updateStop(id: string, data: Partial<{
 *     cityId: string,
 *     stopOrder: number,
 *     arrivalDate: string | null,
 *     departureDate: string | null,
 *     notes: string | null,
 *   }>): Promise<TripStop | null>
 *     Ownership/trip-membership/city-existence have already been
 *     verified. Resolve null if `id` no longer exists.
 *
 *   deleteStop(id: string): Promise<void>
 *     Idempotent — deleting an id that no longer exists is not an error.
 *
 *   reorderStops(tripId: string, orderedStopIds: string[]): Promise<TripStop[]>
 *     Assigns stopOrder 1..N following the order of `orderedStopIds` and
 *     resolves the trip's stops in their new order. The service layer has
 *     already validated that `orderedStopIds` contains exactly the
 *     trip's existing stop ids, each exactly once — this method does not
 *     need to re-validate that.
 *
 *     IMPORTANT: the database enforces a uniqueness constraint on
 *     (tripId, stopOrder). A naive sequence of per-stop updates to the
 *     final order can violate that constraint mid-sequence (e.g.
 *     swapping two stops' order). A real implementation MUST perform the
 *     reorder as a single transaction that never leaves an intermediate
 *     write in a colliding state — e.g. move every affected stop to a
 *     temporary, guaranteed-unique value first (the reference Prisma
 *     implementation uses negative stopOrder, which the app never
 *     otherwise uses), then assign the final 1..N sequence. See
 *     ../prisma/tripStopRepository.prisma.js for the reference strategy.
 *
 * Do not assume any particular ORM or driver — implement this contract
 * however database access ends up being wired.
 */
const TRIP_STOP_REPOSITORY_METHODS = [
  'listStopsByTrip',
  'findStopById',
  'createStop',
  'updateStop',
  'deleteStop',
  'reorderStops',
];

module.exports = { TRIP_STOP_REPOSITORY_METHODS };
