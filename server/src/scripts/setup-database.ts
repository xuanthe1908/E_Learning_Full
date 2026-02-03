import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Product from '../frameworks/database/mongodb/models/product';
import Category from '../frameworks/database/mongodb/models/category';
import Seller from '../frameworks/database/mongodb/models/seller';
import Customer from '../frameworks/database/mongodb/models/customer';
import Item from '../frameworks/database/mongodb/models/items';
import Payment from '../frameworks/database/mongodb/models/payment';
import Admin from '../frameworks/database/mongodb/models/admin';
import { mockProductsData } from '../data/mockProducts';
import { mockCategoriesData } from '../data/mockCategories';
import { mockSellersData } from '../data/mockSellers';
import { mockCustomersData } from '../data/mockCustomers';
import { mockAdminData } from '../data/mockAdmin';

dotenv.config();

/**
 * Script để setup và seed toàn bộ data vào database
 * 
 * Cách sử dụng:
 *   - Setup và seed data: npx ts-node server/src/scripts/setup-database.ts
 *   - Xóa dữ liệu cũ và seed lại: npx ts-node server/src/scripts/setup-database.ts --delete-old
 *   - Xóa TOÀN BỘ database và seed lại: npx ts-node server/src/scripts/setup-database.ts --drop-all
 *   - Chỉ setup (không seed): npx ts-node server/src/scripts/setup-database.ts --setup-only
 */
