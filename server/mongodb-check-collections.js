// ==========================================
// MONGODB SHELL SCRIPT - KIỂM TRA COLLECTIONS
// ==========================================
// Copy toàn bộ code này và paste vào MongoDB Compass Shell

// Chọn database (thay đổi tên database nếu cần)
db = db.getSiblingDB('TutorTrek');

print('📊 KIỂM TRA COLLECTIONS TRONG DATABASE\n');
print('═══════════════════════════════════════════════════\n');

// Liệt kê tất cả collections
var allCollections = db.getCollectionNames();

print('📋 Tổng số collections: ' + allCollections.length + '\n');

// Collections mới (nên có)
var newCollections = ['seller', 'customers', 'product', 'items', 'categories', 'payment', 'admin'];

// Collections cũ (không nên có)
var oldCollections = ['course', 'courses', 'instructor', 'instructors', 'student', 'students', 'lesson', 'lessons'];

print('✅ COLLECTIONS MỚI (nên có):');
print('───────────────────────────────────────────────────');
newCollections.forEach(function(colName) {
    var exists = allCollections.indexOf(colName) !== -1;
    if (exists) {
        var count = db[colName].countDocuments();
        print('   ✅ ' + colName + ' - ' + count + ' documents');
    } else {
        print('   ❌ ' + colName + ' - KHÔNG TỒN TẠI');
    }
});

print('\n🗑️  COLLECTIONS CŨ (không nên có):');
print('───────────────────────────────────────────────────');
oldCollections.forEach(function(colName) {
    var exists = allCollections.indexOf(colName) !== -1;
    if (exists) {
        var count = db[colName].countDocuments();
        print('   ⚠️  ' + colName + ' - ' + count + ' documents (CẦN XÓA)');
    } else {
        print('   ✅ ' + colName + ' - Đã xóa');
    }
});

print('\n📦 TẤT CẢ COLLECTIONS:');
print('───────────────────────────────────────────────────');
allCollections.forEach(function(colName) {
    var count = db[colName].countDocuments();
    var isNew = newCollections.indexOf(colName) !== -1;
    var isOld = oldCollections.indexOf(colName) !== -1;
    var status = isNew ? '✅ MỚI' : (isOld ? '🗑️  CŨ' : '❓ KHÁC');
    print('   ' + status + ' - ' + colName + ' (' + count + ' documents)');
});

print('\n═══════════════════════════════════════════════════');
print('✅ Hoàn tất kiểm tra!');

