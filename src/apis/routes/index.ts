import { Application, Request, Response } from 'express';

import userRouter from './user.routes';
import adminRoute from './admin.routes';
import categoryRoute from './category.routes';
import postRoute from './post.routes';
import otherRoute from './other.routes';
import configRoute from './config.routes';

export default function routes(app: Application) {
  app.use('/api/user', userRouter);
  app.use('/api/admin', adminRoute);
  app.use('/api/category', categoryRoute);
  app.use('/api/post', postRoute);
  app.use('/api/other', otherRoute);
  app.use('/api/config', configRoute);
  app.use('/', (req: Request, res: Response) => {
    return res.status(200).json({
      message: 'API is running',
    });
  });
}