async function setupDatabase() {
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

    const deleteOld = process.argv.includes('--delete-old');
    const dropAll = process.argv.includes('--drop-all');
    const setupOnly = process.argv.includes('--setup-only');

    if (setupOnly) {
      console.log('ℹ️ Chế độ setup-only: Chỉ kiểm tra kết nối database');
      console.log('✅ Database đã sẵn sàng!');
      process.exit(0);
    }

    // ==========================================
    // 1.5. XÓA TOÀN BỘ DATABASE (nếu có flag --drop-all)
    // ==========================================
    if (dropAll) {
      console.log('⚠️  XÓA TOÀN BỘ DATABASE...');
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      
      console.log(`   📋 Tìm thấy ${collections.length} collections:`);
      collections.forEach(col => {
        console.log(`      - ${col.name}`);
      });
      
      for (const collection of collections) {
        await db.collection(collection.name).drop();
        console.log(`   🗑️  Đã xóa collection: ${collection.name}`);
      }
      
      console.log('   ✅ Đã xóa toàn bộ database!\n');
    }

    // ==========================================
    // 2. SEED CATEGORIES
    // ==========================================
    console.log('📂 Đang seed Categories...');
    if (deleteOld || dropAll) {
      await Category.deleteMany({});
      console.log('   🗑️ Đã xóa categories cũ');
    }

    const existingCategories = await Category.find({});
    if (existingCategories.length === 0 || deleteOld || dropAll) {
      if (existingCategories.length > 0 && (deleteOld || dropAll)) {
        // Đã xóa ở trên, giờ insert mới
      }
      const insertedCategories = await Category.insertMany(mockCategoriesData);
      console.log(`   ✅ Đã thêm ${insertedCategories.length} danh mục`);
      insertedCategories.forEach((cat, index) => {
        console.log(`      ${index + 1}. ${cat.name}`);
      });
    } else {
      console.log(`   ℹ️ Đã có ${existingCategories.length} danh mục, bỏ qua`);
    }
    console.log('');

    // ==========================================
    // 3. SEED SELLERS
    // ==========================================
    console.log('👨‍💼 Đang seed Sellers...');
    if (deleteOld || dropAll) {
      await Seller.deleteMany({});
      console.log('   🗑️ Đã xóa sellers cũ');
    }

    // Hash passwords cho sellers
    const sellersWithHashedPasswords = await Promise.all(
      mockSellersData.map(async (seller) => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        return {
          ...seller,
          password: hashedPassword,
          productsCreated: [] // Khởi tạo mảng rỗng
        };
      })
    );

    const existingSellers = await Seller.find({});
    let insertedSellers;
    
    if (existingSellers.length === 0 || deleteOld || dropAll) {
      insertedSellers = await Seller.insertMany(sellersWithHashedPasswords);
      console.log(`   ✅ Đã thêm ${insertedSellers.length} sellers`);
      insertedSellers.forEach((seller, index) => {
        console.log(`      ${index + 1}. ${seller.firstName} ${seller.lastName} - ${seller.email}`);
      });
    } else {
      insertedSellers = existingSellers;
      console.log(`   ℹ️ Đã có ${existingSellers.length} sellers, bỏ qua`);
    }
    console.log('');

    // ==========================================
    // 4. SEED CUSTOMERS
    // ==========================================
    console.log('👤 Đang seed Customers...');
    if (deleteOld || dropAll) {
      await Customer.deleteMany({});
      console.log('   🗑️ Đã xóa customers cũ');
    }

    // Hash passwords cho customers
    const customersWithHashedPasswords = await Promise.all(
      mockCustomersData.map(async (customer) => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        return {
          ...customer,
          password: hashedPassword,
          productsPurchased: [] // Đổi từ coursesEnrolled sang productsPurchased
        };
      })
    );

    const existingCustomers = await Customer.find({});
    let insertedCustomers;
    
    if (existingCustomers.length === 0 || deleteOld || dropAll) {
      insertedCustomers = await Customer.insertMany(customersWithHashedPasswords);
      console.log(`   ✅ Đã thêm ${insertedCustomers.length} customers`);
      insertedCustomers.forEach((customer, index) => {
        console.log(`      ${index + 1}. ${customer.firstName} ${customer.lastName} - ${customer.email}`);
      });
    } else {
      insertedCustomers = existingCustomers;
      console.log(`   ℹ️ Đã có ${existingCustomers.length} customers, bỏ qua`);
    }
    console.log('');

    // ==========================================
    // 5. SEED PRODUCTS
    // ==========================================
    console.log('📦 Đang seed Products...');
    if (deleteOld || dropAll) {
      await Product.deleteMany({});
      await Item.deleteMany({}); // Xóa items khi xóa products
      console.log('   🗑️ Đã xóa products và items cũ');
    }

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
        sellerId: sellerIds[sellerIndex], // Đổi từ instructorId sang sellerId
        productsPurchased: [], // Đổi từ coursesEnrolled sang productsPurchased
        introduction,
        guidelines,
        guidelinesUrl,
        createdAt: product.createdAt || new Date()
      };
    });

    const existingProducts = await Product.find({});
    let insertedProducts;
    
    if (existingProducts.length === 0 || deleteOld || dropAll) {
      insertedProducts = await Product.insertMany(productsToInsert);
      console.log(`   ✅ Đã thêm ${insertedProducts.length} sản phẩm`);
      insertedProducts.forEach((product, index) => {
        const seller = insertedSellers.find(s => s._id.equals(product.sellerId));
        console.log(`      ${index + 1}. ${product.title} - ${product.price?.toLocaleString('vi-VN') || 0} VND (Seller: ${seller?.firstName} ${seller?.lastName})`);
      });
    } else {
      insertedProducts = existingProducts;
      console.log(`   ℹ️ Đã có ${existingProducts.length} products, bỏ qua`);
    }
    console.log('');

    // ==========================================
    // 6. UPDATE SELLERS WITH PRODUCTS
    // ==========================================
    console.log('🔗 Đang cập nhật productsCreated cho sellers...');
    for (const seller of insertedSellers) {
      const sellerProducts = insertedProducts.filter(p => p.sellerId.equals(seller._id));
      await Seller.updateOne(
        { _id: seller._id },
        { $set: { productsCreated: sellerProducts.map(p => p._id) } }
      );
    }
    console.log('   ✅ Đã cập nhật productsCreated cho tất cả sellers');
    console.log('');

    // ==========================================
    // 7. UPDATE CUSTOMERS WITH PURCHASED PRODUCTS
    // ==========================================
    console.log('🛒 Đang cập nhật productsPurchased cho customers...');
    for (let i = 0; i < insertedCustomers.length; i++) {
      const customer = insertedCustomers[i];
      // Mỗi customer mua 1-2 sản phẩm
      const purchasedProducts = insertedProducts.slice(i, i + 2).map(p => p._id);
      
      // Update customer
      await Customer.updateOne(
        { _id: customer._id },
        { $set: { productsPurchased: purchasedProducts } }
      );

      // Update products với purchased customers
      for (const productId of purchasedProducts) {
        await Product.updateOne(
          { _id: productId },
          { $addToSet: { productsPurchased: customer._id } }
        );
      }
    }
    console.log('   ✅ Đã cập nhật productsPurchased cho customers và products');
    console.log('');

    // ==========================================
    // 8. SEED PAYMENTS (Sample)
    // ==========================================
    console.log('💳 Đang seed Payments...');
    if (deleteOld || dropAll) {
      await Payment.deleteMany({});
      console.log('   🗑️ Đã xóa payments cũ');
    }

    const existingPayments = await Payment.find({});
    let insertedPayments;
    
    if (existingPayments.length === 0 || deleteOld || dropAll) {
      // Tạo một số payments mẫu
      const samplePayments = [];
      for (let i = 0; i < Math.min(5, insertedProducts.length); i++) {
        const product = insertedProducts[i];
        const customer = insertedCustomers[i % insertedCustomers.length];
        
        samplePayments.push({
          orderId: `ORDER-${Date.now()}-${i}`,
          productId: product._id.toString(),
          customerId: customer._id.toString(),
          amount: product.price || 0,
          currency: 'VND',
          paymentMethod: 'VNPay',
          status: i % 2 === 0 ? 'completed' : 'pending',
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        });
      }

      insertedPayments = await Payment.insertMany(samplePayments);
      console.log(`   ✅ Đã thêm ${insertedPayments.length} payments mẫu`);
    } else {
      insertedPayments = existingPayments;
      console.log(`   ℹ️ Đã có ${existingPayments.length} payments, bỏ qua`);
    }
    console.log('');

    // ==========================================
    // 9. SEED ADMIN
    // ==========================================
    console.log('👑 Đang seed Admin...');
    if (deleteOld || dropAll) {
      await Admin.deleteMany({});
      console.log('   🗑️ Đã xóa admin cũ');
    }

    // Hash password cho admin
    const adminWithHashedPassword = {
      ...mockAdminData[0],
      password: await bcrypt.hash('admin123', 10)
    };

    const existingAdmin = await Admin.findOne({ email: adminWithHashedPassword.email });
    if (!existingAdmin) {
      await Admin.create(adminWithHashedPassword);
      console.log('   ✅ Đã thêm admin');
      console.log('      Email: admin@shop.com');
      console.log('      Password: admin123');
    } else {
      console.log('   ℹ️ Admin đã tồn tại, bỏ qua');
    }
    console.log('');

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 TỔNG KẾT SETUP DATABASE');
    console.log('═══════════════════════════════════════════════════');
    
    const finalCategories = await Category.countDocuments({});
    const finalSellers = await Seller.countDocuments({});
    const finalCustomers = await Customer.countDocuments({});
    const finalProducts = await Product.countDocuments({});
    const finalPayments = await Payment.countDocuments({});
    const finalAdmins = await Admin.countDocuments({});
    
    console.log(`✅ Categories: ${finalCategories}`);
    console.log(`✅ Sellers: ${finalSellers}`);
    console.log(`✅ Customers: ${finalCustomers}`);
    console.log(`✅ Products: ${finalProducts}`);
    console.log(`✅ Payments: ${finalPayments}`);
    console.log(`✅ Admins: ${finalAdmins}`);
    console.log('');
    console.log('🔑 Thông tin đăng nhập:');
    console.log('   👑 Admin: admin@shop.com / admin123');
    console.log('   👨‍💼 Seller: nguyenvanan@seller.com / password123');
    console.log('   👤 Customer: nguyenthihoa@customer.com / password123');
    console.log('');
    console.log('✅ Hoàn tất setup database!');
    
  } catch (error: any) {
    console.error('❌ Lỗi khi setup database:', error.message);
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
  setupDatabase();
}

export default setupDatabase;

