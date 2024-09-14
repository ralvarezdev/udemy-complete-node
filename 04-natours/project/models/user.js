import { model, Schema } from 'mongoose';
import crypto from 'node:crypto';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcrypt';
import { bcryptSaltRounds } from '../config.js';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please provide a valid email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must have more or equal than 8 characters'],
    select: false
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords do not match'
    },
    select: false
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active:
    {
      type: Boolean,
      default: true,
      select: false
    }
});

userSchema.pre('/^find/', function(next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const start = Date.now();
  this.password = await bcrypt.hash(this.password, bcryptSaltRounds);
  const end = Date.now();
  console.log(`Time taken to hash password: ${end - start} milliseconds`);

  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance method available on all documents of a collection
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < passwordChangedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model('User', userSchema);
export default User;