# 📊 Diagrams Documentation

Tài liệu này mô tả các Activity Diagrams và Sequence Diagrams của hệ thống Shop Platform.

## 📁 Cấu trúc Files

### Activity Diagrams
Mô tả luồng hoạt động của các tính năng:

- `activity-01-authentication.puml` - Xác thực và đăng nhập
- `activity-02-shop-management.puml` - Quản lý shop/sản phẩm
- `activity-03-user-management.puml` - Quản lý người dùng
- `activity-04-payment.puml` - Thanh toán VNPay
- `activity-05-community.puml` - Tương tác và cộng đồng
- `activity-06-ai-chat.puml` - AI Chat / Shop Chat
- `activity-07-statistics.puml` - Thống kê và báo cáo
- `activity-08-notifications.puml` - Thông báo
- `activity-09-contact-support.puml` - Liên hệ và hỗ trợ
- `activity-10-search-filter.puml` - Tìm kiếm và lọc
- `activity-11-responsive-ux.puml` - Responsive & UX
- `activity-12-security.puml` - Bảo mật
- `activity-13-performance.puml` - Hiệu năng
- `activity-14-file-management.puml` - Quản lý file
- `activity-15-interface.puml` - Giao diện
- `activity-16-additional-features.puml` - Tính năng bổ sung

### Sequence Diagrams
Mô tả tương tác giữa các thành phần hệ thống:

- `sequence-01-authentication.puml` - Xác thực và đăng nhập
- `sequence-02-shop-management.puml` - Quản lý shop/sản phẩm
- `sequence-03-user-management.puml` - Quản lý người dùng
- `sequence-04-payment.puml` - Thanh toán VNPay
- `sequence-05-community.puml` - Tương tác và cộng đồng
- `sequence-06-ai-chat.puml` - AI Chat / Shop Chat
- `sequence-07-statistics.puml` - Thống kê và báo cáo
- `sequence-08-notifications.puml` - Thông báo
- `sequence-09-contact-support.puml` - Liên hệ và hỗ trợ
- `sequence-10-search-filter.puml` - Tìm kiếm và lọc
- `sequence-11-responsive-ux.puml` - Responsive & UX
- `sequence-12-security.puml` - Bảo mật
- `sequence-13-performance.puml` - Hiệu năng
- `sequence-14-file-management.puml` - Quản lý file
- `sequence-15-interface.puml` - Giao diện
- `sequence-16-additional-features.puml` - Tính năng bổ sung

## 🔧 Cách xem Diagrams

### 1. Sử dụng PlantUML Online
1. Truy cập: https://www.plantuml.com/plantuml/uml/
2. Copy nội dung file `.puml`
3. Paste vào editor
4. Xem diagram tự động render

### 2. Sử dụng VS Code Extension
1. Cài đặt extension "PlantUML" trong VS Code
2. Mở file `.puml`
3. Nhấn `Alt + D` để preview diagram

### 3. Sử dụng PlantUML Server
1. Cài đặt PlantUML locally
2. Chạy lệnh: `java -jar plantuml.jar *.puml`
3. Diagrams sẽ được generate thành file PNG/SVG

### 4. Sử dụng IntelliJ IDEA
1. Cài đặt plugin "PlantUML integration"
2. Mở file `.puml`
3. Click chuột phải → "Preview PlantUML"

## 📋 Mô tả từng Diagram

### 1. Authentication (Xác thực)
- **Activity**: Luồng đăng ký, đăng nhập, OAuth
- **Sequence**: Tương tác giữa Client, API, Database, Email Service

### 2. Shop Management (Quản lý Shop)
- **Activity**: Duyệt sản phẩm, tạo/sửa sản phẩm, quản lý items
- **Sequence**: Tương tác với Product API, Database, Cloudinary

### 3. User Management (Quản lý Người dùng)
- **Activity**: Quản lý profile, quản lý sellers/customers (Admin)
- **Sequence**: Tương tác với User API, Database

### 4. Payment (Thanh toán)
- **Activity**: Checkout, thanh toán VNPay, xác nhận đơn hàng
- **Sequence**: Tương tác với Payment API, VNPay, Database

### 5. Community (Cộng đồng)
- **Activity**: Tạo discussion, reply, review sản phẩm
- **Sequence**: Tương tác với Community API, Database

### 6. AI Chat (Chat AI)
- **Activity**: Tạo chat, gửi tin nhắn, quản lý chat
- **Sequence**: Tương tác với Chat API, AI Service, Rate Limiter

### 7. Statistics (Thống kê)
- **Activity**: Xem thống kê theo role (Admin/Seller/Customer)
- **Sequence**: Tương tác với Analytics API, Database, Redis Cache

### 8. Notifications (Thông báo)
- **Activity**: Tạo, xem, đánh dấu đã đọc, xóa thông báo
- **Sequence**: Tương tác với Notification API, WebSocket, Database

### 9. Contact & Support (Liên hệ & Hỗ trợ)
- **Activity**: Gửi tin nhắn liên hệ, Admin phản hồi
- **Sequence**: Tương tác với Contact API, Email Service, Database

### 10. Search & Filter (Tìm kiếm & Lọc)
- **Activity**: Tìm kiếm, lọc, phân trang sản phẩm
- **Sequence**: Tương tác với Product API, Database, Redis Cache

### 11. Responsive & UX
- **Activity**: Phát hiện device, load layout, xử lý lỗi
- **Sequence**: Tương tác giữa Client và Device Detection

### 12. Security (Bảo mật)
- **Activity**: Xác thực token, rate limiting, validation
- **Sequence**: Tương tác với Auth Middleware, Rate Limiter, Validator

### 13. Performance (Hiệu năng)
- **Activity**: Cache, lazy loading, code splitting
- **Sequence**: Tương tác với Redis Cache, Database

### 14. File Management (Quản lý File)
- **Activity**: Upload file, xử lý image/video
- **Sequence**: Tương tác với File API, Cloudinary, Validator

### 15. Interface (Giao diện)
- **Activity**: Load UI, toggle theme, component interaction
- **Sequence**: Tương tác với Theme Manager, Component Library

### 16. Additional Features (Tính năng bổ sung)
- **Activity**: Wishlist, reports, pages (About/Community/Contact)
- **Sequence**: Tương tác với Feature API, Database

## 📝 Lưu ý

- Tất cả diagrams sử dụng định dạng PlantUML cơ bản, không màu sắc
- Diagrams được thiết kế để dễ đọc và hiểu
- Có thể chỉnh sửa các file `.puml` để phù hợp với nhu cầu
- Diagrams mô tả luồng chính, có thể có các luồng phụ khác trong thực tế

## 🔄 Cập nhật

Khi hệ thống có thay đổi, cần cập nhật các diagrams tương ứng để đảm bảo tính chính xác.

---

*Tài liệu này được tạo tự động dựa trên codebase hiện tại.*

