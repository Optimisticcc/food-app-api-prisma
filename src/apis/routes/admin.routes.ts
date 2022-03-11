import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();

import {
  createUserProfileByAdmin,
  updateUserProfileByAdmin,
  softDeleteUserByAdmin,
  deletePersHandler,
  addPerDetailForPerHandler,
  getPerDetailOfPerHandler,
  getUserProfileHandler,
  getAllUserHandler,
  getPersHandler,
  getPersByUserIdHandler,
  filterPermision,
  updatePerDetail,
  createPerDetail,
  getPerDetailsOfUser,
  getPermisionByID,
  createPermisionHandler,
  addPerForUserHandler,
} from '../controllers/admin.controller';

import {
  requireLogin,
  requireEmployee,
  requireAdmin,
} from '../../middlewares/requireUser';

router
  .route('/create-user')
  .post(requireLogin, requireAdmin, createUserProfileByAdmin);

router
  .route('/get-all-user')
  .get(requireLogin, requireAdmin, getAllUserHandler);

router
  .route('/get-user-info/:id')
  .get(requireLogin, requireAdmin, getUserProfileHandler);

router
  .route('/delete-user')
  .delete(requireLogin, requireAdmin, softDeleteUserByAdmin);

router
  .route('/update-user-profile/:id')
  .put(requireLogin, requireAdmin, updateUserProfileByAdmin);

router.route('/filter-per').get(filterPermision);

router.route('/get-pers').get(requireLogin, requireAdmin, getPersHandler);
router
  .route('/get-pers-of-user/:id')
  .get(requireLogin, requireAdmin, getPersByUserIdHandler);

router
  .route('/get-per-details-of-user/:id')
  .get(requireLogin, requireAdmin, getPerDetailsOfUser);

router.route('/get-per/:id').get(requireLogin, requireAdmin, getPermisionByID);
router.route('/create-per').post(createPermisionHandler);

router
  .route('/delete-pers')
  .delete(requireLogin, requireAdmin, deletePersHandler);

router.route('/add-per-for-user').post(addPerForUserHandler);

router.route('/add-perdetail-for-per').post(addPerDetailForPerHandler);

router
  .route('/get-perdetail-of-per/:id')
  .get(requireLogin, getPerDetailOfPerHandler);

router
  .route('/create-perdetail')
  .post(requireLogin, requireAdmin, createPerDetail);

router.route('/perdetail/:id').put(requireLogin, requireAdmin, updatePerDetail);

export default router;
