import dotenv from 'dotenv';

import createServer from './Infrastructures/http/createServer';
import container from './Infrastructures/container';

dotenv.config();

(async () => {
  const server = await createServer(container);

  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
