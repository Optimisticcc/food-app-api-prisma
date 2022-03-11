import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
import passport from 'passport';
import {
  index,
  show,
  signUp,
  update,
  logIn,
  remove,
  getProfile,
  editProfile,
  userInfo,
} from '../controllers/customer.controller';
// import {
//   signUp,
//   signIn,
//   logout,
//   forgotPassword,
//   resetPasswordHandler,
//   getProfile,
//   editProfile,
//   sendVerificationEmail,
//   verifyEmail,
//   getUserRole,
//   changePasswordHandler,
//   getCatsOfUser,
//   verifyAccountCreateByAdminHandler,
// } from '../controllers/user.controller';

import { requireLogin, requireAdmin } from '../../middlewares/requireUser';

const passportConfig = require('../../middlewares/handlePassport');

router.route('/').get(requireLogin, index).post(signUp);

// router.route('/signUp').post(signUp);

router
  .route('/login')
  .post(passport.authenticate('local', { session: false }), logIn);

router.route('/me').get(requireLogin, userInfo);

router
  .route('/profile')
  .get(requireLogin, getProfile)
  .put(requireLogin, editProfile);

router
  .route('/:id')
  .get(show)
  .put(requireLogin, update)
  .delete(requireLogin, remove);

export default router;
