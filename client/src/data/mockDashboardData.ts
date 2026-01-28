// Mock Dashboard Data for Admin, Seller, and Customer

// ==========================================
// ADMIN DASHBOARD DATA
// ==========================================
export interface AdminDashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  pendingSellerRequests: number;
  blockedUsers: number;
  revenueChart: {
    labels: string[];
    data: number[];
  };
  userGrowthChart: {
    labels: string[];
    sellers: number[];
    customers: number[];
  };
  categoryStats: {
    category: string;
    count: number;
    revenue: number;
  }[];
  recentOrders: {
    orderId: string;
    customerName: string;
    productName: string;
    amount: number;
    status: string;
    date: string;
  }[];
}

export const mockAdminDashboard: AdminDashboardStats = {
  totalUsers: 13,
  totalSellers: 5,
  totalCustomers: 8,
  totalProducts: 15,
  totalRevenue: 245000000,
  totalOrders: 12,
  pendingSellerRequests: 2,
  blockedUsers: 0,
  revenueChart: {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    data: [45000000, 52000000, 48000000, 61000000, 55000000, 68000000]
  },
  userGrowthChart: {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    sellers: [2, 3, 3, 4, 4, 5],
    customers: [3, 4, 5, 6, 7, 8]
  },
  categoryStats: [
    { category: 'Điện thoại', count: 3, revenue: 82000000 },
    { category: 'Laptop', count: 3, revenue: 133800000 },
    { category: 'Tai nghe', count: 3, revenue: 21490000 },
    { category: 'Máy tính bảng', count: 1, revenue: 28900000 },
    { category: 'Đồng hồ thông minh', count: 2, revenue: 21900000 },
    { category: 'Máy ảnh', count: 1, revenue: 45900000 },
    { category: 'Âm thanh', count: 1, revenue: 3990000 },
    { category: 'Phụ kiện', count: 1, revenue: 3290000 }
  ],
  recentOrders: [
    {
      orderId: 'ORDER-001',
      customerName: 'Nguyễn Thị Hoa',
      productName: 'iPhone 15 Pro Max 256GB',
      amount: 32900000,
      status: 'completed',
      date: '2024-03-20T10:00:00Z'
    },
    {
      orderId: 'ORDER-002',
      customerName: 'Trần Văn Hùng',
      productName: 'MacBook Pro 14 inch M3 Pro',
      amount: 55900000,
      status: 'completed',
      date: '2024-03-19T14:30:00Z'
    },
    {
      orderId: 'ORDER-003',
      customerName: 'Lê Thị Lan',
      productName: 'Camera Canon EOS R6 Mark II',
      amount: 45900000,
      status: 'pending',
      date: '2024-03-21T09:15:00Z'
    },
    {
      orderId: 'ORDER-004',
      customerName: 'Phạm Minh Khang',
      productName: 'ASUS ROG Zephyrus G16',
      amount: 42900000,
      status: 'completed',
      date: '2024-03-18T16:45:00Z'
    },
    {
      orderId: 'ORDER-005',
      customerName: 'Hoàng Thị Mai',
      productName: 'iPad Pro 12.9 inch M2',
      amount: 28900000,
      status: 'completed',
      date: '2024-03-17T11:20:00Z'
    }
  ]
};

// ==========================================
// SELLER DASHBOARD DATA
// ==========================================
export interface SellerDashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  totalSales: number;
  pendingProducts: number;
  averageRating: number;
  revenueChart: {
    labels: string[];
    data: number[];
  };
  salesChart: {
    labels: string[];
    data: number[];
  };
  topProducts: {
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }[];
  recentCustomers: {
    customerId: string;
    customerName: string;
    productName: string;
    purchaseDate: string;
    amount: number;
  }[];
}

