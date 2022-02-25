import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();

import {
  createUserProfileByAdmin,
  updateUserProfileByAdmin,
  softDeleteUserByAdmin,
  createRoleHandler,
  addRoleForUserHandler,
  deleteRolesHandler,
  addCatsForRoleHandler,
  getCatsOfRoleHandler,
  updateCatsOfRoleHandler,
  getEnableOrgHandler,
  getOrgsHandler,
  createOrgHandler,
  getOrgByIdHandler,
  editOrgHandler,
  getUserOfOrgHandler,
  getChildOrgHandler,
  getUserProfileHandler,
  getAllUserHandler,
  getRolesHandler,
  getRolesByUserIdHandler
} from '../controllers/admin.controller';

import requireUser, { requireAdmin0 } from '../../middlewares/requireUser';
import { verifyEmail } from '../controllers/user.controller';

router.route('/create-account').post(requireAdmin0, createUserProfileByAdmin);

router.route('/get-all-user').get(requireAdmin0, getAllUserHandler);

router.route('/get-user-info/:id').get(requireAdmin0, getUserProfileHandler);

router.route('/delete-user').delete(requireAdmin0, softDeleteUserByAdmin);

router
  .route('/update-user-profile/:id')
  .put(requireAdmin0, updateUserProfileByAdmin);

router.route('/get-roles').get(requireAdmin0, getRolesHandler);
router.route('/get-roles/:id').get(requireAdmin0, getRolesByUserIdHandler);

router.route('/create-role').post(createRoleHandler);

router.route('/delete-roles').delete(requireAdmin0, deleteRolesHandler);

router.route('/add-role-for-user').post(addRoleForUserHandler);

router.route('/add-cats-for-role').post(addCatsForRoleHandler);

router.route('/get-cats-of-role/:id').get(requireUser, getCatsOfRoleHandler);

router
  .route('/update-cats-of-role/:id')
  .put(requireAdmin0, updateCatsOfRoleHandler);

// org
router.route('/organization/get-enable-org').get(getEnableOrgHandler);
router
  .route('/organization')
  .get(requireAdmin0, getOrgsHandler)
  .post(requireAdmin0, createOrgHandler);

router
  .route('/organization/:id')
  .get(requireUser, getOrgByIdHandler)
  .put(requireAdmin0, editOrgHandler);

router.route('/get-user-of-org/:id').get(requireUser, getUserOfOrgHandler);

router.route('/get-child-org/:id').get(requireUser, getChildOrgHandler);

export default router;
