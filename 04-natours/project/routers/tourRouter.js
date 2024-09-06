import express from 'express';
import {
  checkBody,
  checkID,
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour
} from '../controllers/tourController.js';

const tourRouter = express.Router();
export default tourRouter;

tourRouter.param('id', checkID);

tourRouter.route('/')
  .get(getAllTours)
  .post(checkBody, createTour);

tourRouter.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);