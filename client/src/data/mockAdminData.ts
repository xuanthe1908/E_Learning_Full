// Mock Data for Admin Pages

// ==========================================
// MOCK SELLERS (Instructors)
// ==========================================
export interface MockSeller {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateJoined: string;
  isBlocked: boolean;
  isVerified: boolean;
  profileUrl: string;
}

export const mockSellers: MockSeller[] = [
  {
    _id: 'seller1',
    firstName: 'Nguyễn',
    lastName: 'Văn An',
    email: 'nguyenvanan@seller.com',
    dateJoined: '2024-01-15T10:00:00Z',
    isBlocked: false,
    isVerified: true,
    profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
  },
  {
    _id: 'seller2',
    firstName: 'Trần',
    lastName: 'Thị Bình',
    email: 'tranthibinh@seller.com',
    dateJoined: '2024-01-20T10:00:00Z',
    isBlocked: false,
    isVerified: true,
    profileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'
  },
  {
    _id: 'seller3',
    firstName: 'Lê',
    lastName: 'Minh Cường',
    email: 'leminhcuong@seller.com',
    dateJoined: '2024-02-01T10:00:00Z',
    isBlocked: false,
    isVerified: true,
    profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces'
  },
  {
    _id: 'seller4',
    firstName: 'Phạm',
    lastName: 'Thị Dung',
    email: 'phamthidung@seller.com',
    dateJoined: '2024-02-10T10:00:00Z',
    isBlocked: false,
    isVerified: false,
    profileUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces'
  },
  {
    _id: 'seller5',
    firstName: 'Hoàng',
    lastName: 'Văn Em',
    email: 'hoangvanem@seller.com',
    dateJoined: '2024-02-15T10:00:00Z',
    isBlocked: true,
    isVerified: true,
    profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces'
  },
  {
    _id: 'seller6',
    firstName: 'Vũ',
    lastName: 'Thị Hương',
    email: 'vuthihuong@seller.com',
    dateJoined: '2024-03-01T10:00:00Z',
    isBlocked: false,
    isVerified: false,
    profileUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces'
  }
];

// ==========================================
// MOCK CUSTOMERS (Students)
// ==========================================
export interface MockCustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateJoined: string;
  isBlocked: boolean;
  profileUrl: string;
  profilePic?: {
    url: string;
  };
  isGoogleUser: boolean;
}

export const mockCustomers: MockCustomer[] = [
  {
    _id: 'customer1',
    firstName: 'Nguyễn',
    lastName: 'Thị Hoa',
    email: 'nguyenthihoa@customer.com',
    dateJoined: '2024-01-10T10:00:00Z',
    isBlocked: false,
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
    isGoogleUser: false
  },
  {
    _id: 'customer2',
    firstName: 'Trần',
    lastName: 'Văn Hùng',
    email: 'tranvanhung@customer.com',
    dateJoined: '2024-01-12T10:00:00Z',
    isBlocked: false,
    profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
    isGoogleUser: false
  },
  {
    _id: 'customer3',
    firstName: 'Lê',
    lastName: 'Thị Lan',
    email: 'lethilan@customer.com',
    dateJoined: '2024-01-18T10:00:00Z',
    isBlocked: false,
    profileUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces',
    isGoogleUser: true,
    profilePic: {
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces'
    }
  },
  {
    _id: 'customer4',
    firstName: 'Phạm',
    lastName: 'Minh Khang',
    email: 'phamminhkhang@customer.com',
    dateJoined: '2024-01-25T10:00:00Z',
    isBlocked: false,
    profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    isGoogleUser: false
  },
  {
    _id: 'customer5',
    firstName: 'Hoàng',
    lastName: 'Thị Mai',
    email: 'hoangthimai@customer.com',
    dateJoined: '2024-02-05T10:00:00Z',
    isBlocked: false,
    profileUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=faces',
    isGoogleUser: false
  },
  {
    _id: 'customer6',
    firstName: 'Vũ',
    lastName: 'Văn Long',
    email: 'vuvanlong@customer.com',
    dateJoined: '2024-02-12T10:00:00Z',
    isBlocked: true,
    profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
    isGoogleUser: false
  },
  {
    _id: 'customer7',
    firstName: 'Đỗ',
    lastName: 'Thị Nga',
    email: 'dothinga@customer.com',
    dateJoined: '2024-02-20T10:00:00Z',
    isBlocked: false,
    profileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    isGoogleUser: false
  },
  {
    _id: 'customer8',
    firstName: 'Bùi',
    lastName: 'Minh Phúc',
    email: 'buiminhphuc@customer.com',
    dateJoined: '2024-03-01T10:00:00Z',
    isBlocked: false,
    profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    isGoogleUser: false
  }
];

// ==========================================
// MOCK CATEGORIES
// ==========================================
export interface MockCategory {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export const mockCategories: MockCategory[] = [
  {
    _id: 'cat1',
    name: 'Điện tử',
    description: 'Các sản phẩm điện tử công nghệ cao',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    _id: 'cat2',
    name: 'Điện thoại',
    description: 'Smartphone và phụ kiện điện thoại',
    createdAt: '2024-01-02T10:00:00Z'
  },
  {
    _id: 'cat3',
    name: 'Laptop',
    description: 'Máy tính xách tay và phụ kiện',
    createdAt: '2024-01-03T10:00:00Z'
  },
  {
    _id: 'cat4',
    name: 'Máy tính bảng',
    description: 'Tablet và phụ kiện',
    createdAt: '2024-01-04T10:00:00Z'
  },
  {
    _id: 'cat5',
    name: 'Tai nghe',
    description: 'Tai nghe không dây và có dây',
    createdAt: '2024-01-05T10:00:00Z'
  },
  {
    _id: 'cat6',
    name: 'Đồng hồ thông minh',
    description: 'Smartwatch và fitness tracker',
    createdAt: '2024-01-06T10:00:00Z'
  },
  {
    _id: 'cat7',
    name: 'Máy ảnh',
    description: 'Máy ảnh và phụ kiện chụp ảnh',
    createdAt: '2024-01-07T10:00:00Z'
  },
  {
    _id: 'cat8',
    name: 'Âm thanh',
    description: 'Loa, ampli và thiết bị âm thanh',
    createdAt: '2024-01-08T10:00:00Z'
  },
  {
    _id: 'cat9',
    name: 'Phụ kiện',
    description: 'Phụ kiện công nghệ đa dạng',
    createdAt: '2024-01-09T10:00:00Z'
  }
];

// ==========================================
// MOCK INSTRUCTOR REQUESTS
// ==========================================
export interface MockInstructorRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  createdAt: string;
  isVerified: boolean;
}

export const mockInstructorRequests: MockInstructorRequest[] = [
  {
    _id: 'req1',
    firstName: 'Nguyễn',
    lastName: 'Văn Bình',
    email: 'nguyenvanbinh@seller.com',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    createdAt: '2024-03-15T10:00:00Z',
    isVerified: false
  },
  {
    _id: 'req2',
    firstName: 'Trần',
    lastName: 'Thị Mai',
    email: 'tranthimai@seller.com',
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    createdAt: '2024-03-16T10:00:00Z',
    isVerified: false
  },
  {
    _id: 'req3',
    firstName: 'Lê',
    lastName: 'Minh Tuấn',
    email: 'leminhtuan@seller.com',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
    createdAt: '2024-03-17T10:00:00Z',
    isVerified: false
  }
];

