import Tour from '../models/tour.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { Types } from 'mongoose';

/*
const toursFilename = `./dev-data/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(toursFilename, 'utf-8'));
 */

/*
export const checkID = (req, res, next, value) => {
  const id = parseInt(value);

  if (isNaN(id))
    return res.status(400).json({ status: 'fail', message: 'Invalid ID' });

  const tour = tours.find(tour => tour.id === id);
  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  next();
};
 */

/*
export const checkBody = (req, res, next) => {
  if (!req.body.name)
    return res.status(400).json({ status: 'fail', message: 'Missing name' });

  if (!req.body.price || isNaN(req.body.price))
    return res.status(400).json({ status: 'fail', message: 'Missing price' });

  next();
};
 */

export const topCheapTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

export const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour, req);
  await features.filter().sorting().fieldLimiting().pagination();
  const tours = await features.query;

  res.status(200).json({ status: 'success', results: tours.length, data: { tours } });
});

export const getTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let objectId;
  try {
    objectId = new Types.ObjectId(id);
  } catch (err) {
    throw new AppError('Invalid ID', 400);
  }

  const tour = await Tour.findById(objectId);

  if (!tour)
    throw new AppError('No tour found with that ID', 404);

  res.status(200).json({ status: 'success', data: { tour } });

  //const tour = tours.find(tour => tour.id === id);
});

export const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({ status: 'success', data: { tour: newTour } });

  /*
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };
  tours.push(newTour);
  fs.writeFile(toursFilename, JSON.stringify(tours), err => {
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  });
   */
});

export const updateTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ status: 'success', data: { tour: updatedTour } });
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  await Tour.findByIdAndDelete(id);
  res.status(204).json({ status: 'success', data: null });
});

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  res.status(200).json({ status: 'success', data: { stats } });
});

export const getMonthlyPlan = catchAsync(async (req, res) => {
  const year = parseInt(req.params.year);

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    { $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tush: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({ status: 'success', data: { plan } });
});