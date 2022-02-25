import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();

import requireUser, { requireAdmin0 } from '../../middlewares/requireUser';
import {
  getAllPublicConfigHandler,
  getAllConfigHandler,
  getConfigsByTypeHandler,
  getActiveConfigsByTypeHandler,
  addConfigHandler,
  editConfigHandler,
  getConfigByIdHandler,
  deleteConfigHandler,
  getConfigsBySectionHandler,
  getActiveConfigsBySectionHandler, getActiveConfigsBySectionAndTypeHandler, getActiveConfigsFilter,
} from '../controllers/config.controller';

// get all public config
router.route('/get-all-public-config').get(getAllPublicConfigHandler);

// get all config
router.route('/get-all-public-config').get(requireUser, getAllConfigHandler);

// get config by type
router.route('/get-configs-by-type').post(requireUser, getConfigsByTypeHandler);

// get public config by type
router.route('/get-active-configs-by-type').post(getActiveConfigsByTypeHandler);


router.route('/filter-active-config')
  .post(getActiveConfigsFilter)

// get config by type
router
  .route('/get-configs-by-section')
  .post(requireUser, getConfigsBySectionHandler);

// get public config by type
router
  .route('/get-active-configs-by-section')
  .post(getActiveConfigsBySectionHandler);

router.route('/get-active-configs-by-section-type')
  .post(getActiveConfigsBySectionAndTypeHandler)

// add config
router.route('/add-config').post(requireAdmin0, addConfigHandler);
// edit config
router.route('/edit-config/:id').put(requireAdmin0, editConfigHandler);

// get config by id
router.route('/:id').get(getConfigByIdHandler);

router.route('/delete').delete(requireAdmin0, deleteConfigHandler);

export default router;
