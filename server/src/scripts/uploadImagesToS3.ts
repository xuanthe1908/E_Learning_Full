import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import configKeys from '../config';
import Product from '../frameworks/database/mongodb/models/product';

dotenv.config();

/**
 * Script để upload ảnh từ Unsplash URLs lên S3
 * Chạy: npx ts-node src/scripts/uploadImagesToS3.ts
 */
async function uploadImagesToS3() {
  try {
    // Kiểm tra AWS config
    if (!configKeys.AWS_ACCESS_KEY || !configKeys.AWS_SECRET_KEY || !configKeys.AWS_BUCKET_NAME) {
      console.error('❌ AWS S3 chưa được cấu hình trong .env');
      console.error('Cần có: AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME, AWS_BUCKET_REGION');
      process.exit(1);
    }

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

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // Kiểm tra xem đã có thumbnail key chưa
        if (!product.thumbnail || !product.thumbnail.key) {
          console.log(`⚠️  Product "${product.title}" không có thumbnail key, bỏ qua`);
          skipCount++;
          continue;
        }

        const thumbnailKey = product.thumbnail.key;
        const thumbnailUrl = product.thumbnailUrl || product.thumbnail.url;

        if (!thumbnailUrl || !thumbnailUrl.startsWith('http')) {
          console.log(`⚠️  Product "${product.title}" không có URL hợp lệ, bỏ qua`);
          skipCount++;
          continue;
        }

        // Download ảnh từ URL
        console.log(`📥 Đang download: ${product.title}`);
        console.log(`   URL: ${thumbnailUrl}`);
        
        const response = await axios.get(thumbnailUrl, {
          responseType: 'arraybuffer',
          timeout: 30000,
        });

        const imageBuffer = Buffer.from(response.data);
        const contentType = response.headers['content-type'] || 'image/jpeg';

        // Upload lên S3
        console.log(`🚀 Đang upload lên S3: ${thumbnailKey}`);
        
        // S3 metadata chỉ cho phép ASCII characters, cần encode
        const uploadCommand = new PutObjectCommand({
          Bucket: configKeys.AWS_BUCKET_NAME,
          Key: thumbnailKey,
          Body: imageBuffer,
          ContentType: contentType,
          Metadata: {
            'original-url': encodeURIComponent(thumbnailUrl).substring(0, 2000), // Limit length
            'product-id': product._id.toString(),
            'upload-date': new Date().toISOString(),
          },
        });

        await s3.send(uploadCommand);
        console.log(`✅ Đã upload thành công: ${thumbnailKey}\n`);
        successCount++;

        // Update product với URL mới (nếu cần)
        // Product đã có key rồi nên không cần update

      } catch (error: any) {
        console.error(`❌ Lỗi khi upload "${product.title}":`, error.message);
        errorCount++;
        continue;
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('📊 TỔNG KẾT UPLOAD IMAGES');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Thành công: ${successCount}`);
    console.log(`⚠️  Bỏ qua: ${skipCount}`);
    console.log(`❌ Lỗi: ${errorCount}`);
    console.log(`📦 Tổng: ${products.length}`);
    console.log('\n✅ Hoàn tất upload images!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  uploadImagesToS3();
}

export default uploadImagesToS3;

