const END_POINTS = {
    // ========== AUTHENTICATION ENDPOINTS ==========
    LOGIN_STUDENT: 'api/auth/student-login',
    REGISTER_STUDENT: 'api/auth/student-register',
    GOOGLE_LOGIN_STUDENT: 'api/auth/login-with-google',
    REGISTER_INSTRUCTOR: 'api/auth/instructor/instructor-register',
    LOGIN_INSTRUCTOR: 'api/auth/instructor/instructor-login',
    LOGIN_ADMIN: 'api/auth/admin/admin-login',
    REFRESH_TOKEN: 'api/all/refresh-token/refresh',

    // ========== INSTRUCTOR MANAGEMENT ENDPOINTS (Admin) ==========
    GET_INSTRUCTOR_REQUESTS: 'api/instructors/view-instructor-requests',
    GET_INSTRUCTOR: 'api/instructors/view-instructor',
    ACCEPT_INSTRUCTOR_REQUESTS: 'api/instructors/accept-instructor-request',
    REJECT_INSTRUCTOR_REQUESTS: 'api/instructors/reject-instructor-request',
    GET_INSTRUCTORS: 'api/instructors/get-all-instructors',
    BLOCK_INSTRUCTORS: 'api/instructors/get-all-instructors/block-instructors',
    UNBLOCK_INSTRUCTORS: 'api/instructors/get-all-instructors/unblock-instructors',
    GET_BLOCKED_INSTRUCTORS: 'api/instructors/get-blocked-instructors',

    // ========== INSTRUCTOR PROFILE ENDPOINTS ==========
    GET_INSTRUCTOR_DETAILS: 'api/instructors/get-instructor-details',
    INSTRUCTOR_UPDATE_PROFILE: 'api/instructors/update-profile',
    INSTRUCTOR_CHANGE_PASSWORD: 'api/instructors/change-password',
    GET_MY_STUDENTS: 'api/instructors/get-students-by-instructor',

    // ========== STUDENT MANAGEMENT ENDPOINTS (Admin) ==========
    GET_ALL_STUDENTS: 'api/students/get-all-students',
    BLOCK_STUDENT: 'api/students/block-student',
    UNBLOCK_STUDENT: 'api/students/unblock-student',
    GET_BLOCKED_STUDENTS: 'api/students/get-blocked-students',

    // ========== STUDENT PROFILE ENDPOINTS ==========
    GET_STUDENT_DETAILS: 'api/students/get-student-details',
    UPDATE_PROFILE: 'api/students/update-profile',
    CHANGE_PASSWORD: 'api/students/change-password',

    // ========== COURSE ENDPOINTS ==========
    ADD_COURSE: 'api/courses/instructors/add-course',
    EDIT_COURSE: 'api/courses/instructors/edit-course',
    GET_ALL_COURSES: 'api/courses/get-all-courses',
    GET_COURSE: 'api/courses/get-course',
    GET_COURSES_BY_INSTRUCTORS: 'api/courses/get-course-by-instructor',
    GET_COURSE_BY_STUDENT: 'api/courses/get-course-by-student',
    GET_RECOMMENDED_COURSES: 'api/courses/get-recommended-courses',
    GET_TRENDING_COURSES: 'api/courses/get-trending-courses',
    SEARCH_COURSE: 'api/courses/search-course',
    ENROLL_STUDENT: 'api/courses/enroll-student',

    // ========== LESSON ENDPOINTS ==========
    GET_LESSONS_BY_COURSE: 'api/courses/instructors/get-lessons-by-course',
    ADD_LESSON: 'api/courses/instructors/add-lesson',
    EDIT_LESSON: 'api/courses/instructors/edit-lesson',
    GET_LESSONS_BY_ID: 'api/courses/get-lessons-by-id',

    // ========== QUIZ ENDPOINTS ==========
    GET_QUIZZES_BY_LESSON: 'api/courses/get-quizzes-by-lesson',

    // ========== DISCUSSION ENDPOINTS ==========
    ADD_DISCUSSION: 'api/courses/lessons/add-discussion',
    GET_DISCUSSIONS_BY_LESSON: 'api/courses/lessons/get-discussions-by-lesson',
    EDIT_DISCUSSION: 'api/courses/lessons/edit-discussion',
    DELETE_DISCUSSION: 'api/courses/lessons/delete-discussion',
    REPLY_TO_DISCUSSION: 'api/courses/lessons/reply-discussion',
    GET_REPLIES_BY_DISCUSSION: 'api/courses/lesson/replies-based-on-discussion',

    // ========== VIDEO STREAMING ENDPOINTS ==========
    STREAM_VIDEO: 'api/video-streaming/stream-video',

    // ========== PAYMENT ENDPOINTS ==========
    PAY_USING_VNPAY_QR: 'api/payments/vnpay/create-qr-payment', // ✅ THÊM
    PAY_USING_VNPAY_URL: 'api/payments/vnpay/create-payment-url', // ✅ THÊM  
    CHECK_VNPAY_STATUS: 'api/payments/vnpay/status',
    CANCEL_VNPAY_PAYMENT: 'api/payments/vnpay/cancel',
    VNPAY_RETURN: 'api/payments/vnpay/return',
    VNPAY_WEBHOOK: 'api/payments/vnpay/webhook',

    // ========== ADMIN PAYMENT ENDPOINTS ==========
    ADMIN_GET_PAYMENTS: 'api/payments/vnpay/admin/payments',
    ADMIN_GET_PAYMENT_DETAILS: 'api/payments/vnpay/admin/payment',
    ADMIN_PROCESS_REFUND: 'api/payments/vnpay/admin/refund',

    // ========== CATEGORY ENDPOINTS ==========
    ADD_CATEGORY: 'api/category/add-category',
    GET_ALL_CATEGORY: 'api/category/get-all-categories',
    GET_CATEGORY_BY_ID: 'api/category/get-category',
    EDIT_CATEGORY: 'api/category/edit-category',

    // ========== ADMIN DASHBOARD ENDPOINTS ==========
    GET_DASHBOARD_DETAILS: 'api/admin/dashboard-details',
    ADMIN_DASHBOARD_DATA: 'api/admin/dashboard-details',
    GET_GRAPH_DATA: 'api/admin/graph-data',
    GET_GRAPH_DATA_ADMIN: 'api/admin/graph-data',

    // ========== CONTACT ENDPOINTS ==========
    CONTACT_US: 'api/contact/submit',
    GET_CONTACT_MESSAGES: 'api/contact/get-messages',
    REPLY_CONTACT: 'api/contact/reply',

    // ========== FILE UPLOAD ENDPOINTS ==========
    UPLOAD_FILE: 'api/files/upload',
    UPLOAD_VIDEO: 'api/files/upload-video',
    UPLOAD_IMAGE: 'api/files/upload-image',

    // ========== NOTIFICATION ENDPOINTS ==========
    GET_NOTIFICATIONS: 'api/notifications/get-notifications',
    MARK_NOTIFICATION_READ: 'api/notifications/mark-read',
    DELETE_NOTIFICATION: 'api/notifications/delete',

    // ========== CHAT/MESSAGING ENDPOINTS ==========
    GET_MESSAGES: 'api/chat/get-messages',
    SEND_MESSAGE: 'api/chat/send-message',
    GET_CHAT_ROOMS: 'api/chat/get-rooms',

    // ========== SEARCH ENDPOINTS ==========
    SEARCH_COURSES: 'api/search/courses',
    SEARCH_INSTRUCTORS: 'api/search/instructors',
    SEARCH_STUDENTS: 'api/search/students',

    // ========== ANALYTICS ENDPOINTS ==========
    GET_COURSE_ANALYTICS: 'api/analytics/course',
    GET_STUDENT_PROGRESS: 'api/analytics/student-progress',
    GET_INSTRUCTOR_STATS: 'api/analytics/instructor-stats',

    // ========== REVIEW ENDPOINTS ==========
    ADD_COURSE_REVIEW: 'api/reviews/add-review',
    GET_COURSE_REVIEWS: 'api/reviews/get-reviews',
    UPDATE_REVIEW: 'api/reviews/update-review',
    DELETE_REVIEW: 'api/reviews/delete-review',

    // ========== WISHLIST ENDPOINTS ==========
    ADD_TO_WISHLIST: 'api/wishlist/add',
    REMOVE_FROM_WISHLIST: 'api/wishlist/remove',
    GET_WISHLIST: 'api/wishlist/get',

    // ========== CERTIFICATE ENDPOINTS ==========
    GENERATE_CERTIFICATE: 'api/certificates/generate',
    GET_CERTIFICATES: 'api/certificates/get',
    VERIFY_CERTIFICATE: 'api/certificates/verify',

    // ========== REPORT ENDPOINTS ==========
    REPORT_CONTENT: 'api/reports/content',
    REPORT_USER: 'api/reports/user',
    GET_REPORTS: 'api/reports/get',
    RESOLVE_REPORT: 'api/reports/resolve',

    // ========== AI CHAT ENDPOINTS ==========
    AI_CHAT_CREATE: 'api/ai-chat/create',
    AI_CHAT_GET_USER_CHATS: 'api/ai-chat/my-chats', 
    AI_CHAT_GET_DETAILS: 'api/ai-chat',
    AI_CHAT_SEND_MESSAGE: 'api/ai-chat',
    AI_CHAT_UPDATE: 'api/ai-chat',
    AI_CHAT_DELETE: 'api/ai-chat',
    AI_CHAT_ANALYZE_QUERY: 'api/ai-chat/analyze-query'
};

export default END_POINTS;