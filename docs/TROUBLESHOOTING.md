# 🔧 Troubleshooting Guide

## Lỗi "Something went wrong" khi load sản phẩm

### Nguyên nhân có thể:
1. **Backend chưa chạy**
2. **Chưa seed data vào database**
3. **API endpoint không khớp**
4. **Database chưa kết nối**

### Cách khắc phục:

#### Bước 1: Kiểm tra Backend đang chạy
```bash
cd server
npm run dev
```

Kiểm tra console xem có thông báo:
```
✅ Server is running on port 4000
✅ Database connected successfully
```

#### Bước 2: Seed Data vào Database
```bash
cd server
npx ts-node src/scripts/seedAllData.ts --delete-old
```

Kết quả mong đợi:
```
✅ Đã kết nối database thành công
✅ Đã thêm X danh mục
✅ Đã thêm X sellers
✅ Đã thêm X customers
✅ Đã thêm X sản phẩm
✅ Đã thêm X payments mẫu
```

#### Bước 3: Kiểm tra API Endpoint
Mở browser và truy cập:
```
http://localhost:4000/api/products/list
```

Kết quả mong đợi:
```json
{
  "status": "success",
  "message": "Successfully retrieved all courses",
  "data": [...]
}
```

#### Bước 4: Kiểm tra Frontend Config
Đảm bảo file `.env` trong `client/` có:
```
REACT_APP_API_BASE_URL=http://localhost:4000
```

#### Bước 5: Restart Frontend
```bash
cd client
npm start
```

### Kiểm tra Console Logs

Mở Browser DevTools (F12) và kiểm tra:
1. **Console tab**: Xem có lỗi gì không
2. **Network tab**: 
   - Kiểm tra request `GET /api/products/list`
   - Xem status code (200 = OK, 404 = Not Found, 500 = Server Error)
   - Xem response data

### Lỗi thường gặp:

#### 404 Not Found
- **Nguyên nhân**: API endpoint không đúng hoặc route chưa được đăng ký
- **Giải pháp**: Kiểm tra `server/src/frameworks/webserver/routes/index.ts` và `course.ts`

#### 500 Internal Server Error
- **Nguyên nhân**: Lỗi server (database, validation, etc.)
- **Giải pháp**: Kiểm tra server logs để xem chi tiết lỗi

#### Empty Data Array
- **Nguyên nhân**: Database chưa có data
- **Giải pháp**: Chạy seed script

#### CORS Error
- **Nguyên nhân**: Backend chưa cấu hình CORS
- **Giải pháp**: Kiểm tra CORS middleware trong backend

### Test API trực tiếp

Sử dụng Postman hoặc curl:
```bash
curl http://localhost:4000/api/products/list
```

### Kiểm tra Database

Mở MongoDB Compass và kiểm tra:
- Collection `course` có documents không?
- Collection `categories` có documents không?
- Collection `instructors` có documents không?

---

*Nếu vẫn còn lỗi, hãy kiểm tra console logs và server logs để xem chi tiết lỗi.*

