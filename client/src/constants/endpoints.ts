/**
 * API endpoints - must match backend routes in server/src/frameworks/webserver/routes/
 * Backend mounts: /api/auth, /api/admin, /api/category, /api/products, /api/sellers, /api/customers, /api/shop/chat, /api/payments, /api/video-streaming
 */
const END_POINTS = {
  // ========== AUTHENTICATION ==========
  LOGIN_CUSTOMER: 'api/auth/customer-login',
  REGISTER_CUSTOMER: 'api/auth/customer-register',
  GOOGLE_LOGIN_CUSTOMER: 'api/auth/login-with-google',
  REGISTER_SELLER: 'api/auth/seller/seller-register',
  LOGIN_SELLER: 'api/auth/seller/seller-login',
  LOGIN_ADMIN: 'api/auth/admin/admin-login',
  REFRESH_TOKEN: 'api/all/refresh-token/refresh',

  // ========== SELLERS (seller router mounted at /api/sellers) ==========
  GET_SELLER_REQUESTS: 'api/sellers/view-seller-requests',
  GET_SELLER: 'api/sellers/view-seller',
  ACCEPT_SELLER_REQUESTS: 'api/sellers/accept-seller-request',
  REJECT_SELLER_REQUESTS: 'api/sellers/reject-seller-request',
  GET_SELLERS: 'api/sellers/get-all-sellers',
  BLOCK_SELLERS: 'api/sellers/get-all-sellers/block-sellers',
  UNBLOCK_SELLERS: 'api/sellers/get-all-sellers/unblock-sellers',
  GET_BLOCKED_SELLERS: 'api/sellers/get-blocked-sellers',
  GET_SELLER_DETAILS: 'api/sellers/get-seller-details',
  SELLER_UPDATE_PROFILE: 'api/sellers/update-profile',
  SELLER_CHANGE_PASSWORD: 'api/sellers/change-password',
  GET_MY_CUSTOMERS: 'api/sellers/get-customers-by-seller',

  // ========== CUSTOMERS (customer router mounted at /api/customers) ==========
  GET_ALL_CUSTOMERS: 'api/customers/get-all-customers',
  BLOCK_CUSTOMER: 'api/customers/block-customer',
  UNBLOCK_CUSTOMER: 'api/customers/unblock-customer',
  GET_BLOCKED_CUSTOMERS: 'api/customers/get-all-blocked-customers',
  GET_CUSTOMER_DETAILS: 'api/customers/get-customer-details',
  UPDATE_PROFILE: 'api/customers/update-profile',
  CHANGE_PASSWORD: 'api/customers/change-password',
  CONTACT_US: 'api/customers/contact-us',

  // ========== PRODUCTS (product router mounted at /api/products) ==========
  ADD_PRODUCT: 'api/products/sellers/add-product',
  EDIT_PRODUCT: 'api/products/sellers/edit-product',
  GET_ALL_PRODUCTS: 'api/products/list',
  GET_PRODUCT: 'api/products',
  GET_PRODUCTS_BY_SELLERS: 'api/products/sellers/my-products',
  GET_PRODUCT_BY_CUSTOMER: 'api/products/customers/my-products',
  GET_RECOMMENDED_PRODUCTS: 'api/products/recommended',
  GET_TRENDING_PRODUCTS: 'api/products/trending',
  SEARCH_PRODUCT: 'api/products/search',
  PURCHASE_PRODUCT: 'api/products/purchase',

  // ========== ITEMS (under /api/products) ==========
  GET_ITEMS_BY_PRODUCT: 'api/products/sellers/get-items-by-product',
  ADD_ITEM: 'api/products/sellers/add-item',
  EDIT_ITEM: 'api/products/sellers/edit-item',
  GET_ITEMS_BY_ID: 'api/products/items',

  // ========== QUIZZES (under /api/products/items) ==========
  GET_QUIZZES_BY_ITEM: 'api/products/items',

  // ========== DISCUSSIONS (under /api/products/items) ==========
  ADD_DISCUSSION: 'api/products/items/add-discussion',
  GET_DISCUSSIONS_BY_item: 'api/products/items/get-discussions-by-item',
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
  SEARCH_PRODUCTS: 'api/search/products',
  SEARCH_SELLERS: 'api/search/sellers',
  SEARCH_CUSTOMERS: 'api/search/customers',
  GET_PRODUCT_ANALYTICS: 'api/analytics/product',
  GET_CUSTOMER_PROGRESS: 'api/analytics/customer-progress',
  GET_SELLER_STATS: 'api/analytics/seller-stats',
  ADD_PRODUCT_REVIEW: 'api/reviews/add-review',
  GET_PRODUCT_REVIEWS: 'api/reviews/get-reviews',
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






















