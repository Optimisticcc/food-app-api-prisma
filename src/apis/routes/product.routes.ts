import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
import {
  index,
  create,
  update,
  remove,
  show,
} from '../controllers/product.controller';
import { requireLogin, requireEmployee } from '../../middlewares/requireUser';
router.route('/').get(index).post(requireLogin, create);

router
  .route('/:id')
  .get(show)
  .put(requireLogin, update)
  .delete(requireLogin, remove);
export default router;
