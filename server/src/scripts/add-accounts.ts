import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Admin from '../frameworks/database/mongodb/models/admin';
import Seller from '../frameworks/database/mongodb/models/seller';

dotenv.config();

/**
 * Script để thêm 2 tài khoản vào database:
 * - Admin: admin@shop.com / admin123
 * - Seller: nguyenvanan@seller.com / password123
 */
async function addAccounts() {
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
    // 2. THÊM ADMIN
    // ==========================================
    console.log('👑 Đang thêm Admin...');
    const adminEmail = 'admin@shop.com';
    const adminPassword = 'admin123';
    
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      // Cập nhật password nếu cần
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      await Admin.updateOne(
        { email: adminEmail },
        { $set: { password: hashedAdminPassword } }
      );
      console.log('   ✅ Đã cập nhật admin');
      console.log(`      Email: ${adminEmail}`);
      console.log(`      Password: ${adminPassword}`);
    } else {
      // Tạo mới admin
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      await Admin.create({
        email: adminEmail,
        password: hashedAdminPassword
      });
      console.log('   ✅ Đã thêm admin mới');
      console.log(`      Email: ${adminEmail}`);
      console.log(`      Password: ${adminPassword}`);
    }
    console.log('');

    // ==========================================
    // 3. THÊM SELLER
    // ==========================================
    console.log('👨‍💼 Đang thêm Seller...');
    const sellerEmail = 'nguyenvanan@seller.com';
    const sellerPassword = 'password123';
    
    const existingSeller = await Seller.findOne({ email: sellerEmail });
    
    if (existingSeller) {
      // Cập nhật password nếu cần
      const hashedSellerPassword = await bcrypt.hash(sellerPassword, 10);
      await Seller.updateOne(
        { email: sellerEmail },
        { $set: { password: hashedSellerPassword } }
      );
      console.log('   ✅ Đã cập nhật seller');
      console.log(`      Email: ${sellerEmail}`);
      console.log(`      Password: ${sellerPassword}`);
    } else {
      // Tạo mới seller với đầy đủ thông tin
      const hashedSellerPassword = await bcrypt.hash(sellerPassword, 10);
      await Seller.create({
        firstName: 'Nguyễn',
        lastName: 'Văn An',
        email: sellerEmail,
        profilePic: {
          name: 'seller-1.jpg',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
        },
        certificates: [
          {
            name: 'Chứng chỉ Bán hàng Chuyên nghiệp',
            issuer: 'Hiệp hội Thương mại Việt Nam',
            issueDate: new Date('2023-01-15')
          },
          {
            name: 'Chứng chỉ Quản lý Sản phẩm',
            issuer: 'Trường Đại học Kinh tế',
            issueDate: new Date('2022-06-20')
          }
        ],
        mobile: '0912345678',
        qualification: 'Cử nhân Kinh tế',
        subjects: ['Điện tử', 'Laptop', 'Điện thoại'],
        experience: '5 năm kinh nghiệm bán hàng điện tử và công nghệ',
        skills: 'Tư vấn sản phẩm, Quản lý kho, Dịch vụ khách hàng',
        about: 'Chuyên bán các sản phẩm điện tử cao cấp với chất lượng đảm bảo',
        password: hashedSellerPassword,
        isVerified: true,
        productsCreated: [],
        rejected: false,
        rejectedReason: '',
        isBlocked: false,
        blockedReason: '',
        dateJoined: new Date('2023-01-01T10:00:00Z'),
        profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
      });
      console.log('   ✅ Đã thêm seller mới');
      console.log(`      Email: ${sellerEmail}`);
      console.log(`      Password: ${sellerPassword}`);
      console.log(`      Tên: Nguyễn Văn An`);
    }
    console.log('');

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 TỔNG KẾT');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ Đã thêm/cập nhật 2 tài khoản:');
    console.log('');
    console.log('👑 Admin:');
    console.log('   Email: admin@shop.com');
    console.log('   Password: admin123');
    console.log('   Route: /admin');
    console.log('');
    console.log('👨‍💼 Seller:');
    console.log('   Email: nguyenvanan@seller.com');
    console.log('   Password: password123');
    console.log('   Route: /sellers/login');
    console.log('');
    console.log('✅ Hoàn tất!');

  } catch (error: any) {
    console.error('❌ Lỗi khi thêm tài khoản:', error.message);
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
  addAccounts();
}

export default addAccounts;

