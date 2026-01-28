# 📦 Hướng dẫn Seed Mock Data

## 🎯 Mục đích

File này hướng dẫn cách seed mock data vào database để hệ thống có dữ liệu để test và viết báo cáo.

## 🚀 Cách chạy Seed Script

### Bước 1: Đảm bảo Backend đang chạy

```bash
cd server
npm install
npm run dev
```

### Bước 2: Chạy Seed Script

**Option 1: Seed mới (giữ lại data cũ)**
```bash
cd server
npx ts-node src/scripts/seedAllData.ts
```

**Option 2: Xóa data cũ và seed mới**
```bash
cd server
npx ts-node src/scripts/seedAllData.ts --delete-old
```

## 📊 Dữ liệu sẽ được seed

### 1. Categories (Danh mục)
- 10+ danh mục sản phẩm
- Bao gồm: Điện tử, Thời trang, Đồ gia dụng, Sách, Thể thao, v.v.

### 2. Sellers (Người bán)
- 5+ seller accounts
- Email: `nguyenvanan@seller.com`, `tranthibinh@seller.com`, v.v.
- Password: `password123` (đã được hash)

### 3. Customers (Khách hàng)
- 10+ customer accounts
- Email: `nguyenthihoa@customer.com`, `lethimai@customer.com`, v.v.
- Password: `password123` (đã được hash)

### 4. Products (Sản phẩm)
- 50+ sản phẩm với đầy đủ thông tin
- Hình ảnh từ Unsplash
- Giá, mô tả, danh mục, seller
- Items (bài học/nội dung) cho mỗi sản phẩm

### 5. Admin
- 1 admin account
- Email: `admin@shop.com`
- Password: `admin123` (đã được hash)

### 6. Payments (Thanh toán)
- Một số payment records mẫu

## ✅ Kiểm tra sau khi seed

### 1. Kiểm tra Database
- Mở MongoDB Compass hoặc MongoDB shell
- Kiểm tra các collections: `categories`, `instructors`, `students`, `courses`, `payments`, `admins`

### 2. Kiểm tra Frontend
- Mở `http://localhost:3000/shop`
- Xem danh sách sản phẩm có hiển thị không

### 3. Đăng nhập test
- **Admin**: `admin@shop.com` / `admin123`
- **Seller**: `nguyenvanan@seller.com` / `password123`
- **Customer**: `nguyenthihoa@customer.com` / `password123`

## 🔧 Troubleshooting

### Lỗi: "DATABASE environment variable is not set"
- Kiểm tra file `.env` trong thư mục `server`
- Đảm bảo có biến `DATABASE=mongodb://...`

### Lỗi: "Cannot connect to MongoDB"
- Kiểm tra MongoDB đang chạy
- Kiểm tra connection string trong `.env`

### Lỗi: "Duplicate key error"
- Chạy lại với flag `--delete-old` để xóa data cũ

## 📝 Lưu ý

- Script sẽ tự động hash passwords
- Images sử dụng URLs từ Unsplash (không cần upload)
- Data được tạo với format phù hợp với MongoDB schema
- Có thể chạy lại script nhiều lần (nhưng nên dùng `--delete-old` để tránh duplicate)

## 🎨 Mock Data Sources

- **Images**: Unsplash (https://unsplash.com)
- **Product Names**: Tự tạo dựa trên danh mục
- **Descriptions**: Mô tả tiếng Việt chi tiết
- **Prices**: Giá hợp lý (50,000 - 5,000,000 VNĐ)

---

*Lưu ý: Đảm bảo backend server đang chạy trước khi seed data!*

