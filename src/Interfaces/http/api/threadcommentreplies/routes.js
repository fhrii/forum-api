const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postThreadCommentReplyHandler,
    options: { auth: 'forumapi_jwt' },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{id}',
    handler: handler.deleteThreadCommentReplyHandler,
    options: { auth: 'forumapi_jwt' },
  },
];

export default routes;
