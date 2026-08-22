// Allow-list (not deny-list) so newly added sensitive fields on the user
// record can't leak into a response just because someone forgot to strip
// them here. Every auth response must go through this before being sent.
function sanitizeUser(user) {
  if (!user) return user;

  const { id, name, email, createdAt } = user;
  return { id, name, email, createdAt };
}

module.exports = { sanitizeUser };
