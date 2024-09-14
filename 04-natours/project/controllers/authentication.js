import User from '../models/user.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { jwtExpiresInDays, jwtSecret } from '../config.js';
import AppError from '../utils/appError.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'node:crypto';
import { isDev } from './error.js';

const formattedExpiresIn = { expiresIn: `${jwtExpiresInDays}d` };

const signToken = user => jwt.sign({ id: user._id }, jwtSecret, formattedExpiresIn);

const createSendToken = (data, statusCode, res) => {
  const { email, name } = data;
  const formattedData = { email, name };
  const token = signToken(data);
  const cookieOptions = { expires: new Date(Date.now() + jwtExpiresInDays * 24 * 60 * 60 * 1000), httpOnly: true };

  if (isDev)
    cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({ status: 'success', token, data: formattedData });
};

export const signUpUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  });

  // console.log(newUser, jwtSecret, formattedExpiresIn);

  createSendToken({ name: newUser.name, email: newUser.email }, 201, res);
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new AppError('Please provide email and password', 400);
    return next(err);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    const err = new AppError('Incorrect email or password', 401);
    return next(err);
  }

  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];

  // Check if token exists
  if (!token) {
    const err = new AppError('You are not logged in! Please log in to get access.', 401);
    return next(err);
  }

  // Verify token
  const decoded = jwt.verify(token, jwtSecret);
  console.log(decoded);

  // Check if user still exists
  const user = await User.findById(decoded.id).select('+passwordChangedAt');
  if (!user) {
    const err = new AppError('The user belonging to this token does no longer exist.', 401);
    return next(err);
  }

  // Check if user changed password after the token was issued
  const changed = user.changePasswordAfter(decoded.iat);
  if (changed) {
    const err = new AppError('User recently changed password! Please log in again.', 401);
    return next(err);
  }

  // Grant access to protected route
  req.user = user;
  next();
});

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    const err = new AppError('You do not have permission to perform this action', 403);
    return next(err);
  }

  next();
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with email address', 404));

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save();

  // Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirmation to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message
    });

    res.status(200).json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    console.log(err);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

  if (!user)
    return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    const err = new AppError('Your current password is wrong', 401);
    return next(err);
  }

  if (req.body.password !== req.body.passwordConfirmation) {
    const err = new AppError('Passwords do not match', 400);
    return next(err);
  }

  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  await user.save();

  createSendToken(user, 200, res);
});

export const updateInfo = catchAsync(async (req, res, next) => {
  console.log(req);
  if (req.body.password || req.body.passwordConfirmation) {
    const err = new AppError('This route is not for password updates. Please use /updateMyPassword', 400);
    return next(err);
  }

  const filteredBody = { name: req.body.name, email: req.body.email };
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});