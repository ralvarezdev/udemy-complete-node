import fs from 'fs';

const toursFilename = `./dev-data/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(toursFilename, 'utf-8'));

export const checkID = (req, res, next, value) => {
  const id = parseInt(value);

  if (isNaN(id))
    return res.status(400).json({ status: 'fail', message: 'Invalid ID' });

  const tour = tours.find(tour => tour.id === id);
  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  next();
};

export const checkBody = (req, res, next) => {
  if (!req.body.name)
    return res.status(400).json({ status: 'fail', message: 'Missing name' });

  if (!req.body.price || isNaN(req.body.price))
    return res.status(400).json({ status: 'fail', message: 'Missing price' });

  next();
};

export const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({ status: 'success', results: tours.length, data: { tours } });
};

export const getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find(tour => tour.id === id);

  res.status(200).json({ status: 'success', data: { tour } });
};

export const createTour = (req, res) => {
  // /console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };
  tours.push(newTour);
  fs.writeFile(toursFilename, JSON.stringify(tours), err => {
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  });
};

export const updateTour = (req, res) => {
  res.status(200).json({ status: 'success', data: { tour: '<Updated tour here...>' } });
};

export const deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};
