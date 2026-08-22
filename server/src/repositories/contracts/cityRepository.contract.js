/**
 * CityRepository contract.
 *
 * This is the interface the database teammate must implement (backed by
 * whatever the eventual database layer is) and wire into
 * src/repositories/cityRepository.js. Services, controllers, routes, and
 * validators are written only against this shape — swapping the
 * implementation must not require changing any of those layers.
 *
 * All methods are async (return a Promise) so a real database-backed
 * implementation is a drop-in replacement for the in-memory one used until
 * then (see ../inMemoryCityRepository.js).
 *
 * City record shape:
 *   {
 *     id: string,          // API-facing id — always a string. The
 *                           // database uses an integer/autoincrement
 *                           // primary key; conversion happens at this
 *                           // repository boundary only — string in/out
 *                           // here, number in the database. Nothing above
 *                           // this layer ever sees a numeric id.
 *     name: string,
 *     country: string,
 *     countryCode: string, // ISO 3166-1 alpha-2, e.g. "FR"
 *     region: string,      // e.g. "Europe", "Asia", "Africa"
 *     latitude: number,
 *     longitude: number,
 *     timezone: string,    // IANA timezone identifier, e.g. "Europe/Paris"
 *     description: string,
 *     imageUrl: string,
 *   }
 *
 * Required methods:
 *
 *   findCityById(id: string): Promise<City | null>
 *     `id` is the API-facing string id. Convert it to the database's
 *     numeric id before querying, and convert the result's id back to a
 *     string before resolving. Resolve null (not throw) if `id` doesn't
 *     correspond to a real numeric id, or no city matches it — the
 *     service layer turns a null into a 404.
 *
 *   listCities(filters: {
 *     search?: string,
 *     countryCode?: string,
 *     country?: string,
 *     region?: string,
 *     page?: number,
 *     limit?: number,
 *   }): Promise<{ items: City[], total: number }>
 *     Returns one page of cities matching the filters (all optional — no
 *     filters means "all cities"), plus `total`: the count of matching
 *     rows across ALL pages (used to compute meta.totalPages). `page`/
 *     `limit` are already normalized positive integers by the time they
 *     reach here — just apply them as an offset/limit.
 *
 *   searchCities(query: string): Promise<City[]>
 *     Case-insensitive name search, no pagination — backs
 *     GET /api/cities/search. Must not assume an English-only or
 *     Latin-only alphabet.
 *
 * Do not assume any particular ORM or driver — implement this contract
 * however database access ends up being wired.
 */
const CITY_REPOSITORY_METHODS = ['findCityById', 'listCities', 'searchCities'];

module.exports = { CITY_REPOSITORY_METHODS };