export const mockSellerDashboard: SellerDashboardStats = {
  totalProducts: 3,
  totalCustomers: 15,
  totalRevenue: 96800000,
  totalSales: 3,
  pendingProducts: 0,
  averageRating: 4.7,
  revenueChart: {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    data: [12000000, 18000000, 15000000, 22000000, 19800000, 10000000]
  },
  salesChart: {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    data: [1, 2, 1, 3, 2, 1]
  },
  topProducts: [
    {
      productId: '1',
      productName: 'Laptop Dell XPS 15 9520',
      sales: 8,
      revenue: 280000000
    },
    {
      productId: '11',
      productName: 'Samsung Galaxy S24 Ultra',
      sales: 5,
      revenue: 149500000
    },
    {
      productId: '12',
      productName: 'Xiaomi 14 Pro',
      sales: 3,
      revenue: 59700000
    }
  ],
  recentCustomers: [
    {
      customerId: 'customer1',
      customerName: 'Nguyễn Thị Hoa',
      productName: 'Laptop Dell XPS 15 9520',
      purchaseDate: '2024-03-20T10:00:00Z',
      amount: 35000000
    },
    {
      customerId: 'customer2',
      customerName: 'Trần Văn Hùng',
      productName: 'Samsung Galaxy S24 Ultra',
      purchaseDate: '2024-03-19T14:30:00Z',
      amount: 29900000
    },
    {
      customerId: 'customer3',
      customerName: 'Lê Thị Lan',
      productName: 'Xiaomi 14 Pro',
      purchaseDate: '2024-03-18T16:45:00Z',
      amount: 19900000
    }
  ]
};

// ==========================================
// CUSTOMER DASHBOARD DATA
// ==========================================
export interface CustomerDashboardStats {
  totalPurchases: number;
  totalSpent: number;
  wishlistCount: number;
  recentPurchases: {
    productId: string;
    productName: string;
    purchaseDate: string;
    amount: number;
    status: string;
    thumbnail: string;
  }[];
  recommendedProducts: {
    productId: string;
    productName: string;
    price: number;
    rating: number;
    thumbnail: string;
    category: string;
  }[];
  purchaseHistory: {
    orderId: string;
    productName: string;
    purchaseDate: string;
    amount: number;
    status: string;
  }[];
}

export const mockCustomerDashboard: CustomerDashboardStats = {
  totalPurchases: 3,
  totalSpent: 118700000,
  wishlistCount: 5,
  recentPurchases: [
    {
      productId: '2',
      productName: 'iPhone 15 Pro Max 256GB',
      purchaseDate: '2024-03-20T10:00:00Z',
      amount: 32900000,
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=800&fit=crop'
    },
    {
      productId: '4',
      productName: 'Tai nghe Sony WH-1000XM5',
      purchaseDate: '2024-03-15T14:20:00Z',
      amount: 7990000,
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=800&fit=crop'
    },
    {
      productId: '3',
      productName: 'Samsung Galaxy Watch 6 Classic',
      purchaseDate: '2024-03-10T09:30:00Z',
      amount: 8990000,
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop'
    }
  ],
  recommendedProducts: [
    {
      productId: '5',
      productName: 'iPad Pro 12.9 inch M2',
      price: 28900000,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&h=800&fit=crop',
      category: 'Máy tính bảng'
    },
    {
      productId: '7',
      productName: 'AirPods Pro 2 với USB-C',
      price: 6990000,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&h=800&fit=crop',
      category: 'Tai nghe'
    },
    {
      productId: '15',
      productName: 'Apple Watch Series 9',
      price: 12900000,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&h=800&fit=crop',
      category: 'Đồng hồ thông minh'
    }
  ],
  purchaseHistory: [
    {
      orderId: 'ORDER-001',
      productName: 'iPhone 15 Pro Max 256GB',
      purchaseDate: '2024-03-20T10:00:00Z',
      amount: 32900000,
      status: 'completed'
    },
    {
      orderId: 'ORDER-002',
      productName: 'Tai nghe Sony WH-1000XM5',
      purchaseDate: '2024-03-15T14:20:00Z',
      amount: 7990000,
      status: 'completed'
    },
    {
      orderId: 'ORDER-003',
      productName: 'Samsung Galaxy Watch 6 Classic',
      purchaseDate: '2024-03-10T09:30:00Z',
      amount: 8990000,
      status: 'completed'
    }
  ]
};

