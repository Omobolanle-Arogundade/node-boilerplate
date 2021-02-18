import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
// import mongoosePaginate from 'mongoose-paginate-v2';

import { toJSON } from './plugins';

const userSchema = mongoose.Schema(
 {
  email: {
   type: String,
   trim: true,
   // unique: false,
   lowercase: true,
   validate(value) {
    if (value) {
     if (!validator.isEmail(value)) {
      throw new Error('Invalid email');
     }
    } else if (this.type === 'MERCHANT') {
     throw new Error('Email is required');
    }
   },
  },
  mobile: {
   type: String,
   trim: true,
   sparse: true,
   validate(value) {
    if (this.type === 'MERCHANT' && !value) {
     throw new Error('Mobile is required');
    }
   },
  },
  status: {
   type: String,
   required: true,
   default: 'ACTIVE',
  },
  password: {
   type: String,
   trim: true,
   minlength: 8,
   private: true, // used by the toJSON plugin
  },
  type: {
   type: String,
   required: true,
  },
  authMethods: [
   {
    type: String,
    enum: ['FACEBOOK', 'GOOGLE', 'LOCAL'],
   },
  ],
 },
 { timestamps: true, versionKey: false }
);

// mongoosePaginate.paginate.options = {
//  customLabels: {
//   totalDocs: 'totalResults',
//   docs: 'results',
//   page: 'currentPage',
//   nextPage: 'next',
//   prevPage: 'prev',
//   pagingCounter: 'slNo',
//   meta: 'paginator',
//  },
// };

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
// userSchema.plugin(mongoosePaginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
 const user = await this.findOne({ $and: [{ email, _id: { $ne: excludeUserId } }, { email: { $ne: null } }] });
 return !!user;
};

/**
 * Check if mobile number is taken
 * @param {string} mobile - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isNumberTaken = async function (mobile, excludeUserId) {
 const user = await this.findOne({ $and: [{ mobile, _id: { $ne: excludeUserId } }, { mobile: { $ne: null } }] });
 return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
 const user = this;
 return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
 const user = this;
 if (user.isModified('password')) {
  user.password = await bcrypt.hash(user.password, 8);
 }
 next();
});

// userSchema.pre('findOneAndUpdate', async function (next) {
//  console.log('update... ');
//  const user = this;
//  console.log(user);
//
//  // const docToUpdate = await this.model.findOne(this.getQuery());
//  // console.log(docToUpdate);
//  // if (user.isModified('password')) {
//  user.password = await bcrypt.hash(user.password, 8);
//  // }
//  next();
// });
/**
 * @typedef User
 */
const User = mongoose.model('users', userSchema);

module.exports = User;
