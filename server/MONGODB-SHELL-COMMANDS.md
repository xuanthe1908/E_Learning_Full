# MongoDB Shell Commands

Các script này có thể paste trực tiếp vào MongoDB Compass Shell hoặc MongoDB Shell.

## 📋 Cách sử dụng

1. Mở MongoDB Compass
2. Kết nối đến database `TutorTrek`
3. Click vào tab **"MongoDB Shell"** (hoặc nhấn `Ctrl + Shift + P` và chọn "Open MongoDB Shell")
4. Copy và paste code từ các file dưới đây

---

## 1. ✅ Kiểm tra Collections (KHÔNG XÓA)

**File:** `mongodb-check-collections.js`

```javascript
// Chọn database
db = db.getSiblingDB('TutorTrek');

print('📊 KIỂM TRA COLLECTIONS TRONG DATABASE\n');
print('═══════════════════════════════════════════════════\n');

var allCollections = db.getCollectionNames();
print('📋 Tổng số collections: ' + allCollections.length + '\n');

var newCollections = ['seller', 'customers', 'product', 'items', 'categories', 'payment', 'admin'];
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
```

---

## 2. 🗑️ Xóa Collections Cũ (CHỈ XÓA CŨ)

**File:** `mongodb-cleanup-shell.js`

```javascript
// Chọn database
db = db.getSiblingDB('TutorTrek');

print('🔍 Đang kiểm tra collections hiện tại...\n');

var allCollections = db.getCollectionNames();
print('📋 Tìm thấy ' + allCollections.length + ' collections:');
allCollections.forEach(function(colName) {
    var count = db[colName].countDocuments();
    print('   - ' + colName + ' (' + count + ' documents)');
});

print('\n⚠️  Đang xóa collections cũ (course, instructor, students, lessons)...\n');

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
```

---

## 3. ⚠️ XÓA TẤT CẢ Collections (CẨN THẬN!)

**File:** `mongodb-drop-all-and-seed.js`

```javascript
// Chọn database
db = db.getSiblingDB('TutorTrek');

print('⚠️  XÓA TOÀN BỘ COLLECTIONS TRONG DATABASE\n');
print('═══════════════════════════════════════════════════\n');

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
```

---

## 📝 Lưu ý

- **Script 1** (Kiểm tra): An toàn, chỉ đọc, không xóa gì
- **Script 2** (Xóa cũ): Chỉ xóa collections cũ, giữ lại collections mới
- **Script 3** (Xóa tất cả): ⚠️ XÓA TẤT CẢ, cần chạy seed lại sau đó

## 🔄 Sau khi xóa

Chạy lệnh sau để seed lại data:
```bash
cd server
npm run setup-db:drop-all
```

