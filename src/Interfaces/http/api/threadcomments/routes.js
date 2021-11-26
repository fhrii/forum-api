const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postThreadCommentHandler,
    options: { auth: 'forumapi_jwt' },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{id}',
    handler: handler.deleteThreadCommentHandler,
    options: { auth: 'forumapi_jwt' },
  },
];

export default routes;
