import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import NotFoundError from '../../../Commons/exceptions/NotFoundError';
import AddedThread from '../../../Domains/threads/entities/AddedThread';
import NewThread from '../../../Domains/threads/entities/NewThread';
import pool from '../../database/postgres/pool';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres';

describe('TokenRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'dicoding backend',
        body: 'some thread body',
      });
      const expectedAddedThread = new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => 123;
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(newThread, 'user-123');

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        'thread-123'
      );
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual(expectedAddedThread.id);
      expect(threads[0].title).toEqual(expectedAddedThread.title);
      expect(threads[0].owner).toEqual(expectedAddedThread.owner);
    });
  });

  describe('getThread function', () => {
    it('should get thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('some title');
      expect(thread.body).toEqual('some thread body');
      expect(thread.username).toEqual('dicoding');
      expect(thread.created_at).toBeDefined();
    });

    it('should throw error when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-123')
      ).rejects.toThrowError('thread tidak ditemukan');
    });
  });

  describe('checkThreadExistance function', () => {
    it('should throw error when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkThreadExistance('thread-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when thread exists', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkThreadExistance('thread-123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
