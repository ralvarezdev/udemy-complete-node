import { model, Schema } from 'mongoose';
import slugify from 'slugify';
import isAscii from 'validator/lib/isAscii.js';

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal than 40 characters'],
    minLength: [10, 'A tour name must have more or equal than 10 characters'],
    validate: [isAscii, 'Tour name must only contain characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
    min: [1, 'Duration must be above 1']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
    min: [1, 'Group size must be above 1']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Rating quantity must be above 0']
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
    min: [0, 'Price must be above 0']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // this only points to current doc on NEW document creation
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: {
    type: [Date]
  },
  secretTour: {
    type: Boolean,
    default: false
  }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Document middleware: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  // console.log(this);

  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query middleware for all queries starting with find
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function(next) {
  // console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});


const Tour = model('Tour', tourSchema, 'tours');
export default Tour;

/*
const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497
});
testTour.save().then(r => console.log(r)).catch(e => console.log(e));
 */