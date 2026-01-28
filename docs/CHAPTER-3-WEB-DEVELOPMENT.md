# CHAPTER 3: WEB DEVELOPMENT

## 3.1. Development Environment and Tools

### 3.1.1. Hệ điều hành và Runtime

Hệ thống được phát triển trên môi trường:
- **Hệ điều hành**: Windows 10/11, Linux, macOS (cross-platform)
- **Node.js Runtime**: Version 18.x LTS
- **Package Manager**: Yarn 4.9.3 (với lockfile để đảm bảo dependency consistency)

### 3.1.2. Integrated Development Environment (IDE)

- **Visual Studio Code**: IDE chính được sử dụng
  - Extension: PlantUML (để xem UML diagrams)
  - Extension: ESLint, Prettier (code formatting)
  - Extension: TypeScript support
  - Extension: Git integration

### 3.1.3. Version Control

- **Git**: Quản lý phiên bản code
- **GitHub**: Repository hosting và collaboration
- **Branching Strategy**: Feature branches, main branch cho production

### 3.1.4. Testing Tools

- **Postman**: Testing RESTful API endpoints
- **Chrome DevTools**: Debugging frontend, network monitoring
- **React DevTools**: Debugging React components và Redux state
- **MongoDB Compass**: Quản lý và xem database

### 3.1.5. Build Tools

- **Frontend**: React Scripts (Create React App)
- **Backend**: TypeScript Compiler (tsc)
- **Docker**: Containerization cho deployment

---

## 3.2. Frontend Development

### 3.2.1. Frontend Technologies

Hệ thống frontend được xây dựng với các công nghệ hiện đại:

#### Core Framework và Library
- **React 18.2.0**: UI library, component-based architecture
- **TypeScript 4.9.5**: Type safety, better IDE support, refactoring
- **React Router DOM 6.12.1**: Client-side routing, nested routes

#### State Management
- **Redux Toolkit 1.9.5**: Centralized state management
- **Redux Persist 6.0.0**: Persist Redux state to localStorage
- **React Redux 8.0.7**: React bindings cho Redux

#### Styling và UI
- **Tailwind CSS 3.3.2**: Utility-first CSS framework
- **Material Tailwind 2.0.6**: Component library built on Tailwind
- **Lucide React 0.516.0**: Modern icon library
- **React Icons 4.9.0**: Additional icon sets

#### Form Handling và Validation
- **Formik 2.4.1**: Form state management
- **Yup 1.2.0**: Schema validation cho forms

#### HTTP Client
- **Axios 1.4.0**: Promise-based HTTP client cho API calls

#### UI Components và Utilities
- **React Toastify 9.1.3**: Toast notifications
- **React Modal 3.16.1**: Modal dialogs
- **React Select 5.7.3**: Select dropdown components
- **React Spinners 0.13.8**: Loading indicators
- **ApexCharts 3.41.0**: Charts và graphs cho statistics

#### Authentication
- **@react-oauth/google 0.11.0**: Google OAuth integration
- **jwt-decode 3.1.2**: Decode JWT tokens

#### Media Handling
- **Video.js 8.3.0**: Video player
- **React PDF 7.2.0**: PDF viewer
- **QRCode React 4.2.0**: QR code generation

#### Real-time Communication
- **Socket.io Client 4.7.1**: WebSocket client cho real-time features

### 3.2.2. Frontend Architecture

Hệ thống frontend được tổ chức theo **Component-Based Architecture** với cấu trúc thư mục rõ ràng:

```
client/src/
├── components/          # Reusable components
│   ├── common/         # Common UI components (buttons, modals, etc.)
│   ├── partials/       # Layout components (header, footer)
│   ├── pages/          # Page components
│   │   ├── shop/       # Shop-related pages
│   │   ├── cart/       # Cart pages
│   │   ├── checkout/   # Checkout pages
│   │   ├── admin/      # Admin pages
│   │   ├── instructors/# Instructor/Seller pages
│   │   └── student-dash/# Customer dashboard
│   └── shop/           # Shop-specific components (AI Chat widget)
├── hooks/              # Custom React hooks
├── api/                # API integration layer
│   ├── endpoints/      # API endpoint functions
│   ├── services/       # Service layer
│   └── interceptors/   # Axios interceptors
├── redux/              # Redux store và slices
│   ├── store.ts        # Store configuration
│   └── reducers/       # Redux slices (auth, products, etc.)
├── routes.tsx          # Route configuration
├── config.ts           # Configuration constants
├── utils/              # Utility functions
└── App.tsx             # Root component
```

