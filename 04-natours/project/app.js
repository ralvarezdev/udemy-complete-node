import express from 'express';
import tourRouter from './routers/tour.js';
import user from './routers/user.js';

const app = express();
export default app;

// Middleware
app.use(express.json());
app.use(express.static('./public'));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/*
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');

});
 */

/*
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
*/

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', user);

