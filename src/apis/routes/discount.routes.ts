import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
// import passport, { session } from 'passport';

import {
  index,
  create,
  update,
  remove,
  show,
  getDisCountByCode
} from '../controllers/discount.controller';
import { requireLogin, requireEmployee } from '../../middlewares/requireUser';

router.route('/').get(index).post(requireLogin, create);
router.route('/get-by-code/:code').get(requireLogin,getDisCountByCode)
router
  .route('/:id')
  .get(show)
  .put(requireLogin, update)
  .delete(requireLogin, remove);

export default router;
