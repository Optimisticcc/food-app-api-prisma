import passport from 'passport';
import * as passportLocal from 'passport-local';
import { PrismaClient } from '@prisma/client';
import { isPasswordMatch } from '../helpers';
const LocalStrategy = passportLocal.Strategy;

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email: string, password: string, done: any) => {
      try {
        const user =
          (await prisma.customer.findFirst({
            where: {
              email: email,
            },
          })) ||
          (await prisma.user.findFirst({
            where: {
              email: email,
            },
          }));
        if (!user || !user.password) {
          return done(null, false);
        }

        if (!(await isPasswordMatch(user.password, password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