#### Component Organization

**1. Common Components**
- Reusable UI components: buttons, inputs, modals, error elements
- Layout components: headers, footers, sidebars
- Shared logic components: loading states, error boundaries

**2. Page Components**
- Mỗi route tương ứng với một page component
- Pages được lazy-loaded để tối ưu performance
- Pages sử dụng common components để đảm bảo consistency

**3. Feature Components**
- Components gắn với specific features (shop chat, product cards, etc.)
- Có thể được reuse trong nhiều pages

#### Routing Architecture

Hệ thống sử dụng **React Router v6** với nested routing:

- **Public Routes**: Home, Shop, Product details, Login, Register
- **Protected Routes**: 
  - Customer routes: Dashboard, My Products, Cart, Checkout
  - Seller routes: Dashboard, Add Product, Manage Products, Analytics
  - Admin routes: User Management, Category Management, Statistics

Routes được lazy-loaded để giảm initial bundle size:

```typescript
const LazyListCourse = lazy(() => import("./components/pages/course-pages/product-list"));
const LazyShopPage = lazy(() => import('./components/pages/shop/ShopPage'));
```

#### State Management Architecture

**Redux Store Structure:**
- **authSlice**: Authentication state, user info, tokens
- **productSlice**: Product list, product details, filters
- **cartSlice**: Cart items, totals
- **studentSlice**: Customer profile, purchase history
- **instructorSlice**: Seller profile, products, statistics
- **helperSlice**: UI state (loading, errors, modals)

**Redux Persist**: Một số state được persist vào localStorage:
- Authentication tokens
- User preferences
- Cart items (temporary)

### 3.2.3. UI & UX Implementation

#### Responsive Design

Hệ thống được thiết kế **mobile-first** với Tailwind CSS:

- **Breakpoints**:
  - Mobile: `< 640px`
  - Tablet: `640px - 1024px`
  - Desktop: `> 1024px`

- **Responsive Components**:
  - Navigation: Hamburger menu trên mobile, full menu trên desktop
  - Product grid: 1 column (mobile), 2-3 columns (tablet), 4 columns (desktop)
  - Forms: Full width trên mobile, centered với max-width trên desktop

#### Loading States

- **Shimmer Effects**: Skeleton loaders cho product cards, lists
- **Spinners**: Loading indicators cho buttons, async operations
- **Lazy Loading**: Images và components load on-demand

#### Error Handling UI

- **Error Boundaries**: Catch React errors, hiển thị fallback UI
- **Toast Notifications**: Hiển thị success/error messages
- **Form Validation**: Real-time validation với error messages
- **404 Pages**: Custom error pages cho routes không tồn tại

#### Accessibility

- **Semantic HTML**: Sử dụng proper HTML tags
- **ARIA Labels**: Cho screen readers
- **Keyboard Navigation**: Tất cả interactive elements có thể navigate bằng keyboard
- **Focus Management**: Proper focus handling trong modals và forms

#### User Experience Features

- **Offline Detection**: Hiển thị message khi mất kết nối
- **Session Expired Modal**: Tự động detect và thông báo khi session hết hạn
- **Breadcrumbs**: Navigation breadcrumbs cho deep pages
- **Smooth Transitions**: CSS transitions cho state changes

---

## 3.3. Backend Development

### 3.3.1. Backend Technologies

Hệ thống backend được xây dựng với **Node.js** và **Express.js**:

#### Core Framework
- **Node.js 18.x**: JavaScript runtime
- **Express.js 4.18.2**: Web framework
- **TypeScript 5.8.3**: Type safety, better code organization

