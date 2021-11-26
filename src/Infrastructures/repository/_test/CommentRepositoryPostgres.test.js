import { util } from 'prettier';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError';
import NotFoundError from '../../../Commons/exceptions/NotFoundError';
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
      expect(comment.date).toBeDefined();
      expect(comment.content).toEqual('some comment content');
      expect(comment).not.toHaveProperty('is_deleted');
      expect(deletedComment.id).toEqual('comment-124');
      expect(deletedComment.username).toEqual('dicoding');
      expect(deletedComment.date).toBeDefined();
      expect(deletedComment.content).toEqual('**komentar telah dihapus**');
      expect(deletedComment).not.toHaveProperty('is_deleted');
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