// ==========================================
// MOCK DATA FOR SELLER MANAGEMENT (ADMIN)
// ==========================================
export interface SellerRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  qualification: string;
  experience: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const mockSellerRequests: SellerRequest[] = [
  {
    _id: 'req1',
    firstName: 'Nguyễn',
    lastName: 'Văn An',
    email: 'nguyenvanan@seller.com',
    mobile: '0912345678',
    qualification: 'Cử nhân Kinh tế',
    experience: '5 năm kinh nghiệm bán hàng điện tử',
    submittedAt: '2024-01-01T10:00:00Z',
    status: 'approved'
  },
  {
    _id: 'req2',
    firstName: 'Trần',
    lastName: 'Thị Bình',
    email: 'tranthibinh@seller.com',
    mobile: '0923456789',
    qualification: 'Thạc sĩ Marketing',
    experience: '3 năm kinh nghiệm bán hàng online',
    submittedAt: '2024-02-15T10:00:00Z',
    status: 'approved'
  },
  {
    _id: 'req3',
    firstName: 'Lê',
    lastName: 'Minh Cường',
    email: 'leminhcuong@seller.com',
    mobile: '0934567890',
    qualification: 'Cử nhân Truyền thông',
    experience: '7 năm kinh nghiệm nhiếp ảnh',
    submittedAt: '2024-03-01T10:00:00Z',
    status: 'approved'
  },
  {
    _id: 'req4',
    firstName: 'Võ',
    lastName: 'Thị Duyên',
    email: 'vothiduyen@seller.com',
    mobile: '0945678901',
    qualification: 'Cử nhân Công nghệ Thông tin',
    experience: '2 năm kinh nghiệm bán hàng công nghệ',
    submittedAt: '2024-03-20T10:00:00Z',
    status: 'pending'
  },
  {
    _id: 'req5',
    firstName: 'Đặng',
    lastName: 'Văn Em',
    email: 'dangvanem@seller.com',
    mobile: '0956789012',
    qualification: 'Kỹ sư Điện tử',
    experience: '1 năm kinh nghiệm',
    submittedAt: '2024-03-22T10:00:00Z',
    status: 'pending'
  }
];

// ==========================================
// MOCK DATA FOR CUSTOMER MANAGEMENT (ADMIN)
// ==========================================
export interface CustomerInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  totalPurchases: number;
  totalSpent: number;
  dateJoined: string;
  isBlocked: boolean;
  blockedReason: string;
}

export const mockCustomersList: CustomerInfo[] = [
  {
    _id: 'customer1',
    firstName: 'Nguyễn',
    lastName: 'Thị Hoa',
    email: 'nguyenthihoa@customer.com',
    mobile: '0901234567',
    totalPurchases: 3,
    totalSpent: 118700000,
    dateJoined: '2024-01-10T10:00:00Z',
    isBlocked: false,
    blockedReason: ''
  },
  {
    _id: 'customer2',
    firstName: 'Trần',
    lastName: 'Văn Hùng',
    email: 'tranvanhung@customer.com',
    mobile: '0912345678',
    totalPurchases: 2,
    totalSpent: 84800000,
    dateJoined: '2024-01-15T10:00:00Z',
    isBlocked: false,
    blockedReason: ''
  },
  {
    _id: 'customer3',
    firstName: 'Lê',
    lastName: 'Thị Lan',
    email: 'lethilan@customer.com',
    mobile: '0923456789',
    totalPurchases: 1,
    totalSpent: 45900000,
    dateJoined: '2024-02-01T10:00:00Z',
    isBlocked: false,
    blockedReason: ''
  },
  {
    _id: 'customer4',
    firstName: 'Phạm',
    lastName: 'Minh Khang',
    email: 'phamminhkhang@customer.com',
    mobile: '0934567890',
    totalPurchases: 1,
    totalSpent: 42900000,
    dateJoined: '2024-02-10T10:00:00Z',
    isBlocked: false,
    blockedReason: ''
  },
  {
    _id: 'customer5',
    firstName: 'Hoàng',
    lastName: 'Thị Mai',
    email: 'hoangthimai@customer.com',
    mobile: '0945678901',
    totalPurchases: 2,
    totalSpent: 35800000,
    dateJoined: '2024-02-20T10:00:00Z',
    isBlocked: false,
    blockedReason: ''
  },
  {
    _id: 'customer6',
    firstName: 'Vũ',
    lastName: 'Văn Long',
    email: 'vuvanlong@customer.com',
    mobile: '0956789012',
    totalPurchases: 0,
    totalSpent: 0,
    dateJoined: '2024-03-01T10:00:00Z',
    isBlocked: false,
    blockedReason: ''
  },
  {
    _id: 'customer7',
    firstName: 'Đỗ',
    lastName: 'Thị Nga',
    email: 'dothinga@customer.com',
    mobile: '0967890123',
    totalPurchases: 1,
    totalSpent: 19900000,
    dateJoined: '2024-03-10T10:00:00Z',
    isBlocked: false,
    blockedReason: ''
  },
  {
    _id: 'customer8',
    firstName: 'Bùi',
    lastName: 'Minh Phúc',
    email: 'buiminhphuc@customer.com',
    mobile: '0978901234',
    totalPurchases: 0,
    totalSpent: 0,
    dateJoined: '2024-03-15T10:00:00Z',
    isBlocked: false,
    blockedReason: ''
  }
];

