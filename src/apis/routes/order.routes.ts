import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
// import passport, { session } from 'passport';
import { requireLogin, requireEmployee } from '../../middlewares/requireUser';
import {
  index,
  show,
  create,
  filterOrders,
} from '../controllers/order.controller';

// router
//   .route('/signIn')
//   .post(passport.authenticate('local', { session: false }), signIn);

// router.route('/signUp').post(signUp, sendVerificationEmail);

// router.route('/logout').get(requireUser, logout);

router.route('/').get(requireLogin, index).post(requireLogin, create);
router.route('/filter').get(requireLogin, filterOrders);

router.route('/:id').get(show);
// router.route('/send-mail-verify').post(sendVerificationEmail);

// router.route('/verify-email/:token').get(verifyEmail);

// router
//   .route('/verify-account-create-by-admin')
//   .post(verifyAccountCreateByAdminHandler);

// router.route('/send-email-forgot-password').post(forgotPassword);

// router.route('/reset-password/:token').post(resetPasswordHandler);

// router.route('/get-roles').get(requireUser, getUserRole);

// router.route('/change-password').post(requireUser, changePasswordHandler);

// router.route('/get-cats-of-user').get(requireUser, getCatsOfUser);

export default router;
