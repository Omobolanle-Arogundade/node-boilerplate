import 'idempotent-babel-polyfill';
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import listAllRoutes from 'express-list-endpoints';
import Table from 'cli-table';

import fileUpload from 'express-fileupload';
import config from 'config';
import morgan from 'config/morgan';
import { jwtStrategy /* facebookStrategy, googleStrategy */ } from 'config/passport';
import { authLimiter } from 'middlewares/rateLimiter';
import routes from 'routes/v1';
import { errorConverter, errorHandler } from 'middlewares/error';
import ApiError from 'utils/ApiError';
import logger from 'config/logger';

const app = express();

if (config.env !== 'test') {
 app.use(morgan.successHandler);
 app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());
app.use(fileUpload());
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
// passport.use(facebookStrategy);
// passport.use(googleStrategy);

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
 done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
 done(null, user);
});

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
 app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// // Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) =>
 res.status(200).send({
  message: 'Welcome to AVC API..',
 })
);

// Temporal, to aid development: Lists all API endpoints and methods
let routesList = listAllRoutes(app);
routesList = routesList.map((route) => {
 const obj = {};
 obj[route.path] = route.methods.join(' | ');
 return obj;
});
const table = new Table();
table.push({ Endpoints: 'Methods' }, ...routesList);

logger.info(table.toString());

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
 next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
