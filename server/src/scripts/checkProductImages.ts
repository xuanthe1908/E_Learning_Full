import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import configKeys from '../config';
import Product from '../frameworks/database/mongodb/models/product';

dotenv.config();

/**
 * Script để kiểm tra products và S3 images
 */
async function checkProductImages() {
  try {
    // Kết nối database
    const mongoUri = process.env.DB_CLUSTER_URL || process.env.DATABASE;
    const dbName = process.env.DB_NAME || 'TutorTrek';
    
    if (!mongoUri) {
      throw new Error('DATABASE hoặc DB_CLUSTER_URL environment variable is not set');
    }

    await mongoose.connect(mongoUri, { dbName });
    console.log(`✅ Đã kết nối database: ${dbName}\n`);

    // Khởi tạo S3 client
    const s3 = new S3Client({
      credentials: {
        accessKeyId: configKeys.AWS_ACCESS_KEY,
        secretAccessKey: configKeys.AWS_SECRET_KEY,
      },
      region: configKeys.AWS_BUCKET_REGION || 'ap-southeast-2',
    });

    // Lấy tất cả products
    const products = await Product.find({});
    console.log(`📦 Tìm thấy ${products.length} products\n`);

    let foundCount = 0;
    let missingCount = 0;

    for (const product of products) {
      const thumbnailKey = product.thumbnail?.key;
      const thumbnailName = product.thumbnail?.name;
      
      console.log(`\n📦 Product: ${product.title}`);
      console.log(`   Key: ${thumbnailKey || 'MISSING'}`);
      console.log(`   Name: ${thumbnailName || 'MISSING'}`);
      
      if (!thumbnailKey) {
        console.log(`   ❌ Không có thumbnail key`);
        missingCount++;
        continue;
      }

      // Check S3
      try {
        const command = new HeadObjectCommand({
          Bucket: configKeys.AWS_BUCKET_NAME,
          Key: thumbnailKey.trim(),
        });
        await s3.send(command);
        console.log(`   ✅ File tồn tại trong S3`);
        foundCount++;
      } catch (error: any) {
        if (error.name === 'NotFound') {
          console.log(`   ❌ File KHÔNG tồn tại trong S3`);
          missingCount++;
        } else {
          console.log(`   ⚠️  Lỗi khi check: ${error.message}`);
          missingCount++;
        }
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('📊 TỔNG KẾT');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Tìm thấy trong S3: ${foundCount}`);
    console.log(`❌ Không tìm thấy: ${missingCount}`);
    console.log(`📦 Tổng: ${products.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  checkProductImages();
}

export default checkProductImages;

