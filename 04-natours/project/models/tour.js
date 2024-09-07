import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});
const Tour = mongoose.model('Tour', tourSchema, 'tours');
export default Tour;

/*
const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497
});
testTour.save().then(r => console.log(r)).catch(e => console.log(e));
 */