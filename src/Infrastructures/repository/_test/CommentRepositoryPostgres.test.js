import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError';
import NotFoundError from '../../../Commons/exceptions/NotFoundError';
import AddedComment from '../../../Domains/comments/entities/AddedComment';
import NewComment from '../../../Domains/comments/entities/NewComment';
import pool from '../../database/postgres/pool';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres';

describe('CommentRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment to database', async () => {
      // Arrange
      const newComment = new NewComment({ content: 'some comment content' });
      const expectedAddedThread = new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => 123;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(
        newComment,
        'thread-123',
        'user-123'
      );

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual(expectedAddedThread.id);
      expect(comments[0].content).toEqual(expectedAddedThread.content);
      expect(comments[0].owner).toEqual(expectedAddedThread.owner);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should get thread comments correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-124',
        isDeleted: true,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      );

      // Assert
      expect(comments).toHaveLength(2);
      const comment = comments[0];
      const deletedComment = comments[1];
      expect(comment.id).toEqual('comment-123');
      expect(comment.username).toEqual('dicoding');
      expect(comment.created_at).toBeDefined();
      expect(comment.content).toEqual('some comment content');
      expect(comment.is_deleted).toEqual(false);
      expect(deletedComment.id).toEqual('comment-124');
      expect(deletedComment.username).toEqual('dicoding');
      expect(deletedComment.created_at).toBeDefined();
      expect(deletedComment.content).toEqual('some comment content');
      expect(deletedComment.is_deleted).toEqual(true);
    });
  });

  describe('deleteComment function', () => {
    it('should delete thread comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment('thread-123', 'comment-123')
      ).resolves.not.toThrowError();
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );
      expect(comments).toHaveLength(1);
      expect(comments[0].is_deleted).toEqual(true);
      expect(comments[0].content).not.toEqual('**komentar telah dihapus**');
    });

    it('should throw error when thread or comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment('thread-123', 'comment-123')
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyComment function', () => {
    it('should throw error when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyComment('comment-123', 'user-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw error when owner not own the comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyComment('comment-123', 'user-234')
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not error when owner own the comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyComment('comment-123', 'user-123')
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('checkCommentExistance function', () => {
    it('should throw error when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Arrange
      await expect(
        commentRepositoryPostgres.checkCommentExistance('comment-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when comment exists', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Arrange
      await expect(
        commentRepositoryPostgres.checkCommentExistance('comment-123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
