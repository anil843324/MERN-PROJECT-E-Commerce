const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userShcema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Your Name'],
    maxLength: [30, 'Name cannot exced 30 characters'],
    minLength: [4, 'Name should have more than 4 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please Enter Your Email'],
    unique: true,
    validate: [validator.isEmail, 'Please Enter a valid Email'],
  },

  password: {
    type: String,
    required: [true, 'Please Enter Your Password'],
    minLength: [8, 'Password should be greater than 8 characters'],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userShcema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userShcema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
// compare password

userShcema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Generating Password Reset Token

userShcema.methods.getResetPasswordToken = function () {
  // Generating TOken

  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hashing and add to userSchema

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');


  this.resetPasswordExpire=Date.now()+15*60*1000;

  return resetToken;

};

module.exports = mongoose.model('User', userShcema);