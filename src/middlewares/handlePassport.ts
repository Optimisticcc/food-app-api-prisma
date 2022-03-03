import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import * as passportLocal from 'passport-local';
import { PrismaClient } from '@prisma/client';
import env from '../configs/env';
// import passportFacebook, { StrategyOption } from "passport-facebook";
import { isPasswordMatch } from '../helpers';
// import { Strategy as GoogleStrategy, StrategyOptions as BaseStrategyOptions } from 'passport-google-oauth20';
import { validate, schemas, userSchema } from '../validation';
const LocalStrategy = passportLocal.Strategy;

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(
    { usernameField: 'username' },
    async (username: string, password: string, done: any) => {
      try {
        await validate(userSchema.authSignInSchema, { username, password });
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: username },
              { phoneNumber: username },
              { code: username },
            ],
          },
        });

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
