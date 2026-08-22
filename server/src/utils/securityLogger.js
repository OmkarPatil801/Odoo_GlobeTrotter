// Field names that must never reach a log line, wherever they show up in
// an event's `details` object — defense in depth beyond "just don't pass
// them in". Matched case-insensitively against object keys.
const SENSITIVE_KEY_PATTERN = /password|passwordhash|token|jwt|authorization|secret|databaseurl/i;

function redact(value) {
  if (Array.isArray(value)) {
    return value.map(redact);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = SENSITIVE_KEY_PATTERN.test(key) ? '[REDACTED]' : redact(val);
      return acc;
    }, {});
  }

  return value;
}

// Lightweight, dependency-free structured security logging — one JSON
// line per event on stdout/stderr, easy to ship to any log aggregator
// later without adding a logging framework now. Never log passwords,
// JWTs, Authorization headers, DATABASE_URL, or passwordHash: every
// `details` object passed in is redacted defensively (see
// SENSITIVE_KEY_PATTERN above) in addition to callers already being
// expected not to pass them in.
function logSecurityEvent(type, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level: 'security',
    type,
    ...redact(details),
  };

  // eslint-disable-next-line no-console
  console.warn(JSON.stringify(entry));
}

module.exports = { logSecurityEvent, redact };
