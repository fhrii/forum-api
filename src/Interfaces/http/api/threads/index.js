import ThreadsHandler from './handler';
import routes from './routes';

export default {
  name: 'threads',
  register: async (server, { container }) => {
    const threadHandler = new ThreadsHandler(container);
    server.route(routes(threadHandler));
  },
};
