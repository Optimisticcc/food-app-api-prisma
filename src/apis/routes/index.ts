import { Application, Request, Response } from 'express';

export default function routes(app: Application) {
  // app.use('/api/user', userRouter);
  // app.use('/api/admin', adminRoute);
  // app.use('/api/blog', categoryRoute);
  // app.use('/api/blogcategory', postRoute);
  // app.use('/api/customer', otherRoute);
  // app.use('/api/image', configRoute);
  // app.use('/api/order', configRoute);
  // app.use('/api/productcategory', configRoute);
  // app.use('/api/product', configRoute);
  // app.use('/api/discount', configRoute);
  // app.use('/api/setting', configRoute);
  app.use('/', (req: Request, res: Response) => {
    return res.status(200).json({
      message: 'API is running',
    });
  });
}
