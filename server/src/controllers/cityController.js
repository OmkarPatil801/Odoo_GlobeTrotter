const { success } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// cityService instance. Controllers only handle req/res and delegate
// everything else to the service.
function createCityController(cityService) {
  async function list(req, res, next) {
    try {
      const { search, countryCode, country, region, page, limit } = req.query;
      const { items, meta } = await cityService.listCities({ search, countryCode, country, region, page, limit });
      return success(res, items, meta);
    } catch (err) {
      return next(err);
    }
  }

  async function getById(req, res, next) {
    try {
      const city = await cityService.getCityById(req.params.id);
      return success(res, { city });
    } catch (err) {
      return next(err);
    }
  }

  async function search(req, res, next) {
    try {
      const cities = await cityService.searchCities(req.query.q);
      return success(res, cities);
    } catch (err) {
      return next(err);
    }
  }

  return { list, getById, search };
}

module.exports = createCityController;
