import CommentLikesTableHelper from '../../../../tests/CommentLikesTableHelper';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import NotFoundError from '../../../Commons/exceptions/NotFoundError';
import pool from '../../database/postgres/pool';
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres';

describe('CommentLikeRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await CommentLikesTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentLike function', () => {
    it('should add comment like to database', async () => {
      // Arrange
      const fakeIdGenerator = () => 123;
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentLikeRepositoryPostgres.addCommentLike(
        'comment-123',
        'user-123'
      );

      // Assert
      const commentLikes = await CommentLikesTableHelper.findCommentLikesById(
        'commentlike-123'
      );
      expect(commentLikes).toHaveLength(1);
      expect(commentLikes[0].id).toEqual('commentlike-123');
      expect(commentLikes[0].comment_id).toEqual('comment-123');
      expect(commentLikes[0].owner).toEqual('user-123');
      expect(commentLikes[0].is_deleted).toEqual(false);
    });
  });

  describe('toggleCommentLike function', () => {
    it('should toggle comment like correctly', async () => {
      // Arrange
      await CommentLikesTableHelper.addCommentLike({});
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action
      await commentLikeRepositoryPostgres.toggleCommentLikeByCommentid(
        'commentlike-123'
      );

      // Assert
      const commentLikes =
        CommentLikesTableHelper.findCommentLikesById('commentlike-123');
      expect(commentLikes).toHaveLength(1);
      expect(commentLikes[0].is_deleted).toEqual(true);
    });
  });

  describe('getNumberOfCommentLikesByCommentId function', () => {
    it('should number of comment like correctly', async () => {
      // Arrange
      await Promise.all([
        CommentLikesTableHelper.addCommentLike({}),
        CommentLikesTableHelper.addCommentLike({
          id: 'commentlike-124',
          isDeleted: true,
        }),
      ]);
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const numberOfCommentLike =
        await commentLikeRepositoryPostgres.getNumberOfCommentLikesByCommentId(
          'comment-123'
        );

      // Assert
      const commentLikes = await CommentLikesTableHelper.findCommentLikesById(
        'comment-123'
      );
      expect(commentLikes).toHaveLength(2);
      expect(numberOfCommentLike).toEqual(1);
    });
  });

  describe('checkCommentLikeExistance function', () => {
    it('should not throw error when comment like exists', async () => {
      // Arrange
      await CommentLikesTableHelper.addCommentLike({});
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentLikeRepositoryPostgres.checkCommentLikeExistance(
          'commentlike-123'
        )
      ).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw error when comment like not found', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentLikeRepositoryPostgres.checkCommentLikeExistance(
          'commentlike-123'
        )
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