// ==========================================
// MOCK DATA FOR PAYMENT MANAGEMENT (ADMIN)
// ==========================================
export interface PaymentInfo {
  _id: string;
  orderId: string;
  customerName: string;
  productName: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'expired' | 'cancelled';
  createdAt: string;
  payDate?: string;
}

export const mockPaymentsList: PaymentInfo[] = [
  {
    _id: 'payment1',
    orderId: 'ORDER-001',
    customerName: 'Nguyễn Thị Hoa',
    productName: 'iPhone 15 Pro Max 256GB',
    amount: 32900000,
    paymentMethod: 'VNPay',
    status: 'completed',
    createdAt: '2024-03-20T10:00:00Z',
    payDate: '2024-03-20T10:05:00Z'
  },
  {
    _id: 'payment2',
    orderId: 'ORDER-002',
    customerName: 'Trần Văn Hùng',
    productName: 'MacBook Pro 14 inch M3 Pro',
    amount: 55900000,
    paymentMethod: 'VNPay',
    status: 'completed',
    createdAt: '2024-03-19T14:30:00Z',
    payDate: '2024-03-19T14:35:00Z'
  },
  {
    _id: 'payment3',
    orderId: 'ORDER-003',
    customerName: 'Lê Thị Lan',
    productName: 'Camera Canon EOS R6 Mark II',
    amount: 45900000,
    paymentMethod: 'VNPay',
    status: 'pending',
    createdAt: '2024-03-21T09:15:00Z'
  },
  {
    _id: 'payment4',
    orderId: 'ORDER-004',
    customerName: 'Phạm Minh Khang',
    productName: 'ASUS ROG Zephyrus G16',
    amount: 42900000,
    paymentMethod: 'VNPay',
    status: 'completed',
    createdAt: '2024-03-18T16:45:00Z',
    payDate: '2024-03-18T16:50:00Z'
  },
  {
    _id: 'payment5',
    orderId: 'ORDER-005',
    customerName: 'Hoàng Thị Mai',
    productName: 'iPad Pro 12.9 inch M2',
    amount: 28900000,
    paymentMethod: 'VNPay',
    status: 'completed',
    createdAt: '2024-03-17T11:20:00Z',
    payDate: '2024-03-17T11:25:00Z'
  },
  {
    _id: 'payment6',
    orderId: 'ORDER-006',
    customerName: 'Đỗ Thị Nga',
    productName: 'Xiaomi 14 Pro',
    amount: 19900000,
    paymentMethod: 'VNPay',
    status: 'failed',
    createdAt: '2024-03-16T13:10:00Z'
  }
];

