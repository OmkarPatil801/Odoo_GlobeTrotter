/**
 * CommunityPostRepository contract.
 *
 * Mirrors the pattern in tripStopRepository.contract.js — services,
 * controllers, and routes are written only against this shape, never a
 * specific ORM.
 *
 * CommunityPost record shape:
 *   {
 *     id: string,
 *     userId: string,
 *     tripId: string | null,   // optional reference to the trip the
 *                               // post is about; surviving a deleted
 *                               // trip is expected (see
 *                               // server/database/README.md)
 *     title: string,
 *     content: string,
 *     imageUrl: string | null,
 *     createdAt: string,       // ISO 8601 timestamp (UTC)
 *     updatedAt: string,       // ISO 8601 timestamp (UTC)
 *   }
 *
 * Required methods:
 *
 *   listPosts(pagination: { page: number, limit: number }): Promise<{ items: CommunityPost[], total: number }>
 *     All posts, most recently created first.
 *
 *   findPostById(id: string): Promise<CommunityPost | null>
 *     Resolve null (not throw) if `id` isn't a valid id or no post
 *     matches.
 *
 *   createPost(userId: string, data: {
 *     tripId?: string | null,
 *     title: string,
 *     content: string,
 *     imageUrl?: string | null,
 *   }): Promise<CommunityPost>
 *
 * Do not assume any particular ORM or driver — implement this contract
 * however database access ends up being wired.
 */
const COMMUNITY_POST_REPOSITORY_METHODS = ['listPosts', 'findPostById', 'createPost'];

module.exports = { COMMUNITY_POST_REPOSITORY_METHODS };
