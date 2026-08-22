const DEFAULT_CITIES = require('./seedData/cities.seed');

// In-memory implementation of the CityRepository contract
// (see ./contracts/cityRepository.contract.js). Used until the database
// teammate provides a real implementation, and directly by tests.
//
// Internally stores rows keyed by a numeric autoincrement-style id, and
// only ever exposes a string id — the same string-in/number-in-storage/
// string-out conversion the real database-backed repository must do at
// this same boundary.
function createInMemoryCityRepository(seedCities = DEFAULT_CITIES) {
  const citiesById = new Map();

  seedCities.forEach((city, index) => {
    const numericId = index + 1;
    citiesById.set(numericId, { ...city, id: numericId });
  });

  function toApiCity(row) {
    return { ...row, id: String(row.id) };
  }

  async function findCityById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = citiesById.get(numericId);
    return row ? toApiCity(row) : null;
  }

  async function listCities(filters = {}) {
    const { search, countryCode, country, region, page, limit } = filters;

    let rows = Array.from(citiesById.values());

    if (search) {
      const needle = search.toLowerCase();
      rows = rows.filter((city) => city.name.toLowerCase().includes(needle));
    }
    if (countryCode) {
      const needle = countryCode.toUpperCase();
      rows = rows.filter((city) => city.countryCode.toUpperCase() === needle);
    }
    if (country) {
      const needle = country.toLowerCase();
      rows = rows.filter((city) => city.country.toLowerCase() === needle);
    }
    if (region) {
      const needle = region.toLowerCase();
      rows = rows.filter((city) => city.region.toLowerCase() === needle);
    }

    const total = rows.length;

    if (page && limit) {
      const start = (page - 1) * limit;
      rows = rows.slice(start, start + limit);
    }

    return { items: rows.map(toApiCity), total };
  }

  async function searchCities(query) {
    const needle = query.toLowerCase();
    const rows = Array.from(citiesById.values()).filter((city) => city.name.toLowerCase().includes(needle));
    return rows.map(toApiCity);
  }

  return { findCityById, listCities, searchCities };
}

module.exports = createInMemoryCityRepository;
