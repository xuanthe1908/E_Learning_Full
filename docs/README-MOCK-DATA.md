# 📦 Mock Data Documentation

## 📋 Tổng quan

Tài liệu này mô tả mock data được sử dụng trong hệ thống Shop Platform để phục vụ development và testing.

## 🗂️ Cấu trúc Mock Data

### 1. Categories (Danh mục)
**File**: `server/src/data/mockCategories.ts`
- **Số lượng**: 9 danh mục
- **Bao gồm**: Điện tử, Điện thoại, Laptop, Máy tính bảng, Tai nghe, Đồng hồ thông minh, Máy ảnh, Âm thanh, Phụ kiện

### 2. Products (Sản phẩm)
**File**: `server/src/data/mockProducts.ts`
- **Số lượng**: 15 sản phẩm
- **Bao gồm**:
  - Laptop: Dell XPS 15, MacBook Pro 14, ASUS ROG Zephyrus G16
  - Điện thoại: iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, Xiaomi 14 Pro
  - Máy tính bảng: iPad Pro 12.9 inch
  - Tai nghe: Sony WH-1000XM5, AirPods Pro 2, Bose QuietComfort 45
  - Đồng hồ: Samsung Galaxy Watch 6, Apple Watch Series 9
  - Máy ảnh: Canon EOS R6 Mark II
  - Âm thanh: JBL Charge 5
  - Phụ kiện: Keychron K8 Pro

### 3. Sellers (Người bán)
**File**: `server/src/data/mockSellers.ts`
- **Số lượng**: 5 sellers
- **Thông tin**: Tên, email, profile picture, certificates, experience, skills
- **Trạng thái**: Tất cả đã được verify

### 4. Customers (Khách hàng)
**File**: `server/src/data/mockCustomers.ts`
- **Số lượng**: 8 customers
- **Thông tin**: Tên, email, profile picture, interests
- **Trạng thái**: Tất cả active, không bị block

### 5. Admin
**File**: `server/src/data/mockAdmin.ts`
- **Số lượng**: 1 admin
- **Email**: admin@shop.com
- **Password**: admin123

## 🚀 Cách sử dụng

### Seed toàn bộ data

```bash
cd server
npx ts-node src/scripts/seedAllData.ts
```

### Seed và xóa data cũ

```bash
npx ts-node src/scripts/seedAllData.ts --delete-old
```

## 🔑 Thông tin đăng nhập

### Admin
- **Email**: admin@shop.com
- **Password**: admin123

### Sellers
- **Email**: nguyenvanan@seller.com
- **Password**: password123

Các sellers khác:
- tranthibinh@seller.com
- leminhcuong@seller.com
- phamthidung@seller.com
- hoangvanem@seller.com

### Customers
- **Email**: nguyenthihoa@customer.com
- **Password**: password123

Các customers khác:
- tranvanhung@customer.com
- lethilan@customer.com
- phamminhkhang@customer.com
- hoangthimai@customer.com
- vuvanlong@customer.com
- dothinga@customer.com
- buiminhphuc@customer.com

## 📊 Thống kê Data

Sau khi seed:
- ✅ **9 Categories** - Đầy đủ danh mục
- ✅ **5 Sellers** - Người bán với profile đầy đủ
- ✅ **8 Customers** - Khách hàng với interests
- ✅ **15 Products** - Sản phẩm đa dạng với ảnh đẹp
- ✅ **5 Payments** - Thanh toán mẫu
- ✅ **1 Admin** - Quản trị viên

## 🖼️ Ảnh sản phẩm

Tất cả ảnh sản phẩm sử dụng Unsplash với:
- **Kích thước**: 1200x800px
- **Format**: JPG
- **Quality**: High quality
- **URLs**: Unsplash direct links

## 📝 Lưu ý

1. **Passwords**: Tất cả passwords được hash bằng bcrypt với salt rounds 10
2. **Relationships**: 
   - Products được phân bổ đều cho các sellers
   - Customers được enroll vào một số products
   - Payments được tạo cho một số transactions
3. **Timestamps**: Data có timestamps realistic để test sorting và filtering
4. **Ratings**: Products có ratings từ 4.5 đến 4.9

## 🔄 Update Mock Data

Để thêm/sửa mock data:
1. Chỉnh sửa file tương ứng trong `server/src/data/`
2. Chạy lại seed script với `--delete-old` để cập nhật

---

*Mock data được tạo để phục vụ development và testing. Trong production, data sẽ được quản lý qua admin panel.*

