import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper';
import NewReply from '../../../Domains/replies/entities/NewReply';
import pool from '../../database/postgres/pool';
import NotFoundError from '../../../Commons/exceptions/NotFoundError';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError';

describe('ReplyRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add reply to database', async () => {
      // Arrange
      const newReply = new NewReply({ content: 'some reply content' });
      const fakeIdGenerator = () => 123;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(
        newReply,
        'comment-123',
        'user-123'
      );

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should get comment replies correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});
      await RepliesTableTestHelper.addReply({
        id: 'reply-124',
        isDeleted: true,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        'comment-123'
      );

      // Assert
      expect(replies).toHaveLength(2);
      const reply = replies[0];
      const deletedReply = replies[1];
      expect(reply.id).toEqual('reply-123');
      expect(reply.username).toEqual('dicoding');
      expect(reply.date).toBeDefined();
      expect(reply.content).toEqual('some reply content');
      expect(reply).not.toHaveProperty('is_deleted');
      expect(deletedReply.id).toEqual('reply-124');
      expect(deletedReply.username).toEqual('dicoding');
      expect(deletedReply.date).toBeDefined();
      expect(deletedReply.content).toEqual('**balasan telah dihapus**');
      expect(deletedReply).not.toHaveProperty('is_deleted');
    });
  });

  describe('deleteReply function', () => {
    it('should delete comment reply correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.deleteReply('comment-123', 'reply-123')
      ).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw error when thread, comment, or reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.deleteReply(
          'thread-123',
          'comment-123',
          'reply-123'
        )
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyReply function', () => {
    it('should throw error when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReply('reply-123', 'user-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw error when owner not own the reply', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReply('reply-123', 'user-234')
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when owner own the reply', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReply('reply-123', 'user-123')
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });
});
