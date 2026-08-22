/**
 * ItineraryItemRepository contract.
 *
 * Mirrors the pattern in tripStopRepository.contract.js — services,
 * controllers, and routes are written only against this shape, never a
 * specific ORM.
 *
 * ItineraryItem record shape:
 *   {
 *     id: string,
 *     tripId: string,
 *     cityId: string,
 *     activityId: string | null,   // an activity can be removed from the
 *                                   // catalog without deleting the item
 *                                   // (see ../prisma/itineraryItemRepository.prisma.js)
 *     activityDate: string,        // calendar date, "YYYY-MM-DD"
 *     startTime: string | null,    // "HH:MM" (24h), or null
 *     endTime: string | null,      // "HH:MM" (24h), or null
 *     itemOrder: number,           // 1-based position within the day
 *     notes: string | null,
 *     createdAt: string,           // ISO 8601 timestamp (UTC)
 *     updatedAt: string,           // ISO 8601 timestamp (UTC)
 *   }
 *
 * Required methods:
 *
 *   listItemsByTrip(tripId: string, filters?: { activityDate?: string }): Promise<ItineraryItem[]>
 *     All items for the trip, optionally filtered to one calendar date.
 *     Ordered by activityDate ascending, then itemOrder ascending —
 *     this is what makes a day-wise itinerary view a single query.
 *     Trip ownership has already been verified by the service layer.
 *
 *   findItemById(id: string): Promise<ItineraryItem | null>
 *     Resolve null (not throw) if `id` isn't a valid id or no item
 *     matches. The service layer is responsible for also checking the
 *     resolved item's `tripId` matches the trip in the URL.
 *
 *   createItem(tripId: string, data: {
 *     cityId: string,
 *     activityId?: string | null,
 *     activityDate: string,
 *     startTime?: string | null,
 *     endTime?: string | null,
 *     itemOrder: number,
 *     notes?: string | null,
 *   }): Promise<ItineraryItem>
 *     Trip ownership and city/activity existence have already been
 *     verified by the service layer.
 *
 *   updateItem(id: string, data: Partial<{
 *     cityId: string,
 *     activityId: string | null,
 *     activityDate: string,
 *     startTime: string | null,
 *     endTime: string | null,
 *     itemOrder: number,
 *     notes: string | null,
 *   }>): Promise<ItineraryItem | null>
 *     Resolve null if `id` no longer exists.
 *
 *   deleteItem(id: string): Promise<void>
 *     Idempotent — deleting an id that no longer exists is not an error.
 *
 *   reorderItems(tripId: string, activityDate: string, orderedItemIds: string[]): Promise<ItineraryItem[]>
 *     Assigns itemOrder 1..N following the order of `orderedItemIds`,
 *     scoped to one day, and resolves that day's items in their new
 *     order. The service layer has already validated that
 *     `orderedItemIds` contains exactly that day's existing item ids,
 *     each exactly once. Unlike trip_stops, there is no uniqueness
 *     constraint on (tripId, activityDate, itemOrder) in the database,
 *     so a real implementation may update directly to the final order —
 *     no two-phase negative-value dance is required here.
 *
 * Do not assume any particular ORM or driver — implement this contract
 * however database access ends up being wired.
 */
const ITINERARY_ITEM_REPOSITORY_METHODS = [
  'listItemsByTrip',
  'findItemById',
  'createItem',
  'updateItem',
  'deleteItem',
  'reorderItems',
];

module.exports = { ITINERARY_ITEM_REPOSITORY_METHODS };
