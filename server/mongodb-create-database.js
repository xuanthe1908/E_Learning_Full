// ==========================================
// MONGODB SHELL SCRIPT - TẠO DATABASE VÀ COLLECTIONS
// ==========================================
// Copy toàn bộ code này và paste vào MongoDB Compass Shell

// Tạo hoặc chọn database TutorTrek
db = db.getSiblingDB('TutorTrek');

print('✅ Đã chọn database: TutorTrek\n');

// Tạo các collections bằng cách insert một document rỗng rồi xóa
// (MongoDB chỉ tạo collection khi có document đầu tiên)

print('📦 Đang tạo collections...\n');

var collections = [
    'seller',
    'customers', 
    'product',
    'items',
    'categories',
    'payment',
    'admin'
];

collections.forEach(function(colName) {
    try {
        // Tạo collection bằng cách insert và xóa document rỗng
        db[colName].insertOne({ _temp: true });
        db[colName].deleteOne({ _temp: true });
        print('   ✅ Đã tạo collection: ' + colName);
    } catch (e) {
        print('   ⚠️  Lỗi khi tạo ' + colName + ': ' + e);
    }
});

print('\n📊 Collections hiện tại:');
var allCollections = db.getCollectionNames();
allCollections.forEach(function(colName) {
    var count = db[colName].countDocuments();
    print('   - ' + colName + ' (' + count + ' documents)');
});

print('\n✅ Hoàn tất! Database TutorTrek đã được tạo.');
print('📝 Bước tiếp theo: Chạy npm run setup-db để seed data');

