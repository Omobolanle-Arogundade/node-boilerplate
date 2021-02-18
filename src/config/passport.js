const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
// const { Strategy: FacebookStrategy } = require('passport-facebook');
// const { Strategy: GoogleStrategy } = require('passport-google-oauth2');

const config = require('.');
const { User } = require('../models');

const jwtOptions = {
 secretOrKey: config.jwt.secret,
 jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
 try {
  const user = await User.findById(payload.sub);
  if (!user) {
   return done(null, false);
  }
  done(null, user);
 } catch (error) {
  done(error, false);
 }
};

// const facebookAuth = (accessToken, refreshToken, profile, done) => {
//   try {
//     logger.info('profile is');
//     logger.info(JSON.stringify(profile, undefined, 2));
//     return done(null, profile);
//   } catch (error) {
//     done(error, false);
//   }
// };

// const googleAuth = (accessToken, refreshToken, profile, done) => {
//   try {
//     logger.info('profile is');
//     logger.info(JSON.stringify(profile, undefined, 2));
//     return done(null, profile);
//   } catch (error) {
//     done(error, false);
//   }
// };

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
// const facebookStrategy = new FacebookStrategy(config.facebookAuth, facebookAuth);
// const googleStrategy = new GoogleStrategy(config.googleAuth, googleAuth);

module.exports = {
 jwtStrategy,
 // facebookStrategy,
 // googleStrategy,
};
