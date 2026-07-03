# Hướng dẫn chạy TutorTrek — Online Course Marketplace

Tài liệu này hướng dẫn chạy dự án **E_Learning_Full** (TutorTrek) trên máy local (Windows), phù hợp với báo cáo *Design and Implementation of an Online Course Marketplace*.

---

## 1. Mức đồng bộ với báo cáo

Dự án đã **tương đối khớp** với báo cáo về chức năng và kiến trúc chính:

| Hạng mục | Báo cáo | Dự án thực tế |
|----------|---------|----------------|
| Vai trò | Admin / Instructor / Student | Có đủ 3 vai trò |
| Frontend | React 18, TypeScript, Tailwind, Redux | Có (CRA + Redux Toolkit + **RTK Query**) |
| Backend | Node.js, Express, TypeScript, Clean Architecture | Có |
| Database | MongoDB + Redis cache | Có |
| Auth | JWT + refresh token, Google OAuth | Có |
| Thanh toán | VNPay | Có |
| AI Chat | GPT-4o mini | Có (cần API key hợp lệ) |
| Quiz, Discussion, Course, Lesson | Có | Có |
| Swagger API docs | Có | `http://localhost:4000/api/docs` |
| class-validator | Có | Có (thay Joi) |
| Forgot / Reset password | Có | Có |
| Collections ERD mở rộng | enrollments, achievements, bookmarks, payouts, admin_earnings | Có model tương ứng |
| Unit / Integration test | Có | `npm test` trong `server/` |
| Docker | Có | `docker-compose.yml` |

**Khác biệt nhỏ so với báo cáo (chấp nhận được khi bảo vệ):**

- Build tool frontend: báo cáo ghi **Vite** → code dùng **Create React App** (`react-scripts`).
- API path: không có prefix `/api/v1` (dùng `/api/...` trực tiếp).
- Một số module báo cáo (reviews riêng, password reset email cần cấu hình SMTP) phụ thuộc cấu hình `.env`.

---

## 2. Yêu cầu hệ thống

Cài sẵn trên máy:

| Phần mềm | Phiên bản gợi ý |
|----------|------------------|
| Node.js | ≥ 18 |
| npm | đi kèm Node |
| Yarn | 4.x (client dùng Yarn PnP) |
| MongoDB | chạy service/port `27017` |
| Redis | chạy service/port `6379` |

**Kiểm tra nhanh:**

```powershell
node -v
npm -v
yarn -v
```

Đảm bảo MongoDB và Redis đang chạy (Windows Services hoặc tự khởi động).

---

## 3. Cấu trúc thư mục

```
E_Learning_Full/
├── client/          # React frontend (port 3000)
├── server/          # Express backend (port 4000)
├── docker-compose.yml
└── HUONG_DAN_CHAY.md
```

---

## 4. Cài đặt lần đầu

### 4.1. Backend

```powershell
cd d:\E_Learning_Full\server
npm install
```

### 4.2. Frontend

```powershell
cd d:\E_Learning_Full\client
yarn install
```

### 4.3. File môi trường

**`server/.env`** — tối thiểu cần có:

```env
DATABASE=mongodb://localhost:27017
DB_NAME=TutorTrek
PORT=4000
NODE_ENV=development
ORIGIN_PORT=http://localhost:3000
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# AWS S3 (upload ảnh/video khóa học)
AWS_ACCESS_KEY=...
AWS_SECRET_KEY=...
AWS_BUCKET_REGION=ap-southeast-1
AWS_BUCKET_NAME=...

# Email (forgot password)
EMAIL_USERNAME=...
EMAIL_PASSWORD=...
FROM_EMAIL=...

# Tùy chọn
OPENAI_API_KEY=...          # AI Chat
GOOGLE_CLIENT_ID=...        # Đăng nhập Google
VNPAY_TMN_CODE=...          # Thanh toán VNPay
VNPAY_HASH_SECRET=...
```

**`client/.env`:**

```env
REACT_APP_API_BASE_URL=http://localhost:4000
REACT_APP_REDIRECT_URI=http://localhost:3000
TSC_COMPILE_ON_ERROR=true
DISABLE_ESLINT_PLUGIN=true
```

### 4.4. Seed dữ liệu mẫu (khuyến nghị)

