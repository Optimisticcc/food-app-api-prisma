import { createClient } from 'redis';

export const RedisClient = createClient();

export async function connectRedis() {
  await RedisClient.on('error', (err) =>
    console.log('Redis Client Error', err)
  );
  await RedisClient.connect();
  console.log("redis connected");
}
