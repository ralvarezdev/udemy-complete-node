import express from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/userController.js';

const userRouter = express.Router();
export default userRouter;

userRouter.route('/').get(getAllUsers)
  .post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);