```powershell
cd d:\E_Learning_Full\server
npm run seed
```

Tạo admin, instructor, student, categories, 5 khóa học mẫu. **Cần AWS S3 hợp lệ** trong `server/.env`.

---

## 5. Chạy ứng dụng (development)

Mở **2 terminal** riêng:

### Terminal 1 — Server (bắt buộc dùng npm)

```powershell
cd d:\E_Learning_Full\server
npm run dev
```

Chờ dòng: **`Server listening on Port 4000`**

### Terminal 2 — Client (bắt buộc dùng yarn)

```powershell
cd d:\E_Learning_Full\client
yarn start
```

Trình duyệt mở: **http://localhost:3000**

> **Lưu ý:** Không dùng `yarn run dev` cho server (dễ lỗi TypeScript/Multer). Không dùng `npm start` cho client (project dùng Yarn PnP).

---

## 6. Tài khoản đăng nhập (sau seed)

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | `admin@tutortrek.com` | `Admin@123456` |
| Instructor | `instructor1@tutortrek.com` | `Instructor@123` |
| Student | `student1@tutortrek.com` | `Student@123` |

**URL đăng nhập:**

| Vai trò | Đường dẫn |
|---------|-----------|
| Student | http://localhost:3000/login |
| Instructor | http://localhost:3000/instructors/login |
| Admin | http://localhost:3000/admin |

---

## 7. URL hữu ích khi chạy local

| Mục đích | URL |
|----------|-----|
| Trang chủ | http://localhost:3000 |
| Danh sách khóa học | http://localhost:3000/courses |
| Swagger API | http://localhost:4000/api/docs |
| Health check | http://localhost:4000/api/health |
| Metrics | http://localhost:4000/api/metrics |
| Quên mật khẩu | http://localhost:3000/forgot-password |

---

## 8. Kiểm tra nhanh sau khi chạy

```powershell
# Health server
Invoke-WebRequest http://localhost:4000/api/health -UseBasicParsing

# Test backend (trong thư mục server)
cd d:\E_Learning_Full\server
npm test
```

---

## 9. Xử lý lỗi thường gặp

### `EADDRINUSE` — port 4000 đã bị chiếm

Chỉ chạy **một** instance server. Giải phóng port:

```powershell
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue |
  ForEach-Object { taskkill /PID $_.OwningProcess /F }
```

Sau đó chạy lại `npm run dev`.

### Trang student không có khóa học / dữ liệu cũ

Xóa cache Redis và seed lại:

```powershell
cd d:\E_Learning_Full\server
npm run seed
```

### Client không start bằng `npm start`

Dùng **`yarn start`** trong thư mục `client/`.

### Instructor dashboard báo lỗi

Đảm bảo server đã restart sau khi cập nhật code. Đăng nhập lại bằng tài khoản instructor.

### AI Chat không trả lời

Kiểm tra `OPENAI_API_KEY` trong `server/.env` (quota/billing OpenAI).

### Upload ảnh/video lỗi

Kiểm tra cấu hình **AWS S3** trong `server/.env`.

### Forgot password không gửi email

Cấu hình `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `FROM_EMAIL` (Gmail App Password).

---

## 10. Chạy bằng Docker (tùy chọn)

```powershell
cd d:\E_Learning_Full
docker-compose up --build
```

Cần file `.env` đầy đủ cho `server/` và `client/`. Phù hợp triển khai gần production hơn là dev hàng ngày.

---

## 11. Quy trình làm việc hàng ngày

1. Bật **MongoDB** + **Redis**
2. `cd server` → `npm run dev`
3. `cd client` → `yarn start`
4. Mở http://localhost:3000
5. Khi sửa code backend, nodemon tự reload; frontend tự hot-reload

---

## 12. Tóm tắt lệnh

```powershell
# Cài đặt (lần đầu)
cd d:\E_Learning_Full\server && npm install
cd d:\E_Learning_Full\client && yarn install
cd d:\E_Learning_Full\server && npm run seed

# Chạy hàng ngày
cd d:\E_Learning_Full\server && npm run dev
cd d:\E_Learning_Full\client && yarn start

# Test backend
cd d:\E_Learning_Full\server && npm test
```

---

*Báo cáo: Design and Implementation of an Online Course Marketplace — Trần Đức Mạnh (21070858)*
