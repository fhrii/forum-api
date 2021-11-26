import ThreadCommentRepliesHandler from './handler';
import routes from './routes';

export default {
  name: 'threadCommentReplies',
  register: async (server, { container }) => {
    const threadCommentRepliesHandler = new ThreadCommentRepliesHandler(
      container
    );
    server.route(routes(threadCommentRepliesHandler));
  },
};
