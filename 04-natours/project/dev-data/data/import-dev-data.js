import * as fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tour from '../../models/tour.js';

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

const toursFilename = `./dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursFilename, 'utf-8'));

export const importData = async () => {
  try {
    await Tour.create(...tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

export const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

for (let i = 2; i < process.argv.length; i++)
  if (process.argv[i] === '--import')
    importData();
  else if (process.argv[i] === '--delete')
    deleteData();