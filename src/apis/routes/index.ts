import { Application, Request, Response } from 'express';
import userRouter from './user.routes';
import blogRouter from './blog.routes';
import blogcategoryRouter from './blogcategory.routes';
import customerRouter from './customer.routes';
import discountRouter from './discount.routes';
import imageRouter from './image.routes';
import adminRouter from './admin.routes';
import orderRouter from './order.routes';
import productRouter from './product.routes';
import productcategoryRouter from './productcategory.routes';
import settingRouter from './setting.routes';

export default function routes(app: Application) {
  // app.use('/api/user', userRouter);
  // // app.use('/api/admin', adminRoute);
  // app.use('/api/blog', blogRouter);
  // app.use('/api/blogcategory', blogcategoryRouter);
  // app.use('/api/customer', customerRouter);
  // app.use('/api/image', imageRouter);
  // // app.use('/api/order', configRoute);
  // app.use('/api/productcategory', productcategoryRouter);
  // app.use('/api/product', productRouter);
  // app.use('/api/discount', discountRouter);
  // app.use('/api/setting', settingRouter);

  app.use('/api/sanphams', productRouter);
  app.use('/api/taikhoans', userRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/hinhanhs', imageRouter);
  app.use('/api/danhmucsps', productcategoryRouter);
  app.use('/api/danhmucblogs', blogcategoryRouter);
  app.use('/api/giamgias', discountRouter);
  app.use('/api/donhangs', orderRouter);
  app.use('/api/khachhangs', customerRouter);
  app.use('/api/blogs', blogRouter);
  app.use('/api/settings', settingRouter);
  // app.use('/', (req: Request, res: Response) => {
  //   return res.status(200).json({
  //     message: 'API is running',
  //   });
  // });
}
