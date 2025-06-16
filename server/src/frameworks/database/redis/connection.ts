import configKeys from '../../../config';
import { createClient } from 'redis';

const connection = () => {
  const createRedisClient = () => {
    try {
      console.log('Attempting to connect to Redis...');
      console.log('Redis URL:', configKeys.REDIS_URL ? 'Found' : 'Missing');

      const client = createClient({
        url: configKeys.REDIS_URL,
      });

      client.on('error', err => {
        console.log('❌ Redis Client Error:', err);
      });

      client.on('connect', () => {
        console.log('✅ Redis connecting...');
      });

      client.on('ready', () => {
        console.log('✅ Redis connected successfully'.red.bold);
      });

      // Non-blocking connection
      client.connect().catch((err) => {
        console.log('❌ Redis connection failed:', err);
        console.log('⚠️  Continuing without Redis...');
      });

      return client;
    } catch (error) {
      console.error('❌ Redis setup error:', error);
      // Return mock client to prevent crashes
      return {
        connect: () => Promise.resolve(),
        disconnect: () => Promise.resolve(),
        set: () => Promise.resolve(),
        get: () => Promise.resolve(null),
        del: () => Promise.resolve(),
      };
    }
  };

  return {
    createRedisClient
  };
};

export default connection;