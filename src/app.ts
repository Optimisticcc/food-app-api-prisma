import expressLoader from './loaders/express';
import swaggerLoader from './loaders/swagger';
import passportLoader from './loaders/passport';
import env from './configs/env';
import router from './apis/routes';

import { errorConverter, errorHandler } from './middlewares/handleError';
function initApp() {
  const app = expressLoader();

  // swagger
  swaggerLoader(app);
  passportLoader(app);

  router(app);

  // handle error
  app.use(errorConverter);
  app.use(errorHandler);

  app.listen(env.app.port, async () => {
    console.log(`server is running at http://localhost:${env.app.port}`);
  });
}

initApp();
