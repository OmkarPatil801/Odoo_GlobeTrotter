/**
 * ActivityRepository contract.
 *
 * This is the interface the database teammate must implement (backed by
 * whatever the eventual database layer is) and wire into
 * src/repositories/activityRepository.js. Services, controllers, routes,
 * and validators are written only against this shape — swapping the
 * implementation must not require changing any of those layers.
 *
 * All methods are async (return a Promise) so a real database-backed
 * implementation is a drop-in replacement for the in-memory one used until
 * then (see ../inMemoryActivityRepository.js).
 *
 * Activity record shape:
 *   {
 *     id: string,             // API-facing id — same string/number
 *                              // conversion rule as CityRepository (see
 *                              // ./cityRepository.contract.js).
 *     cityId: string,         // API-facing id of the owning city.
 *     name: string,
 *     category: string,       // e.g. "MUSEUM", "TOUR", "FOOD" — no fixed
 *                              // enum assumed here; the database layer
 *                              // owns the actual category list.
 *     description: string,
 *     duration: number,       // minutes
 *     cost: number,
 *     currencyCode: string | undefined, // ISO 4217, e.g. "EUR", "JPY".
 *                              // Optional at this boundary: keep it
 *                              // undefined rather than defaulting to any
 *                              // single currency (never assume USD/INR/
 *                              // EUR) until the database column exists —
 *                              // once it's added, populate it and this
 *                              // stays a drop-in change.
 *     imageUrl: string,
 *   }
 *
 * Required methods:
 *
 *   findActivityById(id: string): Promise<Activity | null>
 *     Same id-conversion rule as CityRepository#findCityById. Resolve
 *     null if `id` isn't a valid id or no activity matches.
 *
 *   listActivitiesByCity(cityId: string, filters: {
 *     category?: string,
 *     minCost?: number,
 *     maxCost?: number,
 *     page?: number,
 *     limit?: number,
 *   }): Promise<{ items: Activity[], total: number }>
 *     Returns one page of activities belonging to `cityId` matching the
 *     filters, plus `total` across all pages. `page`/`limit` are already
 *     normalized positive integers by the time they reach here.
 *
 *   searchActivities(query: string, filters: {
 *     category?: string,
 *     minCost?: number,
 *     maxCost?: number,
 *   }): Promise<Activity[]>
 *     Case-insensitive name search across all cities, no pagination —
 *     backs GET /api/activities/search.
 *
 * Do not assume any particular ORM or driver — implement this contract
 * however database access ends up being wired.
 */
const ACTIVITY_REPOSITORY_METHODS = ['findActivityById', 'listActivitiesByCity', 'searchActivities'];

module.exports = { ACTIVITY_REPOSITORY_METHODS };
