# 🔗 Danh sách Links Hệ thống Shop Platform

## 📋 Tổng quan

Tài liệu này liệt kê tất cả các routes/links trong hệ thống Shop Platform.

**Base URL Development**: `http://localhost:3000`  
**Base URL Production**: `https://yourdomain.com`

---

## 🌐 PUBLIC PAGES (Không cần đăng nhập)

### Trang chủ và Shop
- **Trang chủ**: `http://localhost:3000/`
- **Danh sách sản phẩm**: `http://localhost:3000/shop`
- **Chi tiết sản phẩm**: `http://localhost:3000/shop/:productId`
  - Ví dụ: `http://localhost:3000/shop/1`
- **Xem item của sản phẩm**: `http://localhost:3000/shop/:productId/view/:itemId`
  - Ví dụ: `http://localhost:3000/shop/1/view/item1`

### Danh sách Sellers
- **Danh sách sellers**: `http://localhost:3000/tutors`
- **Chi tiết seller**: `http://localhost:3000/tutors/:tutorId`
  - Ví dụ: `http://localhost:3000/tutors/seller1`

### Trang khác
- **Cộng đồng**: `http://localhost:3000/community`
- **Giới thiệu**: `http://localhost:3000/about`
- **Liên hệ**: `http://localhost:3000/contact`

### Authentication
- **Đăng nhập Customer**: `http://localhost:3000/login`
- **Đăng ký Customer**: `http://localhost:3000/register`
- **Đăng nhập Seller**: `http://localhost:3000/instructors/login`
- **Đăng ký Seller**: `http://localhost:3000/instructors/register`

---

## 👤 CUSTOMER PAGES (Cần đăng nhập Customer)

### Dashboard Customer
- **Dashboard chính**: `http://localhost:3000/dashboard`
- **Sản phẩm của tôi**: `http://localhost:3000/dashboard/my-products`
- **Hồ sơ của tôi**: `http://localhost:3000/dashboard/my-profile`

### Shopping
- **Giỏ hàng**: `http://localhost:3000/cart`
- **Thanh toán**: `http://localhost:3000/checkout`
- **Xác nhận đơn hàng**: `http://localhost:3000/order-confirmation`
- **Thanh toán VNPay**: `http://localhost:3000/shop/:productId/payment`
  - Ví dụ: `http://localhost:3000/shop/1/payment`
- **VNPay Return**: `http://localhost:3000/payment/vnpay/return`

---

## 👨‍💼 SELLER PAGES (Cần đăng nhập Seller)

### Dashboard Seller
- **Dashboard chính**: `http://localhost:3000/instructors`

### Quản lý Sản phẩm
- **Thêm sản phẩm**: `http://localhost:3000/instructors/add-product`
- **Danh sách sản phẩm của tôi**: `http://localhost:3000/instructors/view-products`
- **Chỉnh sửa sản phẩm**: `http://localhost:3000/instructors/edit-product/:productId`
  - Ví dụ: `http://localhost:3000/instructors/edit-product/1`

### Quản lý Items
- **Xem items của sản phẩm**: `http://localhost:3000/instructors/view-items/:productId`
  - Ví dụ: `http://localhost:3000/instructors/view-items/1`
- **Chỉnh sửa item**: `http://localhost:3000/instructors/view-items/:productId/edit-item/:itemId`
  - Ví dụ: `http://localhost:3000/instructors/view-items/1/edit-item/item1`

### Quản lý khác
- **Xem khách hàng của tôi**: `http://localhost:3000/instructors/view-students`
- **Hồ sơ của tôi**: `http://localhost:3000/instructors/view-profile`
- **Kênh của tôi**: `http://localhost:3000/instructors/view-channels`

---

## 👑 ADMIN PAGES (Cần đăng nhập Admin)

### Dashboard Admin
- **Dashboard chính**: `http://localhost:3000/admin`

