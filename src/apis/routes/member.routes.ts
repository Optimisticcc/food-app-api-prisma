// import PromiseRouter from 'express-promise-router';
// import {
//   authFacebookMember,
//   authGoogleMember,
// } from '../controllers/member.controller';
// import passport from 'passport';
//
// const {
//   schemas,
//   validateParam,
//   validateBody,
// } = require('../../../services/validate');
//
// const passportConfig = require('../../../middlewares/handlePassport');
//
// const router = PromiseRouter();
//
// router.route('/auth/facebook').post(
//   passport.authenticate('facebook-token', {
//     session: false,
//   }),
//   authFacebookMember
// );
//
// router.get(
//   '/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );
//
// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { session: false }),
//   authGoogleMember
// );
//
// export default router;
