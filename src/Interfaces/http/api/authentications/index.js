import AuthenticationsHandler from './handler';
import routes from './routes';

export default {
  name: 'authentications',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container);
    server.route(routes(authenticationsHandler));
  },
};
