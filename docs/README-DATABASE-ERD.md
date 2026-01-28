# 📊 Database Entity-Relationship Diagram (ERD)

## 📋 Tổng quan

Tài liệu này mô tả cấu trúc database của hệ thống Shop Platform sử dụng MongoDB.

## 🔧 Cách xem ERD

### Sử dụng dbdiagram.io (Khuyến nghị)

1. Truy cập: https://dbdiagram.io/
2. Click "Create New Diagram"
3. Copy nội dung file `database-erd.dbml`
4. Paste vào editor
5. ERD sẽ tự động render

### Export ERD

- **PNG**: Click "Export" → "PNG"
- **PDF**: Click "Export" → "PDF"
- **SQL**: Click "Export" → "PostgreSQL" hoặc "MySQL" (để tham khảo)

## 📐 Cấu trúc Database

### 1. Customer (Khách hàng)
- **Collection**: `customers`
- **Mô tả**: Thông tin khách hàng
- **Quan hệ**:
  - 1:N với `payments` (một khách hàng có nhiều thanh toán)
  - 1:N với `ai_chats` (một khách hàng có nhiều chat)
  - 1:N với `discussions` (một khách hàng tạo nhiều thảo luận)
  - N:M với `products` (nhiều khách hàng mua nhiều sản phẩm)

### 2. Seller (Người bán)
- **Collection**: `instructor`
- **Mô tả**: Thông tin người bán
- **Quan hệ**:
  - 1:N với `products` (một người bán tạo nhiều sản phẩm)
  - 1:N với `items` (một người bán tạo nhiều items)
  - 1:N với `ai_chats` (một người bán có nhiều chat)

### 3. Admin (Quản trị viên)
- **Collection**: `admin`
- **Mô tả**: Thông tin quản trị viên
- **Quan hệ**: Không có quan hệ trực tiếp với các entities khác

### 4. Product (Sản phẩm)
- **Collection**: `course`
- **Mô tả**: Thông tin sản phẩm
- **Quan hệ**:
  - N:1 với `sellers` (nhiều sản phẩm thuộc về một người bán)
  - 1:N với `items` (một sản phẩm có nhiều items)
  - N:1 với `categories` (nhiều sản phẩm thuộc một danh mục - qua field category)
  - N:M với `customers` (nhiều sản phẩm được nhiều khách hàng mua)
  - 1:N với `payments` (một sản phẩm có nhiều thanh toán)

### 5. Item (Item của sản phẩm)
- **Collection**: `lessons`
- **Mô tả**: Item chi tiết của sản phẩm
- **Quan hệ**:
  - N:1 với `products` (nhiều items thuộc về một sản phẩm)
  - N:1 với `sellers` (nhiều items thuộc về một người bán)
  - 1:N với `discussions` (một item có nhiều thảo luận)
  - 1:N với `quizzes` (một item có nhiều quiz)

### 6. Category (Danh mục)
- **Collection**: `categories`
- **Mô tả**: Danh mục sản phẩm
- **Quan hệ**:
  - 1:N với `products` (một danh mục có nhiều sản phẩm - qua field category)

### 7. Payment (Thanh toán)
- **Collection**: `payment`
- **Mô tả**: Thông tin thanh toán
- **Quan hệ**:
  - N:1 với `customers` (nhiều thanh toán của một khách hàng)
  - N:1 với `products` (nhiều thanh toán cho một sản phẩm)

### 8. AI Chat (Chat AI)
- **Collection**: `ai_chats`
- **Mô tả**: Lịch sử chat với AI
- **Quan hệ**:
  - N:1 với `customers` hoặc `sellers` (nhiều chat của một user - qua userId và userType)

### 9. Discussion (Thảo luận)
- **Collection**: `discussions`
- **Mô tả**: Thảo luận về items
- **Quan hệ**:
  - N:1 với `customers` (nhiều thảo luận của một khách hàng)
  - N:1 với `items` (nhiều thảo luận về một item)

### 10. Quiz (Câu hỏi)
- **Collection**: `quiz`
- **Mô tả**: Câu hỏi quiz cho items
- **Quan hệ**:
  - N:1 với `products` (nhiều quiz của một sản phẩm)
  - N:1 với `items` (nhiều quiz của một item)

### 11. Contact (Liên hệ)
- **Collection**: `contacts`
- **Mô tả**: Tin nhắn liên hệ từ khách hàng
- **Quan hệ**: Không có quan hệ với entities khác

### 12. Refresh Token (Token làm mới)
- **Collection**: `refresh_tokens`
- **Mô tả**: Refresh tokens cho authentication
- **Quan hệ**:
  - N:1 với `customers`, `sellers`, hoặc `admins` (qua userId và userType)

## 🔗 Quan hệ chính

### One-to-Many (1:N)
- Seller → Products
- Product → Items
- Product → Payments
- Customer → Payments
- Customer → AI Chats
- Customer → Discussions
- Seller → AI Chats
- Item → Discussions
- Item → Quizzes

### Many-to-Many (N:M)
- Customers ↔ Products (qua `coursesEnrolled` array trong Product)

### One-to-One (1:1)
- Không có quan hệ 1:1 trực tiếp

## 📝 Lưu ý

1. **MongoDB là NoSQL**: Quan hệ được implement qua ObjectId references, không phải foreign keys như SQL
2. **Embedded Documents**: Một số data được embed (như `messages` trong `ai_chats`, `replies` trong `discussions`)
3. **Polymorphic References**: `ai_chats.userId` và `refresh_tokens.userId` có thể reference đến nhiều collections khác nhau (qua `userType`)
4. **Array Fields**: MongoDB hỗ trợ arrays, được sử dụng cho `coursesEnrolled`, `tags`, `interests`, etc.

## 🎨 Cách sử dụng trong dbdiagram.io

1. Mở https://dbdiagram.io/
2. Tạo diagram mới
3. Copy toàn bộ nội dung từ `database-erd.dbml`
4. Paste vào editor
5. Diagram sẽ tự động render với:
   - Tables và columns
   - Relationships (arrows)
   - Colors và styling

## 📊 Export Options

- **PNG**: High resolution image
- **PDF**: Vector format, tốt cho in ấn
- **SQL**: PostgreSQL/MySQL format (để tham khảo)

---

*Tài liệu này được tạo tự động dựa trên MongoDB models trong codebase.*