#### Database
- **MongoDB 7.2.2**: NoSQL database (Mongoose ODM)
- **Redis 4.6.7**: In-memory cache cho performance

#### Authentication & Security
- **JSON Web Token (JWT) 9.0.0**: Stateless authentication
- **Bcrypt 5.1.0**: Password hashing
- **Helmet 7.0.0**: Security headers
- **Express Rate Limit 7.1.0**: Rate limiting
- **Express Mongo Sanitize 2.2.0**: Prevent NoSQL injection
- **CORS 2.8.5**: Cross-origin resource sharing

#### Validation
- **Joi 17.13.3**: Schema validation cho request data

#### File Upload
- **Multer 1.4.5**: File upload middleware
- **Multer S3 3.0.1**: Upload trực tiếp lên AWS S3
- **AWS SDK 3.363.0**: AWS services integration (S3, CloudFront)

#### Payment Integration
- **VNPay Integration**: Payment gateway cho thanh toán
- **QRCode 1.5.4**: Generate QR codes cho payment

#### AI Integration
- **OpenAI 4.20.0**: AI chat functionality
- **Google Generative AI 0.24.1**: Alternative AI service

#### Real-time Communication
- **Socket.io 4.7.1**: WebSocket server cho real-time features

#### Email
- **Nodemailer 6.9.3**: Email sending service

#### Utilities
- **Morgan 1.10.0**: HTTP request logger
- **Cookie Parser 1.4.6**: Parse cookies
- **UUID 11.1.0**: Generate unique IDs

### 3.3.2. Backend Architecture

Hệ thống backend được tổ chức theo **Clean Architecture** pattern:

```
server/src/
├── app.ts                 # Application entry point
├── config.ts              # Configuration management
├── entities/              # Domain entities
├── app/
│   ├── repositories/      # Repository interfaces
│   └── usecases/          # Business logic
├── adapters/
│   └── controllers/      # Request handlers
├── frameworks/
│   ├── database/
│   │   ├── mongodb/      # MongoDB implementation
│   │   │   ├── models/   # Mongoose models
│   │   │   ├── repositories/ # Repository implementations
│   │   │   └── connection.ts
│   │   └── redis/         # Redis implementation
│   ├── webserver/
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Express middlewares
│   │   ├── express.ts    # Express configuration
│   │   └── server.ts     # Server setup
│   └── websocket/         # Socket.io configuration
└── utils/                 # Utility functions
```

#### Layer Separation

**1. Entities Layer**
- Domain models và business rules
- Không phụ thuộc vào framework

**2. Use Cases Layer**
- Business logic
- Orchestrates repositories và services

**3. Adapters Layer**
- Controllers: Handle HTTP requests
- Transform requests thành use case calls
- Transform responses thành HTTP responses

**4. Frameworks Layer**
- Database implementations (MongoDB, Redis)
- Web server (Express)
- External services (Cloudinary, VNPay, OpenAI)

#### API Architecture

**RESTful API Design:**
- **Base URL**: `/api`
- **Resource-based URLs**: `/api/shop/products`, `/api/users/profile`
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH
- **Status Codes**: 200, 201, 400, 401, 403, 404, 500

**Route Organization:**
```
/api/auth          # Authentication routes
/api/shop          # Shop/Product routes
/api/admin          # Admin routes (protected)
/api/instructors    # Seller routes (protected)
/api/students       # Customer routes (protected)
/api/payments       # Payment routes (protected)
/api/category       # Category routes
```

#### Middleware Flow

Request flow qua các middlewares:

1. **CORS Middleware**: Handle cross-origin requests
2. **Helmet Middleware**: Security headers
3. **Body Parser**: Parse JSON bodies
4. **Cookie Parser**: Parse cookies
5. **Morgan**: Log requests
6. **Rate Limiter**: Limit request rate
7. **Authentication Middleware**: Verify JWT tokens
8. **Role Check Middleware**: Verify user roles
9. **Route Handler**: Process request
10. **Error Handler**: Catch và format errors

### 3.3.3. Core Functional Implementation

#### Authentication & Authorization

