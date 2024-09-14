import express from 'express';
import {
  deleteUser,
  forgotPassword,
  loginUser,
  protect,
  resetPassword,
  signUpUser,
  updateInfo,
  updatePassword
} from '../controllers/authentication.js';

const userRouter = express.Router();
export default userRouter;

userRouter.route('/signup').post(signUpUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/forgotPassword').post(forgotPassword);
userRouter.route('/resetPassword/:token').patch(resetPassword);
userRouter.route('/updatePassword').patch(protect, updatePassword);
userRouter.route('/updateInfo').patch(protect, updateInfo);
userRouter.route('/delete').delete(protect, deleteUser);