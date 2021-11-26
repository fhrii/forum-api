import pool from '../../database/postgres/pool';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import createServer from '../createServer';
import container from '../../container';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper';

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted thread comment reply', async () => {
      // Arrange
      const requestPayload = { content: 'some reply content' };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding',
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
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some title',
          body: 'some thread body',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const threadPayload = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadPayload.data.addedThread;
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comment content',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const commentPayload = JSON.parse(commentResponse.payload);
      const { id: commentId } = commentPayload.data.addedComment;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding',
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
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some title',
          body: 'some thread body',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const threadPayload = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadPayload.data.addedThread;
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comment content',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const commentPayload = JSON.parse(commentResponse.payload);
      const { id: commentId } = commentPayload.data.addedComment;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
      const requestPayload = { content: 123 };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding',
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
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some title',
          body: 'some thread body',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const threadPayload = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadPayload.data.addedThread;
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comment content',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const commentPayload = JSON.parse(commentResponse.payload);
      const { id: commentId } = commentPayload.data.addedComment;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
  });

  describe('when /threads/{threadId}/comments/{commentId}/replies/{id}', () => {
    it('should response 200 when reply deleted correctly', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding',
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
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some title',
          body: 'some thread body',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const threadPayload = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadPayload.data.addedThread;
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comment content',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const commentPayload = JSON.parse(commentResponse.payload);
      const { id: commentId } = commentPayload.data.addedComment;
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'some reply content',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const replyPayload = JSON.parse(replyResponse.payload);
      const { id: replyId } = replyPayload.data.addedReply;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when delete reply with wrong owner', async () => {
      // Arrange
      const server = await createServer(container);
      await Promise.all([
        server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding',
            password: 'secret',
            fullname: 'dicoding',
          },
        }),
        server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding2',
            password: 'secret',
            fullname: 'dicoding',
          },
        }),
      ]);
      const [authResponse, authResponse2] = await Promise.all([
        server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'dicoding',
            password: 'secret',
          },
        }),
        server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'dicoding2',
            password: 'secret',
          },
        }),
      ]);
      const authPayload = JSON.parse(authResponse.payload);
      const authPayload2 = JSON.parse(authResponse2.payload);
      const { accessToken } = authPayload.data;
      const { accessToken: accessToken2 } = authPayload2.data;
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some title',
          body: 'some thread body',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const threadPayload = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadPayload.data.addedThread;
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comment content',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const commentPayload = JSON.parse(commentResponse.payload);
      const { id: commentId } = commentPayload.data.addedComment;
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'some reply content',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const replyPayload = JSON.parse(replyResponse.payload);
      const { id: replyId } = replyPayload.data.addedReply;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `bearer ${accessToken2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when reply not found', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding',
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
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some title',
          body: 'some thread body',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const threadPayload = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadPayload.data.addedThread;
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comment content',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const commentPayload = JSON.parse(commentResponse.payload);
      const { id: commentId } = commentPayload.data.addedComment;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-123`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding',
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
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some title',
          body: 'some thread body',
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const threadPayload = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadPayload.data.addedThread;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-123/replies/reply-123`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding',
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