**Registration Flow:**
1. Client gửi registration data
2. Server validate input với Joi
3. Hash password với bcrypt
4. Tạo user trong MongoDB
5. Generate JWT tokens (access + refresh)
6. Gửi verification email (nếu cần)
7. Return tokens cho client

**Login Flow:**
1. Client gửi credentials
2. Server verify password
3. Generate JWT tokens
4. Store refresh token trong database
5. Return tokens

**Token Management:**
- **Access Token**: Short-lived (15 minutes), chứa user info
- **Refresh Token**: Long-lived (7 days), dùng để renew access token
- **Token Refresh**: Client tự động refresh khi access token hết hạn

**OAuth Integration:**
- Google OAuth flow
- Verify Google token
- Create/update user account
- Generate JWT tokens

#### Product Management

**Product CRUD Operations:**
- **Create**: Seller tạo product, upload media (thumbnail, video, PDF)
- **Read**: Public access cho product list, protected cho seller's own products
- **Update**: Seller chỉnh sửa product của mình
- **Delete**: Soft delete hoặc hard delete

**Product Features:**
- Upload files lên AWS S3/Cloudinary
- Generate thumbnails tự động
- Video streaming với signed URLs
- Category và tag management
- Search và filter với MongoDB queries

**Item Management:**
- Items (lessons) thuộc về products
- Upload item media
- Set item order
- Item access control (chỉ customer đã mua mới xem được)

#### Order & Payment (VNPay)

**Cart Management:**
- Add/remove items từ cart
- Cart stored trong Redux (frontend) hoặc database (backend)
- Calculate totals

**Checkout Flow:**
1. Customer review cart
2. Enter shipping information
3. Create order trong database
4. Generate VNPay payment URL/QR code
5. Redirect customer đến VNPay hoặc hiển thị QR
6. VNPay callback khi payment complete
7. Verify payment signature
8. Update order status
9. Grant product access cho customer
10. Send confirmation email

**Payment Verification:**
- Verify VNPay signature
- Check payment status
- Handle success/failure cases
- Process refunds (nếu cần)

#### User Management

**Customer Management:**
- Profile management
- Purchase history
- Wishlist
- Dashboard với statistics

**Seller Management:**
- Seller registration với approval workflow
- Admin approve/reject seller requests
- Seller dashboard với analytics
- Product management
- Customer analytics

**Admin Management:**
- User management (block/unblock)
- Category management
- System statistics
- Payment management
- Contact message handling

#### Notification System

**Real-time Notifications:**
- Socket.io cho real-time updates
- Notification stored trong MongoDB
- Push notifications đến client
- Mark as read functionality

**Notification Types:**
- Order confirmations
- Payment status
- Seller approval/rejection
- System announcements

#### AI Chat Integration

**Chat Functionality:**
- Create chat sessions
- Send messages đến AI service (OpenAI/Google AI)
- Store chat history trong MongoDB
- Auto-generate chat titles
- Rate limiting (20 messages/minute)

**AI Service Integration:**
- OpenAI API integration
- Google Generative AI integration
- Context-aware responses
- Error handling và fallbacks

---

## 3.4. Database Design and Implementation

### 3.4.1. Database Management System

Hệ thống sử dụng **MongoDB** - NoSQL document database:

- **Flexible Schema**: Dễ dàng thay đổi structure
- **Horizontal Scaling**: Có thể scale out
- **Document-based**: Lưu trữ data dạng JSON-like documents
- **Mongoose ODM**: Object-Document Mapping cho TypeScript

### 3.4.2. Database Schema Design

#### User Collection
```typescript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer/seller/admin),
  profile: {
    avatar: String,
    bio: String,
    phone: String
  },
  isBlocked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Product Collection
```typescript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  video: String,
  pdf: String,
  category: ObjectId (ref: Category),
  seller: ObjectId (ref: User),
  items: [{
    title: String,
    video: String,
    order: Number
  }],
  rating: Number,
  reviews: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Collection
```typescript
{
  _id: ObjectId,
  customer: ObjectId (ref: User),
  products: [{
    product: ObjectId (ref: Product),
    price: Number
  }],
  total: Number,
  status: String (pending/paid/failed),
  paymentId: String,
  createdAt: Date
}
```

