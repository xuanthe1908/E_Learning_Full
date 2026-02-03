import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script để xóa các collections cũ (course, instructor, students, lessons)
 * và đảm bảo chỉ còn collections mới (product, seller, customers, items)
 */
async function cleanupOldCollections() {
  try {
    const mongoUri = process.env.DB_CLUSTER_URL || process.env.DATABASE;
    const dbName = process.env.DB_NAME || 'TutorTrek';
    
    if (!mongoUri) {
      throw new Error('❌ DATABASE hoặc DB_CLUSTER_URL environment variable is not set');
    }

    console.log('🔌 Đang kết nối database...');
    await mongoose.connect(mongoUri, {
      dbName: dbName
    });
    console.log(`✅ Đã kết nối database thành công`);
    console.log(`📂 Database: ${dbName}\n`);

    const db = mongoose.connection.db;
    
    // Danh sách collections cũ cần xóa
    const oldCollections = [
      'course',
      'courses',
      'instructor',
      'instructors',
      'student',
      'students',
      'lesson',
      'lessons'
    ];

    console.log('🔍 Đang kiểm tra collections...');
    const allCollections = await db.listCollections().toArray();
    const collectionNames = allCollections.map(c => c.name);
    
    console.log(`\n📋 Tìm thấy ${allCollections.length} collections:`);
    allCollections.forEach(c => {
      const isOld = oldCollections.includes(c.name);
      console.log(`   ${isOld ? '🗑️ ' : '✅ '} ${c.name} ${isOld ? '(CŨ - SẼ XÓA)' : '(MỚI)'}`);
    });

    console.log('\n⚠️  Đang xóa collections cũ...');
    let deletedCount = 0;
    for (const colName of oldCollections) {
      try {
        const collection = db.collection(colName);
        const count = await collection.countDocuments();
        if (count > 0 || collectionNames.includes(colName)) {
          await collection.drop();
          console.log(`   ✅ Đã xóa: ${colName}`);
          deletedCount++;
        }
      } catch (error: any) {
        if (error.codeName === 'NamespaceNotFound') {
          console.log(`   ℹ️  Không tìm thấy: ${colName} (đã xóa hoặc chưa tồn tại)`);
        } else {
          console.log(`   ⚠️  Lỗi khi xóa ${colName}: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Đã xóa ${deletedCount} collections cũ`);

    console.log('\n📊 Collections còn lại sau khi dọn dẹp:');
    const remainingCollections = await db.listCollections().toArray();
    remainingCollections.forEach(c => {
      console.log(`   ✅ ${c.name}`);
    });

    console.log('\n✅ Hoàn tất dọn dẹp database!');
    
  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối database');
  }
}

if (require.main === module) {
  cleanupOldCollections();
}

export default cleanupOldCollections;

