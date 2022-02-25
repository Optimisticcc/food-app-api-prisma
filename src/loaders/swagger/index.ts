import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import env from '../../configs/env';
import path from 'path';
import YAML from 'yamljs';
const swaggerDocument = YAML.load(
  path.join(__dirname, '../../docs/swagger.yaml')
);

export default function swaggerLoader(app: Application) {
  if (env.isDevelopment) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}
