const helmet = require('helmet');

// Sensible default security headers (helmet) for a pure JSON API consumed
// by a separate-origin frontend. Cross-origin access control itself is
// handled by src/middleware/cors.js — these headers are a second,
// independent layer (clickjacking, MIME-sniffing, HSTS, etc.).
//
// Two of helmet's defaults are deliberately relaxed, because this API
// serves no HTML/embedded content and is explicitly meant to be called
// cross-origin by the frontend:
//
//   - crossOriginEmbedderPolicy: helmet enables COEP (`require-corp`) by
//     default. COEP exists to let a page safely embed cross-origin
//     resources; this server never embeds anything, so leaving it on
//     adds no real protection here and only risks confusing interactions
//     for browser clients. Disabled.
//   - crossOriginResourcePolicy: helmet defaults to `same-origin`, which
//     is meant for resources (scripts, images, etc.) that should NOT be
//     loadable by other origins. This API is a REST API explicitly meant
//     to be fetched from the frontend's (different) origin, so it's set
//     to `cross-origin` instead of the default.
//
// Every other helmet default is left as-is: Content-Security-Policy,
// X-Content-Type-Options: nosniff, X-Frame-Options: DENY,
// Strict-Transport-Security, Referrer-Policy, and X-Powered-By removal.
const securityHeaders = helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

module.exports = securityHeaders;
