import PromiseRouter from 'express-promise-router';
import {
  addUserRegister,
  getAllUserRegister,
  getUserRegister,
  deleteUserRegister,
  getAllUserCollaborator,
  addUserCollaborator,
  getUserCollaborator,
  deleteUserCollaborator,
  getAllPreQualificationUser,
  getPreQualificationUser,
  deletePreQualificationUser,
  addPreQualificationUser,
  uploadImageHandler,
  filterUserRegistrationByType,
  filterUserRegistrationByTypeAndDate,
  editImageHandler,
  getUserRegisterFilter,
  getUserCollaboratorFilter,
  exportExcelUserRegister,
  exportExcelUserCollaborator,
  exportExcelUserPrequalification,

} from '../controllers/other.controller';

import { upload } from '../../utils';

import requireUser, { requireAdmin0 } from '../../middlewares/requireUser';
const router = PromiseRouter();
router
  .route('/user-register/')
  .get(getAllUserRegister)
  .post(addUserRegister)


router.route('/user-register/filter')
  .post(getUserRegisterFilter)

router.route('/user-register/export-excel')
  .get(exportExcelUserRegister)

// router.route('/user-register/filter-by-type').post(filterUserRegistrationByType);
// router
//   .route('/user-register/filter-by-type-date')
//   .get(filterUserRegistrationByTypeAndDate);
router.route('/user-register/:id').get(getUserRegister).delete(deleteUserRegister);




router
  .route('/user-collaborator/')
  .get(getAllUserCollaborator)
  .post(addUserCollaborator)

router.route('/user-collaborator/export-excel')
  .get(exportExcelUserCollaborator)

router.route('/user-collaborator/filter')
  .post(getUserCollaboratorFilter)
router.route('/user-collaborator/:id').get(getUserCollaborator).delete(deleteUserCollaborator);

router
  .route('/user-pre-qualification/')
  .get(getAllPreQualificationUser)
  .post(addPreQualificationUser)

router.route('/user-pre-qualification/export-excel')
  .get(exportExcelUserPrequalification)

router.route('/user-pre-qualification/:id').get(getPreQualificationUser).delete(deletePreQualificationUser);

// image
router
  .route('/upload-image')
  .post(requireUser, upload.single('image'), uploadImageHandler);

router.route('/edit-image/:id')
  .post(requireAdmin0, upload.single('image'), editImageHandler);

export default router;
