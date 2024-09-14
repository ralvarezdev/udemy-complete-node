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
import { protect, restrictTo } from '../controllers/authentication.js';

const tourRouter = express.Router();
export default tourRouter;

// tourRouter.param('id', checkID);

tourRouter.route('/')
  .get(protect, getAllTours)
  .post(protect, createTour);

tourRouter.route('/top-5-cheap')
  .get(protect, topCheapTours, getAllTours);

tourRouter.route('/stats')
  .get(protect, getTourStats);

tourRouter.route('/monthly-plan/:year')
  .get(protect, getMonthlyPlan);

tourRouter.route('/:id')
  .get(protect, getTour)
  .patch(protect, updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
