import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
import {
  index,
  create,
  update,
  remove,
  show,
} from '../controllers/blog.controller';
import {
  requireLogin,
  requireEmployee,
  requireAdmin,
} from '../../middlewares/requireUser';

// import requireUser from '../../middlewares/requireUser';

// const passportConfig = require('../../middlewares/handlePassport');
router.route('/').get(index).post(requireLogin, create);

// router.route('/:slug').get();

router
  .route('/:id')
  .get(show)
  .put(requireLogin, update)
  .delete(requireLogin, remove);
export default router;
