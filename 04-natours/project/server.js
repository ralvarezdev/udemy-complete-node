import { dbName, dbPassword, dbURI, dbUsername } from './config.js';
import mongoose from 'mongoose';
import app from './app.js';

// Promise rejections
process.on('unhandledRejection', err => {
  console.log(`${err.name}: ${err.message}`);
  console.log('UNHANDLED REJECTION! Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});

// Uncaught exceptions
process.on('uncaughtException', err => {
  console.log(`${err.name}: ${err.message}`);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});

mongoose.connect(dbURI, {
  user: dbUsername,
  pass: dbPassword,
  dbName: dbName
}).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
