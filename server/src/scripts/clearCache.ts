import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

/**
 * Script để xóa Redis cache
 * Chạy: npx ts-node src/scripts/clearCache.ts
 */
async function clearCache() {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    console.log('🔌 Đang kết nối Redis...');
    const client = createClient({
      url: redisUrl
    });

    client.on('error', (err) => {
      console.log('❌ Redis Client Error:', err);
    });

    await client.connect();
    console.log('✅ Đã kết nối Redis');

    // Xóa cache key 'all-products'
    const result = await client.del('all-products');
    console.log(`✅ Đã xóa cache key 'all-products': ${result === 1 ? 'Thành công' : 'Không tìm thấy'}`);

    // Xóa tất cả keys liên quan đến products (optional)
    const keys = await client.keys('*products*');
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`✅ Đã xóa ${keys.length} cache keys liên quan đến products`);
    }

    await client.disconnect();
    console.log('🔌 Đã ngắt kết nối Redis');
    console.log('\n✅ Hoàn tất clear cache!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    console.log('⚠️  Có thể Redis chưa chạy hoặc không có cache');
    process.exit(1);
  }
}

if (require.main === module) {
  clearCache();
}

export default clearCache;

