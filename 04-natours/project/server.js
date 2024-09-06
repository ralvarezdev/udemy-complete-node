import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({ path: './config.env' });

// console.log(app.get('env'));
// console.log(process.env)
console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});