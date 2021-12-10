import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError';
import NotFoundError from '../../../Commons/exceptions/NotFoundError';
import AddedReply from '../../../Domains/replies/entities/AddedReply';
import NewReply from '../../../Domains/replies/entities/NewReply';
import pool from '../../database/postgres/pool';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres';

describe('ReplyRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
    await CommentsTableTestHelper.addComment({ id: 'comment-124' });
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
      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: newReply.content,
        owner: 'user-123',
      });
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
      expect(replies[0].id).toEqual(expectedAddedReply.id);
      expect(replies[0].content).toEqual(expectedAddedReply.content);
      expect(replies[0].owner).toEqual(expectedAddedReply.owner);
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should get comment replies correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});
      await RepliesTableTestHelper.addReply({
        id: 'reply-124',
        commentId: 'comment-124',
        isDeleted: true,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds([
        'comment-123',
        'comment-124',
      ]);

      // Assert
      expect(replies).toHaveLength(2);
      const reply = replies[0];
      const deletedReply = replies[1];
      expect(reply.id).toEqual('reply-123');
      expect(reply.username).toEqual('dicoding');
      expect(reply.created_at).toBeDefined();
      expect(reply.content).toEqual('some reply content');
      expect(reply.is_deleted).toEqual(false);
      expect(deletedReply.id).toEqual('reply-124');
      expect(deletedReply.username).toEqual('dicoding');
      expect(deletedReply.created_at).toBeDefined();
      expect(deletedReply.content).toEqual('some reply content');
      expect(deletedReply.is_deleted).toEqual(true);
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
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
      expect(replies[0].is_deleted).toEqual(true);
    });

    it('should throw error when thread, comment, or reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.deleteReply('comment-123', 'reply-123')
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
