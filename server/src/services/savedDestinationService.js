const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');

function cityNotFoundError() {
  return new AppError('City not found', HTTP_STATUS.NOT_FOUND, 'CITY_NOT_FOUND');
}

// Factory so the service can be wired to any repository implementations
// satisfying the SavedDestinationRepository/CityRepository contracts.
// Depends on cityRepository purely to 404 on a nonexistent city and to
// attach a light city summary to each saved row.
function createSavedDestinationService({ savedDestinationRepository, cityRepository }) {
  async function listSaved(userId) {
    const saved = await savedDestinationRepository.listSavedByUser(userId);
    const cities = await Promise.all(saved.map((row) => cityRepository.findCityById(row.cityId)));

    return saved.map((row, index) => ({
      ...row,
      city: cities[index] || null,
    }));
  }

  async function saveDestination(userId, cityId) {
    const city = await cityRepository.findCityById(cityId);
    if (!city) throw cityNotFoundError();

    return savedDestinationRepository.saveDestination(userId, cityId);
  }

  async function removeSavedDestination(userId, cityId) {
    await savedDestinationRepository.removeSavedDestination(userId, cityId);
  }

  return { listSaved, saveDestination, removeSavedDestination };
}

module.exports = createSavedDestinationService;
