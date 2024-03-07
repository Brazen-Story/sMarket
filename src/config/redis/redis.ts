import redis, { createClient } from 'redis';
import config from '..';

const redisClient = createClient({
    url: `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}/0`,
    legacyMode: true,
});

redisClient.connect().then(() => {
    console.log('Successfully connected to Redis');
}).catch((err) => {
    console.error('Redis connection error', err);
});

export const redisCli = redisClient.v4;