#### Category Collection
```typescript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  createdAt: Date
}
```

### 3.4.3. Database Relationships

**One-to-Many:**
- User (Seller) → Products
- Product → Items
- User (Customer) → Orders
- Category → Products

**Many-to-Many:**
- Products ↔ Categories (có thể có nhiều categories)

### 3.4.4. Indexing Strategy

**Indexes được tạo cho:**
- `email` trong User collection (unique index)
- `seller` trong Product collection
- `category` trong Product collection
- `customer` trong Order collection
- `createdAt` cho sorting

### 3.4.5. Data Validation

- **Mongoose Schema Validation**: Validate data types, required fields
- **Custom Validators**: Business rule validation
- **Pre-save Hooks**: Auto-generate fields, hash passwords

---

## 3.5. File & Media Handling

### 3.5.1. File Upload Strategy

Hệ thống sử dụng **AWS S3** và **CloudFront** cho file storage:

**Upload Flow:**
1. Client upload file qua Multer middleware
2. Validate file type và size
3. Upload lên S3 bucket
4. Generate CloudFront signed URL
5. Store URL trong database
6. Return URL cho client

### 3.5.2. Image Handling

- **Thumbnail Generation**: Tự động generate thumbnails khi upload
- **Image Optimization**: Compress images để giảm size
- **Multiple Sizes**: Generate nhiều sizes cho responsive images

### 3.5.3. Video Handling

- **Video Upload**: Upload video lên S3
- **Video Streaming**: Sử dụng CloudFront signed URLs
- **Video Processing**: FFmpeg cho video processing (nếu cần)
- **Progressive Loading**: Video load progressively

### 3.5.4. PDF Handling

- **PDF Upload**: Store PDFs trên S3
- **PDF Viewer**: React PDF component để view PDFs
- **PDF Preview**: Generate preview images

---

## 3.6. Security Implementation

### 3.6.1. Authentication Security

**JWT Implementation:**
- Access tokens: Short-lived (15 minutes)
- Refresh tokens: Long-lived (7 days), stored in database
- Token rotation: Refresh tokens được rotate khi sử dụng

**Password Security:**
- Bcrypt hashing với salt rounds 10
- Password không bao giờ được log hoặc return trong responses

### 3.6.2. API Security

**Rate Limiting:**
- General API: 100 requests/15 minutes
- Authentication endpoints: 5 requests/15 minutes
- AI Chat: 20 messages/minute
- Payment endpoints: 10 requests/15 minutes

**Input Validation:**
- Joi schema validation cho tất cả inputs
- Sanitize inputs để prevent XSS
- MongoDB sanitization để prevent NoSQL injection

**SQL/NoSQL Injection Prevention:**
- Mongoose parameterized queries
- Express Mongo Sanitize middleware
- Input validation và sanitization

### 3.6.3. CORS & Security Headers

**CORS Configuration:**
- Allow specific origins
- Credentials: true cho authenticated requests
- Preflight handling

**Security Headers (Helmet):**
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

### 3.6.4. Role-Based Access Control

**Middleware Chain:**
1. JWT Authentication Middleware
2. Role Check Middleware
3. Resource Ownership Check (nếu cần)

**Role Permissions:**
- **Customer**: Read products, create orders, manage own profile
- **Seller**: Manage own products, view analytics, manage profile
- **Admin**: Full system access

---

## 3.7. Performance Optimization

### 3.7.1. Caching Strategy

**Redis Caching:**
- Product lists: Cache popular products
- User sessions: Cache user data
- Statistics: Cache dashboard statistics
- Cache TTL: 15-60 minutes tùy data type

**Cache Invalidation:**
- Invalidate khi data thay đổi
- TTL-based expiration
- Manual cache clear khi cần

### 3.7.2. Frontend Optimization

**Code Splitting:**
- Route-based code splitting
- Lazy loading components
- Dynamic imports

**Image Optimization:**
- Lazy loading images
- Responsive images với srcset
- Image compression

