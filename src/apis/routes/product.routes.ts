import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
import {
  index,
  create,
  update,
  remove,
  show,
  getProductByCode,
  getAllProductByCategory,
} from '../controllers/product.controller';
import { requireLogin, requireEmployee } from '../../middlewares/requireUser';
import { middleware as query } from '../../utils/querymen';
router.route('/').get(query(), index).post(requireLogin, create);

router.route('/get-product-by-category').post(getAllProductByCategory);

router
  .route('/:id')
  .get(show)
  .put(requireLogin, update)
  .delete(requireLogin, remove);
export default router;
