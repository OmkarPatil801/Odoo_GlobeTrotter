const express = require('express');

const env = require('./config/env');
const securityHeaders = require('./middleware/security');
const corsMiddleware = require('./middleware/cors');
const { generalLimiter } = require('./middleware/rateLimiter');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const citiesRoutes = require('./routes/cities.routes');
const activitiesRoutes = require('./routes/activities.routes');
const tripsRoutes = require('./routes/trips.routes');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust the first proxy hop (load balancer/reverse proxy) so req.ip and
// the rate limiter key off the real client IP, not the proxy's. Safe to
// leave on in dev too — with no proxy in front, Express just uses the
// direct connection IP as before.
app.set('trust proxy', 1);

app.use(securityHeaders);
app.use(corsMiddleware);
app.use(express.json({ limit: env.jsonBodyLimit }));

// General API-wide rate limit — auth.routes.js additionally applies
// stricter register/login-specific limits on top of this.
app.use('/api', generalLimiter);

// All application routes live under /api.
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/trips', tripsRoutes);

// Anything under /api that didn't match a route above.
app.use('/api', notFoundHandler);

app.use(errorHandler);

if (require.main === module) {
  app.listen(env.port, () => {
    console.log(`GlobeTrotter backend running on port ${env.port} [${env.nodeEnv}]`);
  });
}

module.exports = app;
