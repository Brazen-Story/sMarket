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
      jwt: {
        accessKey: accessKey,
        refreshKey: refreshKey,
      },
      redis: {
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      },
      naver: {
        user: process.env.NAVER_USER,
        pass: process.env.NAVER_PASSWORD
      }

}