### Quản lý Sellers
- **Danh sách sellers**: `http://localhost:3000/admin/instructors`
- **Yêu cầu đăng ký seller**: `http://localhost:3000/admin/instructors/requests`
- **Chi tiết yêu cầu**: `http://localhost:3000/admin/instructors/requests/:id`
  - Ví dụ: `http://localhost:3000/admin/instructors/requests/req1`
- **Sellers bị chặn**: `http://localhost:3000/admin/instructors/blocked`

### Quản lý Customers
- **Danh sách customers**: `http://localhost:3000/admin/students`

### Quản lý Danh mục
- **Danh sách danh mục**: `http://localhost:3000/admin/categories`
- **Thêm danh mục**: `http://localhost:3000/admin/categories/add-category`
- **Chỉnh sửa danh mục**: `http://localhost:3000/admin/categories/edit-category/:categoryId`
  - Ví dụ: `http://localhost:3000/admin/categories/edit-category/1`

---

## 📝 Ví dụ Links cụ thể

### Public Pages
```
http://localhost:3000/
http://localhost:3000/shop
http://localhost:3000/shop/1
http://localhost:3000/shop/1/view/item1
http://localhost:3000/tutors
http://localhost:3000/tutors/seller1
http://localhost:3000/community
http://localhost:3000/about
http://localhost:3000/contact
http://localhost:3000/login
http://localhost:3000/register
http://localhost:3000/instructors/login
http://localhost:3000/instructors/register
```

### Customer Pages (sau khi login)
```
http://localhost:3000/dashboard
http://localhost:3000/dashboard/my-products
http://localhost:3000/dashboard/my-profile
http://localhost:3000/cart
http://localhost:3000/checkout
http://localhost:3000/order-confirmation
http://localhost:3000/shop/1/payment
```

### Seller Pages (sau khi login)
```
http://localhost:3000/instructors
http://localhost:3000/instructors/add-product
http://localhost:3000/instructors/view-products
http://localhost:3000/instructors/edit-product/1
http://localhost:3000/instructors/view-items/1
http://localhost:3000/instructors/view-items/1/edit-item/item1
http://localhost:3000/instructors/view-students
http://localhost:3000/instructors/view-profile
http://localhost:3000/instructors/view-channels
```

### Admin Pages (sau khi login)
```
http://localhost:3000/admin
http://localhost:3000/admin/instructors
http://localhost:3000/admin/instructors/requests
http://localhost:3000/admin/instructors/requests/req1
http://localhost:3000/admin/instructors/blocked
http://localhost:3000/admin/students
http://localhost:3000/admin/categories
http://localhost:3000/admin/categories/add-category
http://localhost:3000/admin/categories/edit-category/1
```

---

## 🔐 Thông tin đăng nhập để test

### Admin
- **Email**: admin@shop.com
- **Password**: admin123
- **Link**: `http://localhost:3000/admin`

### Seller
- **Email**: nguyenvanan@seller.com
- **Password**: password123
- **Link**: `http://localhost:3000/instructors/login`

### Customer
- **Email**: nguyenthihoa@customer.com
- **Password**: password123
- **Link**: `http://localhost:3000/login`

---

## 📊 Sơ đồ Navigation

### Customer Flow
```
/ → /shop → /shop/:productId → /cart → /checkout → /order-confirmation
         ↓
    /dashboard → /dashboard/my-products
              → /dashboard/my-profile
```

### Seller Flow
```
/instructors/login → /instructors → /instructors/add-product
                                  → /instructors/view-products
                                  → /instructors/view-students
                                  → /instructors/view-profile
```

### Admin Flow
```
/admin → /admin/instructors → /admin/instructors/requests
       → /admin/students
       → /admin/categories
```

---

## 🎯 Quick Access Links

### Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api

### Production (thay đổi theo domain thực tế)
- **Frontend**: https://yourdomain.com
- **Backend API**: https://api.yourdomain.com/api

---

*Lưu ý: Thay `:productId`, `:itemId`, `:tutorId`, `:categoryId`, `:id` bằng ID thực tế khi truy cập.*

