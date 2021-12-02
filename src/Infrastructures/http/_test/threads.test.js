import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import container from '../../container';
import pool from '../../database/postgres/pool';
import createServer from '../createServer';

describe('/threads endpoint', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'some title',
        body: 'some thread body',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authPayload = JSON.parse(authResponse.payload);
      const { accessToken } = authPayload.data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'some thread body',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authPayload = JSON.parse(authResponse.payload);
      const { accessToken } = authPayload.data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: 'some thread body',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authPayload = JSON.parse(authResponse.payload);
      const { accessToken } = authPayload.data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should throw 401 when not contain authorization', async () => {
      // Arrange
      const requestPayload = {
        title: 'some title',
        body: 'some thread body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });
  });

  describe('when /GET threads', () => {
    it('should get detail thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      const { thread } = responseJson.data;
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('some title');
      expect(thread.body).toEqual('some thread body');
      expect(thread.date).toBeDefined();
      expect(thread.username).toEqual('dicoding');
      expect(thread.comments).toHaveLength(1);
      const comment = thread.comments[0];
      expect(comment.id).toEqual('comment-123');
      expect(comment.username).toEqual('dicoding');
      expect(comment.date).toBeDefined();
      expect(comment.content).toEqual('some comment content');
      expect(comment.replies).toHaveLength(1);
      const reply = comment.replies[0];
      expect(reply.id).toEqual('reply-123');
      expect(reply.content).toEqual('some reply content');
      expect(reply.date).toBeDefined();
      expect(reply.username).toEqual('dicoding');
    });

    it('should throw error when no thread', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
