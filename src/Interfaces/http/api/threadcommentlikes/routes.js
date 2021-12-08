const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putThreadCommentLikeHandler,
    options: { auth: 'forumapi_jwt' },
  },
];

export default routes;
