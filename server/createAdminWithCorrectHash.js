// debugAdminLogin.js - Debug toàn bộ flow đăng nhập admin
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

// Admin Schema y hệt code của bạn
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
});

const Admin = mongoose.model('Admin', adminSchema, 'admin');

// AuthService y hệt code của bạn
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

async function debugAdminLogin() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('✅ Kết nối database thành công');
    console.log('🗃️ Database URL:', process.env.DATABASE?.substring(0, 30) + '...');

    // 1. Kiểm tra admin hiện tại trong DB
    console.log('\n=== 1. KIỂM TRA ADMIN HIỆN TẠI ===');
    const existingAdmins = await Admin.find({});
    console.log('📊 Số lượng admin trong DB:', existingAdmins.length);
    
    existingAdmins.forEach((admin, index) => {
      console.log(`Admin ${index + 1}:`);
      console.log('  Email:', admin.email);
      console.log('  Password Hash:', admin.password);
      console.log('  Hash length:', admin.password.length);
      console.log('');
    });

    // 2. Xóa tất cả admin cũ
    console.log('\n=== 2. XÓA ADMIN CŨ ===');
    await Admin.deleteMany({});
    console.log('🗑️ Đã xóa tất cả admin cũ');

    // 3. Tạo admin mới với nhiều password khác nhau
    console.log('\n=== 3. TẠO ADMIN MỚI ===');
    
    const testPasswords = ['123456', 'admin123', 'password'];
    const createdAdmins = [];

    for (let i = 0; i < testPasswords.length; i++) {
      const password = testPasswords[i];
      const email = `admin${i + 1}@tutortrek.com`;
      
      console.log(`\nTạo admin với password: "${password}"`);
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      console.log('  Hash tạo ra:', hashedPassword);
      
      // Lưu vào DB
      const newAdmin = await Admin.create({
        email: email,
        password: hashedPassword
      });
      
      createdAdmins.push({
        email: email,
        password: password,
        hash: hashedPassword,
        id: newAdmin._id
      });
      
      console.log('  ✅ Đã lưu vào DB');
    }

    // 4. Test đăng nhập cho từng admin
    console.log('\n=== 4. TEST ĐĂNG NHẬP ===');
    
    for (const adminInfo of createdAdmins) {
      console.log(`\nTest đăng nhập: ${adminInfo.email}`);
      console.log(`Password thử: "${adminInfo.password}"`);
      
      // Tìm admin trong DB
      const adminFromDb = await Admin.findOne({ email: adminInfo.email });
      if (!adminFromDb) {
        console.log('  ❌ Không tìm thấy admin trong DB');
        continue;
      }
      
      console.log('  📧 Email từ DB:', adminFromDb.email);
      console.log('  🔒 Hash từ DB:', adminFromDb.password);
      
      // Test comparePassword
      const isPasswordCorrect = await comparePassword(adminInfo.password, adminFromDb.password);
      console.log('  🧪 Kết quả compare:', isPasswordCorrect ? '✅ ĐÚNG' : '❌ SAI');
      
      // Test bcrypt.compare trực tiếp
      const directCompare = await bcrypt.compare(adminInfo.password, adminFromDb.password);
      console.log('  🔍 Direct bcrypt.compare:', directCompare ? '✅ ĐÚNG' : '❌ SAI');
    }

    // 5. Tạo admin đơn giản nhất
    console.log('\n=== 5. TẠO ADMIN ĐƠN GIẢN NHẤT ===');
    
    await Admin.deleteMany({});
    
    const simplePassword = '123456';
    const simpleEmail = 'admin@admin.com';
    const simpleHash = await hashPassword(simplePassword);
    
    await Admin.create({
      email: simpleEmail,
      password: simpleHash
    });
    
    console.log('✅ Admin đơn giản đã tạo:');
    console.log('📧 Email:', simpleEmail);
    console.log('🔑 Password:', simplePassword);
    console.log('🔒 Hash:', simpleHash);
    
    // Test final
    const finalAdmin = await Admin.findOne({ email: simpleEmail });
    const finalTest = await comparePassword(simplePassword, finalAdmin.password);
    console.log('🎯 Test cuối cùng:', finalTest ? '✅ THÀNH CÔNG' : '❌ THẤT BẠI');

    console.log('\n=== 6. THÔNG TIN SỬ DỤNG ===');
    console.log('🌐 Frontend gọi API: POST /api/auth/admin/admin-login');
    console.log('📝 Body gửi đi:');
    console.log(`{
  "email": "${simpleEmail}",
  "password": "${simplePassword}"
}`);

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Đã ngắt kết nối database');
  }
}

// Chạy debug
debugAdminLogin();

/*
HƯỚNG DẪN:
1. Lưu file này thành debugAdminLogin.js trong thư mục server
2. Chạy: node debugAdminLogin.js
3. Xem kết quả chi tiết để tìm lỗi
4. Sử dụng thông tin admin được tạo ở bước 5
*/