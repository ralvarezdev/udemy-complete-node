import express from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/user.js';

const user = express.Router();
export default user;

user.route('/').get(getAllUsers)
  .post(createUser);

user.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);