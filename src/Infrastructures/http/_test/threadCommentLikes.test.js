import CommentLikesTableHelper from '../../../../tests/CommentLikesTableHelper';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import container from '../../container';
import pool from '../../database/postgres/pool';
import createServer from '../createServer';

describe('/threads/{threadId}/comments/{commentId}/likes', () => {
  afterEach(async () => {
    await CommentLikesTableHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and return status success', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding indonesia',
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
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
