# 🔑 Danh sách tài khoản test

## 👑 ADMIN
| Email | Password | Mô tả |
|-------|----------|-------|
| `admin@shop.com` | `admin123` | Tài khoản quản trị viên |

---

## 👨‍💼 SELLERS (Tất cả dùng password: `password123`)

| STT | Email | Tên | Mô tả |
|-----|-------|-----|-------|
| 1 | `nguyenvanan@seller.com` | Nguyễn Văn An | Chuyên bán điện tử, laptop, điện thoại |
| 2 | `tranthibinh@seller.com` | Trần Thị Bình | Chuyên phụ kiện công nghệ |
| 3 | `leminhcuong@seller.com` | Lê Minh Cường | Chuyên máy ảnh, camera |
| 4 | `phamthidung@seller.com` | Phạm Thị Dung | Chuyên sản phẩm Apple |
| 5 | `hoangvanem@seller.com` | Hoàng Văn Em | Chuyên laptop, máy tính bảng |

**Password chung cho tất cả sellers:** `password123`

---

## 👤 CUSTOMERS (Tất cả dùng password: `password123`)

| STT | Email | Tên | Sở thích |
|-----|-------|-----|----------|
| 1 | `nguyenthihoa@customer.com` | Nguyễn Thị Hoa | Điện thoại, Tai nghe, Đồng hồ thông minh |
| 2 | `tranvanhung@customer.com` | Trần Văn Hùng | Laptop, Máy tính bảng, Phụ kiện |
| 3 | `lethilan@customer.com` | Lê Thị Lan | Máy ảnh, Camera, Phụ kiện nhiếp ảnh |
| 4 | `phamminhkhang@customer.com` | Phạm Minh Khang | Gaming, Laptop gaming, Bàn phím cơ |
| 5 | `hoangthimai@customer.com` | Hoàng Thị Mai | Apple, iPhone, iPad, MacBook |
| 6 | `vuvanlong@customer.com` | Vũ Văn Long | Âm thanh, Loa, Tai nghe |
| 7 | `dothinga@customer.com` | Đỗ Thị Nga | Điện thoại, Smartphone, Phụ kiện |
| 8 | `buiminhphuc@customer.com` | Bùi Minh Phúc | Laptop, Workstation, Máy tính bảng |

**Password chung cho tất cả customers:** `password123`

---

## 📝 Ghi chú

- Tất cả tài khoản đã được seed vào database khi chạy `seedAllData.ts`
- Passwords đã được hash bằng bcrypt với salt rounds = 10
- Tất cả sellers đều đã được verify (`isVerified: true`)
- Tất cả customers và sellers đều không bị block (`isBlocked: false`)

---

## 🚀 Cách sử dụng

1. **Đăng nhập Admin:**
   - URL: `http://localhost:3000/admin`
   - Email: `admin@shop.com`
   - Password: `admin123`

2. **Đăng nhập Seller:**
   - URL: `http://localhost:3000/sellers/login`
   - Email: `nguyenvanan@seller.com` (hoặc bất kỳ seller nào)
   - Password: `password123`

3. **Đăng nhập Customer:**
   - URL: `http://localhost:3000/login`
   - Email: `nguyenthihoa@customer.com` (hoặc bất kỳ customer nào)
   - Password: `password123`

---

## ⚠️ Lưu ý

- Đây là tài khoản test, không dùng cho production
- Nếu không đăng nhập được, kiểm tra xem đã chạy seed data chưa:
  ```bash
  cd server
  npx ts-node src/scripts/seedAllData.ts
  ```

