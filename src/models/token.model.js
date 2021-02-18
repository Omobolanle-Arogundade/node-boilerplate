import mongoose from 'mongoose';
import { toJSON } from './plugins';

const tokenSchema = mongoose.Schema(
 {
  token: {
   type: String,
   required: true,
   // index: true,
  },
  user: {
   type: mongoose.SchemaTypes.ObjectId,
   ref: 'User',
   required: true,
  },
  type: {
   type: String,
   enum: ['refresh', 'resetPassword', 'emailToken'],
   required: true,
  },
  expires: {
   type: Date,
   required: true,
  },
  blacklisted: {
   type: Boolean,
   default: false,
  },
 },
 { timestamps: true, versionKey: false }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model('token', tokenSchema);

module.exports = Token;
