/**
 * API endpoints - must match backend routes in server/src/frameworks/webserver/routes/
 * Backend mounts: /api/auth, /api/admin, /api/category, /api/products, /api/sellers, /api/customers, /api/shop/chat, /api/payments, /api/video-streaming
 */
const END_POINTS = {
  // ========== AUTHENTICATION ==========
  LOGIN_STUDENT: 'api/auth/student-login',
  REGISTER_STUDENT: 'api/auth/student-register',
  GOOGLE_LOGIN_STUDENT: 'api/auth/login-with-google',
  REGISTER_INSTRUCTOR: 'api/auth/instructor/instructor-register',
  LOGIN_INSTRUCTOR: 'api/auth/instructor/instructor-login',
  LOGIN_ADMIN: 'api/auth/admin/admin-login',
  REFRESH_TOKEN: 'api/all/refresh-token/refresh',

  // ========== SELLERS (instructor router mounted at /api/sellers) ==========
  GET_INSTRUCTOR_REQUESTS: 'api/sellers/view-instructor-requests',
  GET_INSTRUCTOR: 'api/sellers/view-instructor',
  ACCEPT_INSTRUCTOR_REQUESTS: 'api/sellers/accept-instructor-request',
  REJECT_INSTRUCTOR_REQUESTS: 'api/sellers/reject-instructor-request',
  GET_INSTRUCTORS: 'api/sellers/get-all-instructors',
  BLOCK_INSTRUCTORS: 'api/sellers/get-all-instructors/block-instructors',
  UNBLOCK_INSTRUCTORS: 'api/sellers/get-all-instructors/unblock-instructors',
  GET_BLOCKED_INSTRUCTORS: 'api/sellers/get-blocked-instructors',
  GET_INSTRUCTOR_DETAILS: 'api/sellers/get-instructor-details',
  INSTRUCTOR_UPDATE_PROFILE: 'api/sellers/update-profile',
  INSTRUCTOR_CHANGE_PASSWORD: 'api/sellers/change-password',
  GET_MY_STUDENTS: 'api/sellers/get-students-by-instructor',

  // ========== CUSTOMERS (student router mounted at /api/customers) ==========
  GET_ALL_STUDENTS: 'api/customers/get-all-students',
  BLOCK_STUDENT: 'api/customers/block-student',
  UNBLOCK_STUDENT: 'api/customers/unblock-student',
  GET_BLOCKED_STUDENTS: 'api/customers/get-all-blocked-students',
  GET_STUDENT_DETAILS: 'api/customers/get-student-details',
  UPDATE_PROFILE: 'api/customers/update-profile',
  CHANGE_PASSWORD: 'api/customers/change-password',
  CONTACT_US: 'api/customers/contact-us',

  // ========== PRODUCTS (course router mounted at /api/products) ==========
  ADD_COURSE: 'api/products/sellers/add-product',
  EDIT_COURSE: 'api/products/sellers/edit-product',
  GET_ALL_COURSES: 'api/products/list',
  GET_COURSE: 'api/products',
  GET_COURSES_BY_INSTRUCTORS: 'api/products/sellers/my-products',
  GET_COURSE_BY_STUDENT: 'api/products/customers/my-products',
  GET_RECOMMENDED_COURSES: 'api/products/recommended',
  GET_TRENDING_COURSES: 'api/products/trending',
  SEARCH_COURSE: 'api/products/search',
  ENROLL_STUDENT: 'api/products/purchase',

  // ========== ITEMS / LESSONS (under /api/products) ==========
  GET_LESSONS_BY_COURSE: 'api/products/sellers/get-items-by-product',
  ADD_LESSON: 'api/products/sellers/add-item',
  EDIT_LESSON: 'api/products/sellers/edit-item',
  GET_LESSONS_BY_ID: 'api/products/items',

  // ========== QUIZZES (under /api/products/items) ==========
  GET_QUIZZES_BY_LESSON: 'api/products/items',

  // ========== DISCUSSIONS (under /api/products/items) ==========
  ADD_DISCUSSION: 'api/products/items/add-discussion',
  GET_DISCUSSIONS_BY_LESSON: 'api/products/items/get-discussions-by-item',
  EDIT_DISCUSSION: 'api/products/items/edit-discussion',
  DELETE_DISCUSSION: 'api/products/items/delete-discussion',
  REPLY_TO_DISCUSSION: 'api/products/items/reply-discussion',
  GET_REPLIES_BY_DISCUSSION: 'api/products/items/replies-based-on-discussion',

  // ========== VIDEO STREAMING ==========
  STREAM_VIDEO: 'api/video-streaming/stream-video',

  // ========== PAYMENTS ==========
  PAY_USING_VNPAY_QR: 'api/payments/vnpay/create-qr-payment',
  PAY_USING_VNPAY_URL: 'api/payments/vnpay/create-payment-url',
  CHECK_VNPAY_STATUS: 'api/payments/vnpay/status',
  CANCEL_VNPAY_PAYMENT: 'api/payments/vnpay/cancel',
  VNPAY_RETURN: 'api/payments/vnpay/return',
  VNPAY_WEBHOOK: 'api/payments/vnpay/webhook',
  ADMIN_GET_PAYMENTS: 'api/payments/vnpay/admin/payments',
  ADMIN_GET_PAYMENT_DETAILS: 'api/payments/vnpay/admin/payment',
  ADMIN_PROCESS_REFUND: 'api/payments/vnpay/admin/refund',

  // ========== CATEGORY ==========
  ADD_CATEGORY: 'api/category/add-category',
  GET_ALL_CATEGORY: 'api/category/get-all-categories',
  GET_CATEGORY_BY_ID: 'api/category/get-category',
  EDIT_CATEGORY: 'api/category/edit-category',

  // ========== ADMIN ==========
  GET_DASHBOARD_DETAILS: 'api/admin/dashboard-details',
  ADMIN_DASHBOARD_DATA: 'api/admin/dashboard-details',
  GET_GRAPH_DATA: 'api/admin/graph-data',
  GET_GRAPH_DATA_ADMIN: 'api/admin/graph-data',

  // ========== SHOP AI CHAT (mounted at /api/shop/chat) ==========
  SHOP_CREATE: 'api/shop/chat/create',
  SHOP_GET_USER_CHATS: 'api/shop/chat/my-chats',
  SHOP_GET_DETAILS: 'api/shop/chat',
  SHOP_SEND_MESSAGE: 'api/shop/chat',
  SHOP_UPDATE: 'api/shop/chat',
  SHOP_DELETE: 'api/shop/chat',
  SHOP_ANALYZE_QUERY: 'api/shop/chat/analyze-query',

  // ========== PLACEHOLDER / NOT IMPLEMENTED ON BACKEND ==========
  GET_CONTACT_MESSAGES: 'api/contact/get-messages',
  REPLY_CONTACT: 'api/contact/reply',
  UPLOAD_FILE: 'api/files/upload',
  UPLOAD_VIDEO: 'api/files/upload-video',
  UPLOAD_IMAGE: 'api/files/upload-image',
  GET_NOTIFICATIONS: 'api/notifications/get-notifications',
  MARK_NOTIFICATION_READ: 'api/notifications/mark-read',
  DELETE_NOTIFICATION: 'api/notifications/delete',
  GET_MESSAGES: 'api/chat/get-messages',
  SEND_MESSAGE: 'api/chat/send-message',
  GET_CHAT_ROOMS: 'api/chat/get-rooms',
  SEARCH_COURSES: 'api/search/courses',
  SEARCH_INSTRUCTORS: 'api/search/instructors',
  SEARCH_STUDENTS: 'api/search/students',
  GET_COURSE_ANALYTICS: 'api/analytics/course',
  GET_STUDENT_PROGRESS: 'api/analytics/student-progress',
  GET_INSTRUCTOR_STATS: 'api/analytics/instructor-stats',
  ADD_COURSE_REVIEW: 'api/reviews/add-review',
  GET_COURSE_REVIEWS: 'api/reviews/get-reviews',
  UPDATE_REVIEW: 'api/reviews/update-review',
  DELETE_REVIEW: 'api/reviews/delete-review',
  ADD_TO_WISHLIST: 'api/wishlist/add',
  REMOVE_FROM_WISHLIST: 'api/wishlist/remove',
  GET_WISHLIST: 'api/wishlist/get',
  GENERATE_CERTIFICATE: 'api/certificates/generate',
  GET_CERTIFICATES: 'api/certificates/get',
  VERIFY_CERTIFICATE: 'api/certificates/verify',
  REPORT_CONTENT: 'api/reports/content',
  REPORT_USER: 'api/reports/user',
  GET_REPORTS: 'api/reports/get',
  RESOLVE_REPORT: 'api/reports/resolve',
};

export default END_POINTS;
