import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const accessKey = process.env.ACCESS_JWT_SECRET as string;
const refreshKey = process.env.REFRESH_JWT_SECRET as string;

if (!accessKey) {
  throw new Error('accessKey environment variable is not set.');
}

if (!refreshKey) {
  throw new Error('refreshKey environment variable is not set.');
}

export default {
    port: process.env.PORT,
    accessKey: accessKey,
    refreshKey: refreshKey,
}