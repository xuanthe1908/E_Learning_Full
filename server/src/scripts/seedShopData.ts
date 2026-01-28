import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../frameworks/database/mongodb/models/course';
import { mockProductsData } from '../data/mockShopData';
import { Types } from 'mongoose';

dotenv.config();

/**
 * Script để seed mock data vào database
 * Chạy: npx ts-node server/src/scripts/seedShopData.ts
 */
async function seedShopData() {
  try {
    // Kết nối database
    const mongoUri = process.env.DATABASE;
    if (!mongoUri) {
      throw new Error('DATABASE environment variable is not set');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Đã kết nối database thành công');

    // Lấy seller (instructor) ID đầu tiên (hoặc tạo mới nếu chưa có)
    // Giả sử có ít nhất 1 seller trong database
    const Instructor = mongoose.model('Instructor', new mongoose.Schema({}, { strict: false }), 'instructor');
    const sellers = await Instructor.find({}).limit(1);
    
    if (sellers.length === 0) {
      console.log('⚠️ Không tìm thấy seller nào. Vui lòng tạo seller trước.');
      process.exit(1);
    }

    const sellerId = sellers[0]._id;
    console.log(`📝 Sử dụng seller ID: ${sellerId}`);

    // Xóa dữ liệu cũ (tùy chọn)
    const deleteOld = process.argv.includes('--delete-old');
    if (deleteOld) {
      await Course.deleteMany({});
      console.log('🗑️ Đã xóa dữ liệu cũ');
    }

    // Tạo products từ mock data
    const productsToInsert = mockProductsData.map((product) => ({
      ...product,
      instructorId: sellerId,
      coursesEnrolled: [],
      createdAt: product.createdAt || new Date()
    }));

    const insertedProducts = await Course.insertMany(productsToInsert);
    console.log(`✅ Đã thêm ${insertedProducts.length} sản phẩm vào database`);

    // Hiển thị danh sách sản phẩm đã thêm
    console.log('\n📦 Danh sách sản phẩm đã thêm:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - ${product.price.toLocaleString('vi-VN')} VND`);
    });

    console.log('\n✅ Hoàn tất seed data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối database');
  }
}

// Chạy script
if (require.main === module) {
  seedShopData();
}

export default seedShopData;

