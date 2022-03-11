import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
import passport from 'passport';
import {
  index,
  signUp,
  signIn,
  getUserPermision,
  getUserPermisionDetails,
  userInfo,
  show,
  remove,
  update,
  editProfile,
} from '../controllers/user.controller';

import { requireLogin, requireAdmin } from '../../middlewares/requireUser';

const passportConfig = require('../../middlewares/handlePassport');

router.route('/').get(requireLogin, requireAdmin, index);

router.route('/register').post(signUp);

router
  .route('/login')
  .post(passport.authenticate('local', { session: false }), signIn);

router.route('/me').get(requireLogin, userInfo);
router
  .route('/profile')
  //   .get(requireLogin, getProfile)
  .put(requireLogin, editProfile);

router
  .route('/:id')
  .get(show)
  .put(requireLogin, update)
  .delete(requireLogin, requireAdmin, remove);

export default router;
