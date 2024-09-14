import AppError from '../utils/appError.js';

export const isDev = process.env.NODE_ENV === 'development';

const duplicateFieldHandler = errorMessage => {
  const startIndex = errorMessage.indexOf('"');
  const endIndex = errorMessage.indexOf('"', startIndex + 1);
  const value = errorMessage.slice(startIndex + 1, endIndex);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const validationErrorHandler = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const input = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(input, 400);
};

const jwtInvalidSignatureHandler = () => new AppError('Invalid token. Please log in again!', 401);

const jwtExpirationHandler = () => new AppError('Your token has expired! Please log in again.', 401);

const errorFormatter = err => {
  if (err.isOperational)
    return [err.statusCode, { status: err.status, message: err.message }];

  let error = null;

  if (err.code === 11000) error = duplicateFieldHandler(err.message);
  else if (err.name === 'ValidationError') error = validationErrorHandler(err);
  else if (err.name === 'JsonWebTokenError') error = jwtInvalidSignatureHandler();
  else if (err.name === 'TokenExpiredError') error = jwtExpirationHandler();

  if (error === null)
    return [500, { status: 'error', message: 'Something went wrong' }];

  return [error.statusCode, { status: 'error', message: error.message }];
};

export const globalErrorHandler = (err, req, res, next) => {
  const [statusCode, error] = errorFormatter(err);
  res.status(statusCode).json(isDev ? { ...error, stack: err.stack } : error);
};