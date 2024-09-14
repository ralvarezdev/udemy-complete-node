import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

// console.log(app.get('env'));
// console.log(process.env)
// console.log(process.env.NODE_ENV);

export const dbURI = process.env.DATABASE;
export const dbUsername = process.env.DATABASE_USERNAME;
export const dbPassword = process.env.DATABASE_PASSWORD;
export const dbName = process.env.DATABASE_NAME;

export const bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiresInDays = process.env.JWT_EXPIRES_IN_DAYS;