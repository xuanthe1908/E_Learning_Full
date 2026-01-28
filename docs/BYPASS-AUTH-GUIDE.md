# 🔓 Bypass Authentication Guide - Chụp Màn Hình

## ✅ Đã Setup Mock Mode với Bypass Auth

Khi `USE_MOCK_DATA = true`, hệ thống sẽ:
1. **Tự động bypass authentication** cho Customer và Seller
2. **Sử dụng mock data** cho tất cả các trang
3. **Không cần đăng nhập** để truy cập các trang dashboard

## 🎯 Cách Sử Dụng

### 1. Đảm bảo Mock Mode đang bật
File: `client/src/config/mockConfig.ts`
```typescript
export const USE_MOCK_DATA = true; // ✅ Phải là true
```

### 2. Truy cập trực tiếp các trang

#### Customer Dashboard
```
http://localhost:3000/dashboard
http://localhost:3000/dashboard/my-products
http://localhost:3000/dashboard/my-profile
```

#### Seller Dashboard
```
http://localhost:3000/instructors
http://localhost:3000/instructors/view-products
http://localhost:3000/instructors/add-product
http://localhost:3000/instructors/view-students
http://localhost:3000/instructors/view-profile
```

#### Admin Dashboard
```
http://localhost:3000/admin
http://localhost:3000/admin/instructors
http://localhost:3000/admin/students
http://localhost:3000/admin/categories
```

## 📊 Mock Data Có Sẵn

### Customer Dashboard
- **3 sản phẩm đã mua** với completion status
- **Customer info**: Nguyễn Thị Hoa
- **Stats**: Tổng quan mua sắm

### Seller Dashboard
- **5 sản phẩm** với đầy đủ thông tin
- **Stats**: 
  - Tổng sản phẩm: 5
  - Tổng customers: 40
  - Tổng doanh thu: 209.6M VND
  - Tổng items: 8
- **Recent activities**: Hoạt động gần đây
- **Seller info**: Nguyễn Văn An

### Admin Dashboard
- **6 Sellers** với trạng thái
- **8 Customers** với thông tin đầy đủ
- **9 Categories** với mô tả
- **3 Instructor Requests** đang chờ duyệt
- **Dashboard stats** với charts

## 🎨 Các Trang Có Thể Chụp Màn Hình

### Customer Pages
1. ✅ `/dashboard` - Dashboard tổng quan
2. ✅ `/dashboard/my-products` - 3 sản phẩm đã mua
3. ✅ `/dashboard/my-profile` - Hồ sơ customer

### Seller Pages
1. ✅ `/instructors` - Dashboard seller với stats đầy đủ
2. ✅ `/instructors/view-products` - 5 sản phẩm của seller
3. ✅ `/instructors/add-product` - Form thêm sản phẩm
4. ✅ `/instructors/view-students` - Khách hàng của seller
5. ✅ `/instructors/view-profile` - Hồ sơ seller

### Admin Pages
1. ✅ `/admin` - Dashboard với charts và stats
2. ✅ `/admin/instructors` - 6 sellers
3. ✅ `/admin/students` - 8 customers
4. ✅ `/admin/categories` - 9 categories
5. ✅ `/admin/instructors/requests` - 3 requests
6. ✅ `/admin/instructors/blocked` - Sellers bị chặn

## 🔧 Troubleshooting

### Vẫn bị redirect về login?
1. Kiểm tra `USE_MOCK_DATA = true` trong `mockConfig.ts`
2. Clear localStorage: `localStorage.clear()` trong console
3. Refresh trang (F5)

### Không thấy data?
1. Kiểm tra console có lỗi không
2. Đảm bảo mock data files đã được import đúng
3. Refresh trang

### Muốn test với auth thật?
1. Set `USE_MOCK_DATA = false`
2. Đăng nhập bình thường
3. Sử dụng credentials từ seed data

---

**✅ Bây giờ bạn có thể chụp màn hình tất cả các trang mà không cần đăng nhập!**

