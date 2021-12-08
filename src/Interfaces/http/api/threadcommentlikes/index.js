import ThreadCommentLikesHandler from './handler';
import routes from './routes';

export default {
  name: 'threadCommentLikes',
  register: async (server, { container }) => {
    const threadCommentLikeHandler = new ThreadCommentLikesHandler(container);

    server.route(routes(threadCommentLikeHandler));
  },
};
