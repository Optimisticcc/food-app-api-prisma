import { Application } from 'express';
import passport from 'passport';

export default function passportLoader(app: Application) {
  app.use(passport.initialize());
}
