# Hướng dẫn Setup Database

## Yêu cầu

1. MongoDB đã được cài đặt và đang chạy
2. File `.env` đã được cấu hình với biến `DATABASE` (MongoDB connection string)
3. Đã cài đặt dependencies: `npm install` hoặc `yarn install`

## Cách sử dụng

### 1. Setup và Seed Database (Lần đầu)

```bash
# Sử dụng npm
npm run setup-db

# Hoặc sử dụng yarn
yarn setup-db

# Hoặc chạy trực tiếp
npx ts-node src/scripts/setup-database.ts
```

Script này sẽ:
- ✅ Kết nối với MongoDB
- ✅ Seed Categories (danh mục)
- ✅ Seed Sellers (người bán)
- ✅ Seed Customers (khách hàng)
- ✅ Seed Products (sản phẩm)
- ✅ Seed Payments (thanh toán mẫu)
- ✅ Seed Admin (quản trị viên)
- ✅ Cập nhật relationships giữa các collections

### 2. Reset và Seed lại Database

Nếu muốn xóa dữ liệu cũ và seed lại từ đầu:

```bash
# Sử dụng npm
npm run setup-db:reset

# Hoặc sử dụng yarn
yarn setup-db:reset

# Hoặc chạy trực tiếp
npx ts-node src/scripts/setup-database.ts --delete-old
```

### 3. Chỉ kiểm tra kết nối Database

```bash
npx ts-node src/scripts/setup-database.ts --setup-only
```

## Thông tin đăng nhập mặc định

Sau khi seed xong, bạn có thể sử dụng các tài khoản sau:

### 👑 Admin
- **Email**: `admin@shop.com`
- **Password**: `admin123`

### 👨‍💼 Seller (Người bán)
- **Email**: `nguyenvanan@seller.com`
- **Password**: `password123`

### 👤 Customer (Khách hàng)
- **Email**: `nguyenthihoa@customer.com`
- **Password**: `password123`

## Cấu trúc Database

Script sẽ tạo các collections sau:

1. **categories** - Danh mục sản phẩm
2. **seller** - Người bán
3. **customers** - Khách hàng
4. **product** - Sản phẩm
5. **items** - Items của sản phẩm (tương đương lessons)
6. **payment** - Thanh toán
7. **admin** - Quản trị viên

## Lưu ý

- ⚠️ Script sẽ **KHÔNG** xóa dữ liệu cũ nếu không dùng flag `--delete-old`
- ✅ Script sẽ bỏ qua nếu dữ liệu đã tồn tại (trừ khi dùng `--delete-old`)
- 🔒 Tất cả passwords đều được hash bằng bcrypt
- 📊 Script sẽ hiển thị tổng kết số lượng records đã seed

## Troubleshooting

### Lỗi: "DATABASE environment variable is not set"

Kiểm tra file `.env` và đảm bảo có biến:
```
DATABASE=mongodb://localhost:27017/your-database-name
```

### Lỗi: "Cannot connect to MongoDB"

1. Kiểm tra MongoDB đã chạy chưa: `mongod` hoặc `brew services start mongodb-community`
2. Kiểm tra connection string trong `.env`
3. Kiểm tra firewall/network settings

### Lỗi: "Duplicate key error"

Nếu gặp lỗi duplicate key, sử dụng `--delete-old` để xóa dữ liệu cũ trước:
```bash
npm run setup-db:reset
```

