import { ProductInterface } from '@src/types/productInterface';
import { RedisClient } from '../../../app';

export function redisCacheRepository(redisClient: RedisClient) {

  const setCache = async ({
    key,
    expireTimeSec,
    data
  }: {
    key: string;
    expireTimeSec: number;
    data: string;
  }) => await redisClient.set(key, data, { ...( { EX: expireTimeSec } as any ) });

  const clearCache = async (key: string) => {
    const result = await redisClient.del(key);
    return result === 1;
  };

  const populateTrie = async (product: ProductInterface) => {
    const trie: { [key: string]: any } = {}; // Initialize the trie object

    const title = product.title.toLowerCase();
    let currentNode: { [key: string]: any } = trie;

    for (const char of title) {
      if (!currentNode[char]) {
        currentNode[char] = {}; // Create a child node for the character
      }
      currentNode = currentNode[char]; // Move to the next node
    }

    currentNode['*'] = product.title; // Mark the end of the product title with '*'
    redisClient.set('product-trie', JSON.stringify(trie)); // Store the trie in Redis
  };

  return {
    setCache,
    clearCache,
    populateTrie
  };
}

export type RedisRepositoryImpl = typeof redisCacheRepository;
