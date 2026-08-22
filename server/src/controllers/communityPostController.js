const { success, created } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// communityPostService instance. Controllers only handle req/res.
function createCommunityPostController(communityPostService) {
  async function list(req, res, next) {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const { items, total } = await communityPostService.listPosts({ page, limit });
      const effectiveLimit = limit || 20;
      const effectivePage = page || 1;
      return success(res, items, {
        page: effectivePage,
        limit: effectiveLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / effectiveLimit)),
      });
    } catch (err) {
      return next(err);
    }
  }

  async function getById(req, res, next) {
    try {
      const post = await communityPostService.getPostById(req.params.id);
      return success(res, { post });
    } catch (err) {
      return next(err);
    }
  }

  async function create(req, res, next) {
    try {
      const { tripId, title, content, imageUrl } = req.body;
      const post = await communityPostService.createPost(req.user.id, { tripId, title, content, imageUrl });
      return created(res, { post });
    } catch (err) {
      return next(err);
    }
  }

  return { list, getById, create };
}

module.exports = createCommunityPostController;
