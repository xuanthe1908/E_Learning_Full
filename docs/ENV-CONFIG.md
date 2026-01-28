# ⚙️ Cấu hình Environment Variables (.env)

## 📋 File `.env` trong `server/`

File `.env` cần có các biến sau:

### 🔑 Database (Bắt buộc)
```env
# MongoDB Connection String
DATABASE=mongodb://localhost:27017/TutorTrek
# Hoặc MongoDB Atlas
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/TutorTrek

# Hoặc sử dụng DB_CLUSTER_URL (ưu tiên hơn DATABASE nếu có)
DB_CLUSTER_URL=mongodb://localhost:27017/TutorTrek
DB_NAME=TutorTrek
```

### 🔐 JWT Secrets (Bắt buộc)
```env
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-min-32-chars
```

### 🌐 Server Config
```env
PORT=4000
NODE_ENV=development
ORIGIN_PORT=http://localhost:3000
```

### 🔵 Google OAuth (Tùy chọn)
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 📧 Email (Tùy chọn)
```env
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
```

### ☁️ AWS S3 (Tùy chọn)
```env
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
AWS_BUCKET_REGION=ap-southeast-2
AWS_BUCKET_NAME=your-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
CLOUDFRONT_DOMAIN_NAME=your-cloudfront-domain
```

### 💳 VNPay (Tùy chọn)
```env
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/return
```

### 🤖 AI Chat (Tùy chọn)
```env
OPENAI_API_KEY=your-openai-api-key
AI_MODEL=gpt-3.5-turbo
```

### 🔴 Redis (Tùy chọn, có fallback)
```env
REDIS_URL=redis://localhost:6379
```

---

## 📋 File `.env` trong `client/`

```env
REACT_APP_API_BASE_URL=http://localhost:4000
REACT_APP_CLIENT_ID=your-google-client-id
REACT_APP_REDIRECT_URI=http://localhost:3000
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

---

## ✅ Kiểm tra cấu hình

### 1. Kiểm tra Database Connection
Khi chạy `npm run dev` trong `server/`, bạn sẽ thấy:
```
✅ Database connected successfully
```

Nếu thấy lỗi:
```
❌ Database URL is missing in environment variables
```
→ Kiểm tra file `.env` có biến `DATABASE` hoặc `DB_CLUSTER_URL` không

### 2. Format MongoDB Connection String

**Local MongoDB:**
```env
DATABASE=mongodb://localhost:27017/TutorTrek
```

**MongoDB Atlas:**
```env
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/TutorTrek?retryWrites=true&w=majority
```

**Với Authentication:**
```env
DATABASE=mongodb://username:password@localhost:27017/TutorTrek?authSource=admin
```

### 3. Test Connection

Chạy seed script để test:
```bash
cd server
npx ts-node src/scripts/seedAllData.ts --delete-old
```

Nếu kết nối thành công, bạn sẽ thấy:
```
✅ Đã kết nối database thành công
```

---

## 🔧 Troubleshooting

### Lỗi: "DATABASE environment variable is not set"
- Kiểm tra file `.env` có tồn tại trong thư mục `server/` không
- Kiểm tra tên biến có đúng `DATABASE` hoặc `DB_CLUSTER_URL` không
- Đảm bảo không có khoảng trắng thừa: `DATABASE = ...` (sai) → `DATABASE=...` (đúng)

### Lỗi: "Database connection error"
- Kiểm tra MongoDB đang chạy (local) hoặc connection string đúng (Atlas)
- Kiểm tra username/password có đúng không
- Kiểm tra network/firewall có chặn kết nối không

### Lỗi: "Authentication failed"
- Kiểm tra username/password trong connection string
- Với MongoDB Atlas: Đảm bảo IP đã được whitelist

---

## 📝 Template .env mẫu

Tạo file `server/.env.example`:
```env
# Database
DATABASE=mongodb://localhost:27017/TutorTrek
DB_NAME=TutorTrek

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters-long

# Server
PORT=4000
NODE_ENV=development
ORIGIN_PORT=http://localhost:3000

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

---

**Lưu ý**: 
- Không commit file `.env` vào Git (đã có trong `.gitignore`)
- Sử dụng `.env.example` làm template
- Giữ bí mật các keys và secrets

