import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Admin from '../frameworks/database/mongodb/models/admin';
import Seller from '../frameworks/database/mongodb/models/seller';

dotenv.config();

/**
 * Script để test và fix password cho 2 tài khoản
 */
async function testAndFixAccounts() {
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
    // 2. TEST VÀ FIX ADMIN
    // ==========================================
    console.log('👑 Đang test và fix Admin...');
    const adminEmail = 'admin@shop.com';
    const adminPassword = 'admin123';
    
    let admin = await Admin.findOne({ email: adminEmail });
    
    if (!admin) {
      // Tạo mới nếu chưa có
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = await Admin.create({
        email: adminEmail,
        password: hashedPassword
      });
      console.log('   ✅ Đã tạo admin mới');
    } else {
      // Test password hiện tại
      const isPasswordCorrect = await bcrypt.compare(adminPassword, admin.password);
      
      if (!isPasswordCorrect) {
        // Cập nhật password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await Admin.updateOne(
          { email: adminEmail },
          { $set: { password: hashedPassword } }
        );
        console.log('   ✅ Đã cập nhật password cho admin');
        
        // Test lại
        admin = await Admin.findOne({ email: adminEmail });
        const testAgain = await bcrypt.compare(adminPassword, admin!.password);
        console.log(`   🧪 Test password sau khi cập nhật: ${testAgain ? '✅ ĐÚNG' : '❌ SAI'}`);
      } else {
        console.log('   ✅ Password admin đã đúng, không cần cập nhật');
      }
    }
    console.log(`      Email: ${adminEmail}`);
    console.log(`      Password: ${adminPassword}`);
    console.log('');

    // ==========================================
    // 3. TEST VÀ FIX SELLER
    // ==========================================
    console.log('👨‍💼 Đang test và fix Seller...');
    const sellerEmail = 'nguyenvanan@seller.com';
    const sellerPassword = 'password123';
    
    let seller = await Seller.findOne({ email: sellerEmail });
    
    if (!seller) {
      // Tạo mới nếu chưa có
      const hashedPassword = await bcrypt.hash(sellerPassword, 10);
      seller = await Seller.create({
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
        password: hashedPassword,
        isVerified: true,
        productsCreated: [],
        rejected: false,
        rejectedReason: '',
        isBlocked: false,
        blockedReason: '',
        dateJoined: new Date('2023-01-01T10:00:00Z'),
        profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
      });
      console.log('   ✅ Đã tạo seller mới');
    } else {
      // Test password hiện tại
      const isPasswordCorrect = await bcrypt.compare(sellerPassword, seller.password);
      
      if (!isPasswordCorrect) {
        // Cập nhật password
        const hashedPassword = await bcrypt.hash(sellerPassword, 10);
        await Seller.updateOne(
          { email: sellerEmail },
          { $set: { password: hashedPassword } }
        );
        console.log('   ✅ Đã cập nhật password cho seller');
        
        // Test lại
        seller = await Seller.findOne({ email: sellerEmail });
        const testAgain = await bcrypt.compare(sellerPassword, seller!.password);
        console.log(`   🧪 Test password sau khi cập nhật: ${testAgain ? '✅ ĐÚNG' : '❌ SAI'}`);
      } else {
        console.log('   ✅ Password seller đã đúng, không cần cập nhật');
      }
      
      // Đảm bảo seller được verified
      if (seller && !seller.isVerified) {
        await Seller.updateOne(
          { email: sellerEmail },
          { $set: { isVerified: true } }
        );
        console.log('   ✅ Đã set isVerified = true cho seller');
        seller = await Seller.findOne({ email: sellerEmail });
      }
    }
    console.log(`      Email: ${sellerEmail}`);
    console.log(`      Password: ${sellerPassword}`);
    if (seller) {
      console.log(`      Tên: ${seller.firstName} ${seller.lastName}`);
      console.log(`      IsVerified: ${seller.isVerified}`);
    }
    console.log('');

    // ==========================================
    // 4. FINAL TEST
    // ==========================================
    console.log('🧪 Đang test đăng nhập...');
    
    // Test admin
    const finalAdmin = await Admin.findOne({ email: adminEmail });
    const adminTest = await bcrypt.compare(adminPassword, finalAdmin!.password);
    console.log(`   👑 Admin test: ${adminTest ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test seller
    const finalSeller = await Seller.findOne({ email: sellerEmail });
    if (finalSeller) {
      const sellerTest = await bcrypt.compare(sellerPassword, finalSeller.password);
      console.log(`   👨‍💼 Seller test: ${sellerTest ? '✅ PASS' : '❌ FAIL'}`);
    } else {
      console.log(`   👨‍💼 Seller test: ❌ FAIL (không tìm thấy seller)`);
    }
    console.log('');

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 TỔNG KẾT');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ Đã đảm bảo 2 tài khoản sẵn sàng:');
    console.log('');
    console.log('👑 Admin:');
    console.log('   Email: admin@shop.com');
    console.log('   Password: admin123');
    console.log('   Route: /admin');
    console.log('   Status: ✅ Sẵn sàng');
    console.log('');
    console.log('👨‍💼 Seller:');
    console.log('   Email: nguyenvanan@seller.com');
    console.log('   Password: password123');
    console.log('   Route: /sellers/login');
    console.log('   Status: ✅ Sẵn sàng');
    console.log('');
    console.log('✅ Hoàn tất! Bạn có thể đăng nhập ngay bây giờ.');

  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
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
  testAndFixAccounts();
}

export default testAndFixAccounts;

