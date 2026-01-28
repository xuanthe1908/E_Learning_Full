# 🎭 Mock Mode Guide - Viết Báo Cáo Không Cần Backend

## ✅ Đã bật Mock Mode

Tất cả các trang đã được cấu hình để sử dụng **mock data** thay vì gọi API backend.

## 📁 File Cấu Hình

**`client/src/config/mockConfig.ts`**
```typescript
export const USE_MOCK_DATA = true; // ✅ Bật mock mode
export const MOCK_DELAY = 500; // Delay giả lập network (ms)
```

## 🎯 Các Trang Đã Có Mock Data

### 1. ✅ Shop/Products Page (`/shop`)
- **File**: `client/src/components/pages/course-pages/product-list.tsx`
- **Mock Data**: `client/src/data/mockShopData.ts`
- **15 sản phẩm** với đầy đủ thông tin và hình ảnh

### 2. ✅ Admin Dashboard (`/admin`)
- **File**: `client/src/components/pages/admin/admin-home-page.tsx`
- **Mock Data**: `client/src/data/mockDashboardData.ts`
- **Thống kê đầy đủ**: Users, Sellers, Customers, Products, Revenue, Charts

### 3. 🔄 Các Trang Khác
- Sẽ tự động fallback sang mock data nếu API fail

## 🚀 Cách Sử Dụng

### Bật/Tắt Mock Mode

**Bật Mock Mode (không cần backend):**
```typescript
// client/src/config/mockConfig.ts
export const USE_MOCK_DATA = true;
```

**Tắt Mock Mode (dùng API thật):**
```typescript
// client/src/config/mockConfig.ts
export const USE_MOCK_DATA = false;
```

### Chạy Frontend

```bash
cd client
npm start
```

**Không cần chạy backend!** Tất cả data sẽ lấy từ mock files.

## 📊 Mock Data Có Sẵn

### Products (Sản phẩm)
- 15 sản phẩm đầy đủ thông tin
- Hình ảnh từ Unsplash
- Giá, mô tả, danh mục, seller
- File: `client/src/data/mockShopData.ts`

### Admin Dashboard
- Thống kê tổng quan
- Biểu đồ doanh thu
- Biểu đồ tăng trưởng users
- Thống kê theo danh mục
- File: `client/src/data/mockDashboardData.ts`

### Seller Dashboard
- Thống kê sản phẩm
- Doanh thu
- Khách hàng
- File: `client/src/data/mockDashboardData.ts`

### Customer Dashboard
- Sản phẩm đã mua
- Lịch sử đơn hàng
- File: `client/src/data/mockDashboardData.ts`

## 🎨 Các Trang Có Thể Demo

### Public Pages
- ✅ `/` - Trang chủ
- ✅ `/shop` - Danh sách sản phẩm (15 sản phẩm)
- ✅ `/shop/:productId` - Chi tiết sản phẩm
- ✅ `/tutors` - Danh sách sellers
- ✅ `/community` - Cộng đồng
- ✅ `/about` - Giới thiệu
- ✅ `/contact` - Liên hệ

### Admin Pages
- ✅ `/admin` - Dashboard với thống kê đầy đủ
- ✅ `/admin/instructors` - Quản lý sellers
- ✅ `/admin/students` - Quản lý customers
- ✅ `/admin/categories` - Quản lý danh mục

### Seller Pages
- ✅ `/instructors` - Dashboard seller
- ✅ `/instructors/add-product` - Thêm sản phẩm
- ✅ `/instructors/view-products` - Sản phẩm của tôi
- ✅ `/instructors/view-students` - Khách hàng

### Customer Pages
- ✅ `/dashboard` - Dashboard customer
- ✅ `/dashboard/my-products` - Sản phẩm đã mua
- ✅ `/dashboard/my-profile` - Hồ sơ
- ✅ `/cart` - Giỏ hàng
- ✅ `/checkout` - Thanh toán

## 📝 Lưu Ý

1. **Mock Mode chỉ dùng cho demo/báo cáo**
   - Không lưu dữ liệu thật
   - Không có authentication thật
   - Không có payment thật

2. **Để test đầy đủ tính năng**
   - Tắt mock mode (`USE_MOCK_DATA = false`)
   - Chạy backend server
   - Seed data vào database

3. **Mock Data Format**
   - Tất cả mock data đều match với API response format
   - Có thể switch giữa mock và API dễ dàng

## 🔧 Troubleshooting

### Không thấy data?
- Kiểm tra `USE_MOCK_DATA = true` trong `mockConfig.ts`
- Refresh browser (Ctrl+R)
- Kiểm tra console có lỗi không

### Muốn thêm mock data?
- Thêm vào file tương ứng trong `client/src/data/`
- Format phải match với interface/type

### Muốn test với API thật?
- Set `USE_MOCK_DATA = false`
- Chạy backend server
- Seed data vào database

---

**✅ Bây giờ bạn có thể viết báo cáo mà không cần backend!**

