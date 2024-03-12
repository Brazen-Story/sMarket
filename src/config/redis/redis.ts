import redis, { createClient } from 'redis';
import config from '..';
import Logger from '../../logger/logger';

const redisClient = createClient({
    url: `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}/0`,
    legacyMode: true,
});

redisClient.connect().then(() => {
    Logger.info('Successfully connected to Redis');
}).catch((err) => {
    Logger.error('Redis connection error', err);
});

export const redisCli = redisClient.v4;