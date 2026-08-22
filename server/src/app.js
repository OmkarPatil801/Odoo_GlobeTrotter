const express = require('express');
const cors = require('cors');

const env = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const citiesRoutes = require('./routes/cities.routes');
const activitiesRoutes = require('./routes/activities.routes');
const tripsRoutes = require('./routes/trips.routes');
const communityRoutes = require('./routes/community.routes');
const sharedTripsRoutes = require('./routes/sharedTrips.routes');
const adminRoutes = require('./routes/admin.routes');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

// All application routes live under /api.
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/shared-trips', sharedTripsRoutes);
app.use('/api/admin', adminRoutes);

// Anything under /api that didn't match a route above.
app.use('/api', notFoundHandler);

app.use(errorHandler);

if (require.main === module) {
  app.listen(env.port, () => {
    console.log(`GlobeTrotter backend running on port ${env.port} [${env.nodeEnv}]`);
  });
}

module.exports = app;
