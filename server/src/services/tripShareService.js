const crypto = require('crypto');
const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');

function tripNotFoundError() {
  return new AppError('Trip not found', HTTP_STATUS.NOT_FOUND, 'TRIP_NOT_FOUND');
}

function shareNotFoundError() {
  return new AppError('Shared itinerary not found', HTTP_STATUS.NOT_FOUND, 'TRIP_SHARE_NOT_FOUND');
}

function generateShareToken() {
  return crypto.randomBytes(24).toString('hex');
}

// Factory so the service can be wired to any repository implementations
// satisfying the Trip/TripStop/ItineraryItem/TripShare repository
// contracts. Owns both halves of sharing: the authenticated
// create/revoke flow (trip owner only) and the public read-only lookup
// by token (no auth — see tripShares.routes.js).
function createTripShareService({ tripRepository, tripStopRepository, itineraryItemRepository, tripShareRepository }) {
  async function assertTripOwnership(tripId, userId) {
    const trip = await tripRepository.findTripById(tripId);
    if (!trip || trip.userId !== userId) {
      throw tripNotFoundError();
    }
    return trip;
  }

  // Reuses an existing active share instead of minting a new token every
  // time the owner clicks "share" again.
  async function createOrReuseShare(tripId, userId) {
    await assertTripOwnership(tripId, userId);

    const existing = await tripShareRepository.findActiveShareByTripId(tripId);
    if (existing) return existing;

    return tripShareRepository.createShare(tripId, { shareToken: generateShareToken(), expiresAt: null });
  }

  async function revokeShare(tripId, userId) {
    await assertTripOwnership(tripId, userId);
    await tripShareRepository.deactivateShare(tripId);
  }

  // Public lookup — no ownership check, since the whole point is that
  // anyone holding the token can view the (read-only) itinerary.
  async function getSharedTrip(shareToken) {
    const share = await tripShareRepository.findShareByToken(shareToken);
    if (!share || !share.isActive) throw shareNotFoundError();
    if (share.expiresAt && new Date(share.expiresAt).getTime() < Date.now()) {
      throw shareNotFoundError();
    }

    const trip = await tripRepository.findTripById(share.tripId);
    if (!trip) throw shareNotFoundError();

    const [stops, items] = await Promise.all([
      tripStopRepository.listStopsByTrip(share.tripId),
      itineraryItemRepository.listItemsByTrip(share.tripId),
    ]);

    return { trip, stops, itineraryItems: items };
  }

  return { createOrReuseShare, revokeShare, getSharedTrip };
}

module.exports = createTripShareService;
