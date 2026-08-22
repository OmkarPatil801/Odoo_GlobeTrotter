const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');
const { normalizePagination, buildPaginationMeta } = require('../utils/pagination');

// Factory so the service can be wired to any repository implementation
// that satisfies the CityRepository contract
// (see src/repositories/contracts/cityRepository.contract.js).
function createCityService(cityRepository) {
  async function listCities({ search, countryCode, country, region, page, limit }) {
    const normalized = normalizePagination({ page, limit });

    const { items, total } = await cityRepository.listCities({
      search,
      countryCode,
      country,
      region,
      page: normalized.page,
      limit: normalized.limit,
    });

    return { items, meta: buildPaginationMeta({ ...normalized, total }) };
  }

  async function getCityById(id) {
    const city = await cityRepository.findCityById(id);
    if (!city) {
      throw new AppError('City not found', HTTP_STATUS.NOT_FOUND, 'CITY_NOT_FOUND');
    }
    return city;
  }

  async function searchCities(query) {
    return cityRepository.searchCities(query);
  }

  return { listCities, getCityById, searchCities };
}

module.exports = createCityService;
