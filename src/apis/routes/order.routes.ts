import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
// import passport, { session } from 'passport';
import { requireLogin, requireEmployee } from '../../middlewares/requireUser';
import {
  index,
  show,
  create,
  filterOrders,
  momo,
  createByAdmin,
  remove,
} from '../controllers/order.controller';

// router
//   .route('/signIn')
//   .post(passport.authenticate('local', { session: false }), signIn);

// router.route('/signUp').post(signUp, sendVerificationEmail);

// router.route('/logout').get(requireUser, logout);
import { middleware as query } from '../../utils/querymen';
router.route('/').get(requireLogin, index).post(requireLogin, create);
router.route('/filter').get(requireLogin, query(), filterOrders);
router.route('/create').post(requireLogin, createByAdmin);
router.route('/momo').post(momo);
router.route('/:id').get(show).delete(requireLogin, remove);

export default router;