**Bundle Optimization:**
- Tree shaking
- Minification
- Gzip compression

### 3.7.3. Backend Optimization

**Database Optimization:**
- Indexes trên frequently queried fields
- Pagination cho large datasets
- Aggregation pipelines cho complex queries

**API Optimization:**
- Response compression
- Field selection (chỉ return fields cần thiết)
- Batch operations khi có thể

### 3.7.4. CDN và Static Assets

**CloudFront CDN:**
- Serve static assets (images, videos)
- Global distribution
- Signed URLs cho protected content

---

## 3.8. Deployment and Testing

### 3.8.1. Deployment

**Backend Deployment:**
- **Platform**: Node.js server (VPS, AWS EC2, hoặc cloud platform)
- **Process Manager**: PM2 hoặc systemd
- **Environment Variables**: Stored trong .env file
- **Docker**: Containerization với Dockerfile
- **Port**: 4000 (configurable)

**Frontend Deployment:**
- **Platform**: Static hosting (Vercel, Netlify, AWS S3 + CloudFront)
- **Build Process**: `npm run build` tạo production build
- **Environment Variables**: Build-time variables
- **Port**: 3000 (development), static files (production)

**Database Deployment:**
- **MongoDB**: MongoDB Atlas (cloud) hoặc self-hosted
- **Redis**: Redis Cloud hoặc self-hosted

**Environment Configuration:**
- Development: Local development với hot reload
- Production: Optimized builds, error logging, monitoring

### 3.8.2. Testing

**API Testing:**
- Postman collections cho manual testing
- Test các endpoints: authentication, CRUD operations, payment flow

**Manual Testing:**
- User flows: Registration, login, product browsing, checkout
- Role-based testing: Customer, Seller, Admin workflows
- Cross-browser testing: Chrome, Firefox, Safari, Edge
- Mobile testing: Responsive design trên mobile devices

**Error Handling Testing:**
- Invalid inputs
- Network errors
- Authentication failures
- Permission errors

---

## 3.9. Chapter Summary

### 3.9.1. Implementation Summary

Hệ thống Shop Platform đã được triển khai thành công với:

✅ **Frontend**: React + TypeScript, Redux, Tailwind CSS, responsive design
✅ **Backend**: Node.js + Express + TypeScript, Clean Architecture
✅ **Database**: MongoDB với Mongoose, Redis caching
✅ **Security**: JWT authentication, rate limiting, input validation
✅ **Payment**: VNPay integration hoàn chỉnh
✅ **AI Chat**: OpenAI/Google AI integration
✅ **File Management**: AWS S3 + CloudFront
✅ **Real-time**: Socket.io cho notifications

### 3.9.2. Alignment với Chapter 2

Tất cả các tính năng được thiết kế trong Chapter 2 đã được triển khai:

- ✅ Authentication & Authorization (3.3.3)
- ✅ Shop/Product Management (3.3.3)
- ✅ User Management (3.3.3)
- ✅ Payment Integration (3.3.3)
- ✅ Community Features (3.3.3)
- ✅ AI Chat (3.3.3)
- ✅ Statistics & Reports (3.3.3)
- ✅ Notifications (3.3.3)
- ✅ Security Measures (3.6)
- ✅ Performance Optimization (3.7)

### 3.9.3. Technical Achievements

- **Clean Architecture**: Code được tổ chức rõ ràng, dễ maintain
- **Type Safety**: TypeScript đảm bảo type safety
- **Scalability**: Architecture hỗ trợ horizontal scaling
- **Security**: Multiple layers of security
- **Performance**: Caching, optimization, CDN
- **User Experience**: Responsive, accessible, smooth interactions

### 3.9.4. Future Enhancements

Hệ thống sẵn sàng cho các mở rộng:
- Mobile app (React Native)
- Advanced analytics
- Multi-language support
- Enhanced AI features
- Real-time collaboration features

---

**Kết luận**: Chapter 3 đã mô tả chi tiết quá trình triển khai hệ thống từ thiết kế (Chapter 2) thành một ứng dụng web hoàn chỉnh, sẵn sàng cho production và đánh giá.

