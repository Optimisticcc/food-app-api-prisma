import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import * as passportLocal from 'passport-local';
import { PrismaClient, AuthType } from '@prisma/client';
import env from '../configs/env';
import PassportFacebookToken, {
  StrategyOptions,
} from 'passport-facebook-token';
// import passportFacebook, { StrategyOption } from "passport-facebook";
import { isPasswordMatch } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
// import { Strategy as GoogleStrategy, StrategyOptions as BaseStrategyOptions } from 'passport-google-oauth20';
import {
  Strategy as GoogleStrategy,
  StrategyOptions as BaseStrategyOptions,
} from 'passport-google-oauth20';
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
            OR: [{ email: username }, { phoneNumber: username }, { code: username }],
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

// // passport fb
// passport.use(new PassportFacebookToken(
//   {
//     clientID: env.passport.auth.facebook.FACEBOOK_CLIENT_ID,
//     clientSecret: env.passport.auth.facebook.FACEBOOK_CLIENT_SECRET,
//     fbGraphVersion: 'v3.0',
//   } as StrategyOptions, async function (accessToken, refreshToken, profile, done) {

//     try {
//       const member = await prisma.member.findFirst({
//         where: {
//           authFacebookID: profile.id,
//           authType: AuthType.Facebook
//         }
//       })
//       if (member) {
//         return done(null, member)
//       }

//       const newMember = await prisma.member.create({
//         data: {
//           code: uuidv4(),
//           name: profile?.displayName,
//           avatar: profile?.photos[0]?.value,
//           email: profile?.emails[0]?.value,
//           authType: AuthType.Facebook,
//           authFacebookID: profile?.id,
//         }
//       })
//       done(null, newMember)
//     } catch (error) {
//       done(error, false)
//     }
//   }
// ));

// passport.use(new GoogleStrategy({
//   clientID: env.passport.auth.google.GOOGLE_CLIENT_ID,
//   clientSecret: env.passport.auth.google.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:5678/api/member/auth/google/callback"
// } as BaseStrategyOptions,
//   async function (accessToken, refreshToken, profile, cb) {
//     try {
//       const member = await prisma.member.findFirst({
//         where: {
//           authGoogleID: profile.id,
//           authType: AuthType.Google
//         }
//       })
//       if (member) {
//         return cb(null, member)
//       }
//       const newMember = await prisma.member.create({
//         data: {
//           code: uuidv4(),
//           name: profile?.displayName,
//           avatar: profile._json.picture,
//           email: profile._json.email,
//           authType: AuthType.Google,
//           authGoogleID: profile?.id,
//         }
//       })
//       console.log(newMember)

//       cb(null, newMember)
//     } catch (error: any) {
//       cb(error, false)
//     }
//   }
// ));
