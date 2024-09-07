import dotenv from 'dotenv';
import app from './app.js';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env' });

const dbURI = process.env.DATABASE;
const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbName = process.env.DATABASE_NAME;

mongoose.connect(dbURI, {
  user: dbUsername,
  pass: dbPassword,
  dbName: dbName
}).then(() => console.log('DB connection successful!'));

// console.log(app.get('env'));
// console.log(process.env)
console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});