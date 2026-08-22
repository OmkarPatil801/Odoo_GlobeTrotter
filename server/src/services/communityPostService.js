const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');

function postNotFoundError() {
  return new AppError('Community post not found', HTTP_STATUS.NOT_FOUND, 'COMMUNITY_POST_NOT_FOUND');
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

// Factory so the service can be wired to any repository implementation
// satisfying the CommunityPostRepository contract. Community posts are
// public reads — no ownership check on list/get, only on create (which
// always attaches the authenticated user as author, never a client-
// supplied userId).
function createCommunityPostService({ communityPostRepository }) {
  async function listPosts(pagination = {}) {
    const page = pagination.page || DEFAULT_PAGE;
    const limit = pagination.limit || DEFAULT_LIMIT;
    return communityPostRepository.listPosts({ page, limit });
  }

  async function getPostById(id) {
    const post = await communityPostRepository.findPostById(id);
    if (!post) throw postNotFoundError();
    return post;
  }

  async function createPost(userId, data) {
    return communityPostRepository.createPost(userId, {
      tripId: data.tripId !== undefined ? data.tripId : null,
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl : null,
    });
  }

  return { listPosts, getPostById, createPost };
}

module.exports = createCommunityPostService;
