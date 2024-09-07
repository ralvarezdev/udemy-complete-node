import express from 'express';
import { createTour, deleteTour, getAllTours, getTour, updateTour } from '../controllers/tour.js';

const tourRouter = express.Router();
export default tourRouter;

// tourRouter.param('id', checkID);

tourRouter.route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);