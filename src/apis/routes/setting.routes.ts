import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();

import { upload } from '../../utils/uploadImage';

import {
  index,
  create,
  update,
  remove,
  show,
  filter,
} from '../controllers/setting.controller';
import { requireLogin, requireEmployee } from '../../middlewares/requireUser';

// const passportConfig = require('../../middlewares/handlePassport');
router.route('/').get(index).post(requireLogin, create);

router.route('/filter').post(filter);
router
  .route('/:id')
  .get(show)
  .put(requireLogin, update)
  .delete(requireLogin, remove);

export default router;
// import passport, { session } from 'passport';

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

// import requireUser from '../../middlewares/requireUser';

// const passportConfig = require('../../middlewares/handlePassport');

// router
//   .route('/signIn')
//   .post(passport.authenticate('local', { session: false }), signIn);

// router.route('/signUp').post(signUp, sendVerificationEmail);

// router.route('/logout').get(requireUser, logout);

// router
//   .route('/profile')
//   .get(requireUser, getProfile)
//   .put(requireUser, editProfile);

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

// export default router;
