import Tour from '../models/tour.js';

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

export const getAllTours = async (req, res) => {
  console.log(req.requestTime);

  try {
    const tours = await Tour.find();
    res.status(200).json({ status: 'success', results: tours.length, data: { tours } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: 'Failed to fetch tours' });
  }
};

export const getTour = async (req, res) => {
  try {
    const id = req.params.id;

    //const tour = tours.find(tour => tour.id === id);
    const tour = await Tour.findById(id);

    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
};

export const createTour = async (req, res) => {
  // /console.log(req.body);
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Invalid tour data' });
  }

  /*
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };
  tours.push(newTour);
  fs.writeFile(toursFilename, JSON.stringify(tours), err => {
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  });
   */
};

export const updateTour = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: { tour: updatedTour } });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Failed to update' });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const id = req.params.id;
    await Tour.findByIdAndDelete(id);
    res.status(204).json({ status: 'success', data: null });

  } catch (err) {
    res.status(404).json({ status: 'fail', message: 'Failed to delete' });
  }

  //res.status(204).json({ status: 'success', data: null });
};
