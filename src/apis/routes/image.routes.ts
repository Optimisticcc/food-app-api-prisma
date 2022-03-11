import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
import { upload } from '../../utils/uploadImage';
// import passport, { session } from 'passport';

import { index, remove, uploads } from '../controllers/image.controller';
import { requireLogin, requireEmployee } from '../../middlewares/requireUser';

// const passportConfig = require('../../middlewares/handlePassport');
router.route('/').get(index).post(upload.array('image'), uploads);

router.route('/:id').delete(requireLogin, remove);

export default router;
