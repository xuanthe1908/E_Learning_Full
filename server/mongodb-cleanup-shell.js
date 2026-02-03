// ==========================================
// MONGODB SHELL SCRIPT - XÓA COLLECTIONS CŨ
// ==========================================
// Copy toàn bộ code này và paste vào MongoDB Compass Shell
// Hoặc chạy: mongosh < mongodb-cleanup-shell.js

// Chọn database (thay đổi tên database nếu cần)
db = db.getSiblingDB('TutorTrek');

print('🔍 Đang kiểm tra collections hiện tại...\n');

// Liệt kê tất cả collections
var allCollections = db.getCollectionNames();
print('📋 Tìm thấy ' + allCollections.length + ' collections:');
allCollections.forEach(function(colName) {
    var count = db[colName].countDocuments();
    print('   - ' + colName + ' (' + count + ' documents)');
});

print('\n⚠️  Đang xóa collections cũ (course, instructor, students, lessons)...\n');

// Danh sách collections cũ cần xóa
var oldCollections = [
    'course',
    'courses',
    'instructor',
    'instructors',
    'student',
    'students',
    'lesson',
    'lessons'
];

var deletedCount = 0;
oldCollections.forEach(function(colName) {
    try {
        var collection = db.getCollection(colName);
        var count = collection.countDocuments();
        if (count > 0 || allCollections.indexOf(colName) !== -1) {
            collection.drop();
            print('   ✅ Đã xóa: ' + colName + ' (' + count + ' documents)');
            deletedCount++;
        }
    } catch (e) {
        print('   ℹ️  ' + colName + ' không tồn tại hoặc đã bị xóa');
    }
});

print('\n📊 Collections còn lại sau khi dọn dẹp:');
var remainingCollections = db.getCollectionNames();
remainingCollections.forEach(function(colName) {
    var count = db[colName].countDocuments();
    print('   ✅ ' + colName + ' (' + count + ' documents)');
});

print('\n✅ Hoàn tất! Đã xóa ' + deletedCount + ' collections cũ.');

