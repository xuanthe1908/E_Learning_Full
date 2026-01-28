# 🔍 Kiểm tra Backend đang chạy

## Cách kiểm tra:

### 1. Kiểm tra Backend Server
Mở terminal và chạy:
```bash
cd server
npm run dev
```

Bạn sẽ thấy:
```
✅ Server is running on port 4000
✅ Database connected successfully
```

### 2. Test API trực tiếp trong Browser
Mở browser và truy cập:
```
http://localhost:4000/api/products/list
```

Nếu thấy JSON data → Backend đang chạy ✅

### 3. Test Login API với Postman hoặc Browser DevTools

**Trong Browser DevTools (F12) → Console:**
```javascript
fetch('http://localhost:4000/api/auth/student-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'nguyenthihoa@customer.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error('Error:', err));
```

**Kết quả mong đợi:**
```json
{
  "status": "success",
  "message": "User logged in successfully",
  "accessToken": "...",
  "refreshToken": "..."
}
```

### 4. Kiểm tra Routes đã được đăng ký

File `server/src/frameworks/webserver/routes/index.ts` phải có:
```typescript
app.use('/api/auth', authRouter());
```

File `server/src/frameworks/webserver/routes/auth.ts` phải có:
```typescript
router.post("/student-login", controller.loginStudent);
```

### 5. Lỗi thường gặp:

#### 404 Not Found
- **Nguyên nhân**: Backend chưa chạy hoặc route chưa được đăng ký
- **Giải pháp**: 
  1. Kiểm tra backend có đang chạy không
  2. Kiểm tra routes trong `index.ts`
  3. Restart backend server

#### 500 Internal Server Error
- **Nguyên nhân**: Lỗi trong controller hoặc database
- **Giải pháp**: Kiểm tra server logs để xem chi tiết lỗi

#### Connection Refused
- **Nguyên nhân**: Backend chưa khởi động
- **Giải pháp**: Chạy `npm run dev` trong thư mục `server`

---

**Lưu ý**: Đảm bảo backend đang chạy trước khi test frontend!

