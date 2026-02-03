// ==========================================
// MONGODB SHELL SCRIPT - KIỂM TRA VÀ SỬA DATABASE
// ==========================================
// Copy toàn bộ code này và paste vào MongoDB Compass Shell

print('🔍 KIỂM TRA DATABASE\n');
print('═══════════════════════════════════════════════════\n');

// Kiểm tra database hiện tại
print('📂 Database hiện tại: ' + db.getName() + '\n');

// Liệt kê tất cả databases
print('📋 Tất cả databases:');
db.adminCommand('listDatabases').databases.forEach(function(database) {
    print('   - ' + database.name + ' (' + (database.sizeOnDisk / 1024).toFixed(2) + ' KB)');
});

print('\n');

// Chuyển sang database TutorTrek
print('🔄 Chuyển sang database TutorTrek...\n');
db = db.getSiblingDB('TutorTrek');

print('📂 Database hiện tại: ' + db.getName() + '\n');

// Kiểm tra collections
var collections = db.getCollectionNames();
print('📦 Collections trong TutorTrek: ' + collections.length + '\n');

if (collections.length === 0) {
    print('⚠️  Database TutorTrek trống!');
    print('📝 Cần chạy: npm run setup-db:drop-all\n');
} else {
    collections.forEach(function(colName) {
        var count = db[colName].countDocuments();
        print('   - ' + colName + ' (' + count + ' documents)');
    });
    print('\n✅ Database TutorTrek đã có data!');
}

print('\n═══════════════════════════════════════════════════');

