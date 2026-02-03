// ==========================================
// MONGODB SHELL SCRIPT - XÓA TẤT CẢ VÀ KIỂM TRA
// ==========================================
// Copy toàn bộ code này và paste vào MongoDB Compass Shell
// ⚠️  CẢNH BÁO: Script này sẽ XÓA TẤT CẢ collections!

// Chọn database (thay đổi tên database nếu cần)
db = db.getSiblingDB('TutorTrek');

print('⚠️  XÓA TOÀN BỘ COLLECTIONS TRONG DATABASE\n');
print('═══════════════════════════════════════════════════\n');

// Liệt kê tất cả collections
var allCollections = db.getCollectionNames();
print('📋 Tìm thấy ' + allCollections.length + ' collections:\n');

allCollections.forEach(function(colName) {
    var count = db[colName].countDocuments();
    print('   - ' + colName + ' (' + count + ' documents)');
});

print('\n🗑️  Đang xóa tất cả collections...\n');

var deletedCount = 0;
allCollections.forEach(function(colName) {
    try {
        db[colName].drop();
        print('   ✅ Đã xóa: ' + colName);
        deletedCount++;
    } catch (e) {
        print('   ❌ Lỗi khi xóa ' + colName + ': ' + e);
    }
});

print('\n═══════════════════════════════════════════════════');
print('✅ Đã xóa ' + deletedCount + ' collections!');
print('═══════════════════════════════════════════════════\n');
print('📝 Bước tiếp theo:');
print('   1. Chạy script seed: npm run setup-db');
print('   2. Hoặc chạy: npm run setup-db:drop-all');
print('\n');

