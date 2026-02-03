import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Product from '../frameworks/database/mongodb/models/product';
import Category from '../frameworks/database/mongodb/models/category';
import Seller from '../frameworks/database/mongodb/models/seller';
import Customers from '../frameworks/database/mongodb/models/customer';
import Payment from '../frameworks/database/mongodb/models/payment';
import Admin from '../frameworks/database/mongodb/models/admin';
import { mockProductsData } from '../data/mockProducts';
import { mockCategoriesData } from '../data/mockCategories';
import { mockSellersData } from '../data/mockSellers';
import { mockCustomersData } from '../data/mockCustomers';
import { mockAdminData } from '../data/mockAdmin';

dotenv.config();

/**
 * Script để seed toàn bộ mock data vào database
 * Chạy: npx ts-node server/src/scripts/seedAllData.ts
 */
async function seedAllData() {
  try {
    // Kết nối database - dùng đúng cấu hình như connection chính
    const mongoUri = process.env.DB_CLUSTER_URL || process.env.DATABASE;
    const dbName = process.env.DB_NAME || 'TutorTrek';
    
    if (!mongoUri) {
      throw new Error('DATABASE hoặc DB_CLUSTER_URL environment variable is not set');
    }

    await mongoose.connect(mongoUri, {
      dbName: dbName
    });
    console.log(`✅ Đã kết nối database thành công`);
    console.log(`   Database: ${dbName}`);
    console.log(`   Connection: ${mongoUri.replace(/\/\/.*@/, '//***@')}\n`);

    const deleteOld = process.argv.includes('--delete-old');
    
    // ==========================================
    // 1. SEED CATEGORIES
    // ==========================================
    if (deleteOld) {
      await Category.deleteMany({});
      console.log('🗑️ Đã xóa categories cũ');
    }

    const insertedCategories = await Category.insertMany(mockCategoriesData);
    console.log(`✅ Đã thêm ${insertedCategories.length} danh mục`);
    console.log('📂 Danh sách danh mục:');
    insertedCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name}`);
    });
    console.log('');

    // ==========================================
    // 2. SEED SELLERS
    // ==========================================
    if (deleteOld) {
      await Seller.deleteMany({});
      console.log('🗑️ Đã xóa sellers cũ');
    }

    // Hash passwords cho sellers
    const sellersWithHashedPasswords = await Promise.all(
      mockSellersData.map(async (seller) => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        return {
          ...seller,
          password: hashedPassword
        };
      })
    );

    const insertedSellers = await Seller.insertMany(sellersWithHashedPasswords);
    console.log(`✅ Đã thêm ${insertedSellers.length} sellers`);
    console.log('👨‍💼 Danh sách sellers:');
    insertedSellers.forEach((seller, index) => {
      console.log(`   ${index + 1}. ${seller.firstName} ${seller.lastName} - ${seller.email}`);
    });
    console.log('');

    // ==========================================
    // 3. SEED CUSTOMERS
    // ==========================================
    if (deleteOld) {
      await Customers.deleteMany({});
      console.log('🗑️ Đã xóa customers cũ');
    }

    // Hash passwords cho customers
    const customersWithHashedPasswords = await Promise.all(
      mockCustomersData.map(async (customer) => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        return {
          ...customer,
          password: hashedPassword
        };
      })
    );

    const insertedCustomers = await Customers.insertMany(customersWithHashedPasswords);
    console.log(`✅ Đã thêm ${insertedCustomers.length} customers`);
    console.log('👤 Danh sách customers:');
    insertedCustomers.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.firstName} ${customer.lastName} - ${customer.email}`);
    });
    console.log('');

    // ==========================================
    // 4. SEED PRODUCTS
    // ==========================================
    if (deleteOld) {
      await Product.deleteMany({});
      console.log('🗑️ Đã xóa products cũ');
    }

    // Phân bổ products cho các sellers
    const sellerIds = insertedSellers.map(s => s._id);
    const productsToInsert = mockProductsData.map((product, index) => {
      // Phân bổ đều cho các sellers
      const sellerIndex = index % sellerIds.length;
      // Tạo introduction và guidelines nếu chưa có
      const introduction = product.introduction || {
        name: `introduction-${product.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        key: `products/introduction-${product.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        url: product.thumbnailUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop'
      };
      const guidelines = product.guidelines || {
        name: `guidelines-${product.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        key: `products/guidelines-${product.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        url: product.thumbnailUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop'
      };
      const guidelinesUrl = product.guidelinesUrl || guidelines.url;
      
      return {
        ...product,
        sellerId: sellerIds[sellerIndex], // ✅ Đổi từ instructorId sang sellerId
        introduction,
        guidelines,
        guidelinesUrl,
        createdAt: product.createdAt || new Date()
      };
    });

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ Đã thêm ${insertedProducts.length} sản phẩm`);
    console.log('📦 Danh sách sản phẩm:');
    insertedProducts.forEach((product, index) => {
      const seller = insertedSellers.find(s => s._id.equals(product.sellerId));
      console.log(`   ${index + 1}. ${product.title} - ${product.price?.toLocaleString('vi-VN') || 0} VND (Seller: ${seller?.firstName} ${seller?.lastName})`);
    });
    console.log('');

    // ==========================================
    // 5. SEED PAYMENTS (Sample)
    // ==========================================
    if (deleteOld) {
      await Payment.deleteMany({});
      console.log('🗑️ Đã xóa payments cũ');
    }

    // Tạo một số payments mẫu
    const samplePayments = [];
    for (let i = 0; i < Math.min(5, insertedProducts.length); i++) {
      const product = insertedProducts[i];
      const customer = insertedCustomers[i % insertedCustomers.length];
      
      samplePayments.push({
        orderId: `ORDER-${Date.now()}-${i}`,
        productId: product._id.toString(), // ✅ Đổi từ courseId sang productId
        customerId: customer._id.toString(), // ✅ Đổi từ studentId sang customerId
        amount: product.price || 0,
        currency: 'VND',
        paymentMethod: 'VNPay',
        status: i % 2 === 0 ? 'completed' : 'pending',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Các ngày khác nhau
        updatedAt: new Date()
      });
    }

    const insertedPayments = await Payment.insertMany(samplePayments);
    console.log(`✅ Đã thêm ${insertedPayments.length} payments mẫu`);
    console.log('');

    // ==========================================
    // 6. UPDATE CUSTOMERS WITH PURCHASED PRODUCTS
    // ==========================================
    for (let i = 0; i < insertedCustomers.length; i++) {
      const customer = insertedCustomers[i];
      // Mỗi customer mua 1-2 sản phẩm
      const purchasedProducts = insertedProducts.slice(i, i + 2).map(p => p._id);
      
      // Update products với purchased customers (productsPurchased field)
      for (const productId of purchasedProducts) {
        await Product.updateOne(
          { _id: productId },
          { $addToSet: { productsPurchased: customer._id } }
        );
      }
    }
    console.log('✅ Đã cập nhật productsPurchased cho products');
    console.log('');

    // ==========================================
    // 8. SEED ADMIN
    // ==========================================
    if (deleteOld) {
      await Admin.deleteMany({});
      console.log('🗑️ Đã xóa admin cũ');
    }

    // Hash password cho admin
    const adminWithHashedPassword = {
      ...mockAdminData[0],
      password: await bcrypt.hash('admin123', 10)
    };

    const existingAdmin = await Admin.findOne({ email: adminWithHashedPassword.email });
    if (!existingAdmin) {
      await Admin.create(adminWithHashedPassword);
      console.log('✅ Đã thêm admin');
      console.log('   Email: admin@shop.com');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️ Admin đã tồn tại, bỏ qua');
    }
    console.log('');

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 TỔNG KẾT SEED DATA');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Categories: ${insertedCategories.length}`);
    console.log(`✅ Sellers: ${insertedSellers.length}`);
    console.log(`✅ Customers: ${insertedCustomers.length}`);
    console.log(`✅ Products: ${insertedProducts.length}`);
    console.log(`✅ Payments: ${insertedPayments.length}`);
    console.log('');
    console.log('🔑 Thông tin đăng nhập:');
    console.log('   Admin: admin@shop.com / admin123');
    console.log('   Seller: nguyenvanan@seller.com / password123');
    console.log('   Customer: nguyenthihoa@customer.com / password123');
    console.log('');
    console.log('✅ Hoàn tất seed data!');
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
  seedAllData();
}

export default seedAllData;

