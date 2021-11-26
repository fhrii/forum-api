import ThreadCommentsHandler from './handler';
import routes from './routes';

export default {
  name: 'threadComments',
  register: async (server, { container }) => {
    const threadCommentHandler = new ThreadCommentsHandler(container);
    server.route(routes(threadCommentHandler));
  },
};
