const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
 .keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),
  MONGODB_URL: Joi.string().required().description('Mongo DB url'),
  CLIENT_URL: Joi.string().required().description('Client url'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire').required(),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire').required(),
 })
 .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
 throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
 env: envVars.NODE_ENV,
 port: envVars.PORT,
 client: {
  url: envVars.CLIENT_URL,
 },
 mongoose: {
  url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  options: {
   useCreateIndex: true,
   useNewUrlParser: true,
   useUnifiedTopology: true,
  },
 },

 jwt: {
  secret: envVars.JWT_SECRET,
  accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  resetPasswordExpirationMinutes: 10,
 },

 // googleAuth: {
 //   clientID: envVars.GOOGLE_CLIENT_ID,
 //   clientSecret: envVars.GOOGLE_CLIENT_SECRET,
 //   callbackURL: envVars.GOOGLE_REDIRECT_URL,
 // },
 // facebookAuth: {
 //   clientID: envVars.FACEBOOK_APP_ID,
 //   clientSecret: envVars.FACEBOOK_APP_SECRET,
 //   callbackURL: envVars.FACEBOOK_REDIRECT_URL,
 //   profileFields: ["id", "displayName", "link", "photos", "emails", "name"],
 // },
};
