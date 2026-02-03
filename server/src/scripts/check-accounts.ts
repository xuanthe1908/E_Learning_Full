import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../frameworks/database/mongodb/models/admin';
import Seller from '../frameworks/database/mongodb/models/seller';

dotenv.config();

/**
 * Script để kiểm tra xem các tài khoản có trong database không
 */
async function checkAccounts() {
  try {
    // ==========================================
    // 1. KẾT NỐI DATABASE
    // ==========================================
    const mongoUri = process.env.DB_CLUSTER_URL || process.env.DATABASE;
    const dbName = process.env.DB_NAME || 'TutorTrek';
    
    if (!mongoUri) {
      throw new Error('❌ DATABASE hoặc DB_CLUSTER_URL environment variable is not set. Vui lòng kiểm tra file .env');
    }

    console.log('🔌 Đang kết nối database...');
    await mongoose.connect(mongoUri, {
      dbName: dbName
    });
    console.log('✅ Đã kết nối database thành công');
    console.log(`📂 Database: ${dbName}\n`);

    // ==========================================
    // 2. KIỂM TRA ADMIN
    // ==========================================
    console.log('👑 Đang kiểm tra Admin...');
    const adminEmail = 'admin@shop.com';
    const admin = await Admin.findOne({ email: adminEmail });
    
    if (admin) {
      console.log('   ✅ Tìm thấy admin:');
      console.log(`      Email: ${admin.email}`);
      console.log(`      ID: ${admin._id}`);
      console.log(`      Password Hash: ${admin.password.substring(0, 20)}...`);
    } else {
      console.log('   ❌ KHÔNG tìm thấy admin với email:', adminEmail);
    }
    console.log('');

    // ==========================================
    // 3. KIỂM TRA SELLER
    // ==========================================
    console.log('👨‍💼 Đang kiểm tra Seller...');
    const sellerEmail = 'nguyenvanan@seller.com';
    const seller = await Seller.findOne({ email: sellerEmail });
    
    if (seller) {
      console.log('   ✅ Tìm thấy seller:');
      console.log(`      Email: ${seller.email}`);
      console.log(`      Tên: ${seller.firstName} ${seller.lastName}`);
      console.log(`      ID: ${seller._id}`);
      console.log(`      Mobile: ${seller.mobile}`);
      console.log(`      IsVerified: ${seller.isVerified}`);
      console.log(`      Password Hash: ${seller.password.substring(0, 20)}...`);
    } else {
      console.log('   ❌ KHÔNG tìm thấy seller với email:', sellerEmail);
    }
    console.log('');

    // ==========================================
    // 4. LIỆT KÊ TẤT CẢ ADMIN VÀ SELLER
    // ==========================================
    console.log('📋 Liệt kê tất cả tài khoản...');
    const allAdmins = await Admin.find({});
    const allSellers = await Seller.find({});
    
    console.log(`   👑 Tổng số Admin: ${allAdmins.length}`);
    allAdmins.forEach((admin, index) => {
      console.log(`      ${index + 1}. ${admin.email}`);
    });
    
    console.log(`   👨‍💼 Tổng số Seller: ${allSellers.length}`);
    allSellers.forEach((seller, index) => {
      console.log(`      ${index + 1}. ${seller.email} - ${seller.firstName} ${seller.lastName}`);
    });
    console.log('');

  } catch (error: any) {
    console.error('❌ Lỗi khi kiểm tra tài khoản:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối database');
  }
}

// Chạy script
if (require.main === module) {
  checkAccounts();
}

export default checkAccounts;

