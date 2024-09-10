import express from 'express';
import {
  createTour,
  deleteTour,
  getAllTours,
  getMonthlyPlan,
  getTour,
  getTourStats,
  topCheapTours,
  updateTour
} from '../controllers/tour.js';

const tourRouter = express.Router();
export default tourRouter;

// tourRouter.param('id', checkID);

tourRouter.route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter.route('/top-5-cheap')
  .get(topCheapTours, getAllTours);

tourRouter.route('/stats')
  .get(getTourStats);

tourRouter.route('/monthly-plan/:year')
  .get(getMonthlyPlan);

tourRouter.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
