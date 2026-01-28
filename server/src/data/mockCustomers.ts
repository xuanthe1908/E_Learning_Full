import { Types } from 'mongoose';

export interface MockCustomerData {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: {
    name: string;
    key?: string;
    url?: string;
  };
  mobile: string;
  password: string;
  interests: string[];
  coursesEnrolled: Types.ObjectId[];
  dateJoined: Date;
  isGoogleUser: boolean;
  isBlocked: boolean;
  blockedReason: string;
}

export const mockCustomersData: Omit<MockCustomerData, '_id' | 'coursesEnrolled'>[] = [
  {
    firstName: 'Nguyễn',
    lastName: 'Thị Hoa',
    email: 'nguyenthihoa@customer.com',
    profilePic: {
      name: 'customer-1.jpg',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    },
    mobile: '0901234567',
    password: '$2b$10$hashedpassword',
    interests: ['Điện thoại', 'Tai nghe', 'Đồng hồ thông minh'],
    dateJoined: new Date('2024-01-10T10:00:00Z'),
    isGoogleUser: false,
    isBlocked: false,
    blockedReason: ''
  },
  {
    firstName: 'Trần',
    lastName: 'Văn Hùng',
    email: 'tranvanhung@customer.com',
    profilePic: {
      name: 'customer-2.jpg',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop'
    },
    mobile: '0912345678',
    password: '$2b$10$hashedpassword',
    interests: ['Laptop', 'Máy tính bảng', 'Phụ kiện'],
    dateJoined: new Date('2024-01-15T10:00:00Z'),
    isGoogleUser: false,
    isBlocked: false,
    blockedReason: ''
  },
  {
    firstName: 'Lê',
    lastName: 'Thị Lan',
    email: 'lethilan@customer.com',
    profilePic: {
      name: 'customer-3.jpg',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
    },
    mobile: '0923456789',
    password: '$2b$10$hashedpassword',
    interests: ['Máy ảnh', 'Camera', 'Phụ kiện nhiếp ảnh'],
    dateJoined: new Date('2024-02-01T10:00:00Z'),
    isGoogleUser: false,
    isBlocked: false,
    blockedReason: ''
  },
  {
    firstName: 'Phạm',
    lastName: 'Minh Khang',
    email: 'phamminhkhang@customer.com',
    profilePic: {
      name: 'customer-4.jpg',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    mobile: '0934567890',
    password: '$2b$10$hashedpassword',
    interests: ['Gaming', 'Laptop gaming', 'Bàn phím cơ'],
    dateJoined: new Date('2024-02-10T10:00:00Z'),
    isGoogleUser: false,
    isBlocked: false,
    blockedReason: ''
  },
  {
    firstName: 'Hoàng',
    lastName: 'Thị Mai',
    email: 'hoangthimai@customer.com',
    profilePic: {
      name: 'customer-5.jpg',
      url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop'
    },
    mobile: '0945678901',
    password: '$2b$10$hashedpassword',
    interests: ['Apple', 'iPhone', 'iPad', 'MacBook'],
    dateJoined: new Date('2024-02-20T10:00:00Z'),
    isGoogleUser: false,
    isBlocked: false,
    blockedReason: ''
  },
  {
    firstName: 'Vũ',
    lastName: 'Văn Long',
    email: 'vuvanlong@customer.com',
    profilePic: {
      name: 'customer-6.jpg',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop'
    },
    mobile: '0956789012',
    password: '$2b$10$hashedpassword',
    interests: ['Âm thanh', 'Loa', 'Tai nghe'],
    dateJoined: new Date('2024-03-01T10:00:00Z'),
    isGoogleUser: false,
    isBlocked: false,
    blockedReason: ''
  },
  {
    firstName: 'Đỗ',
    lastName: 'Thị Nga',
    email: 'dothinga@customer.com',
    profilePic: {
      name: 'customer-7.jpg',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    },
    mobile: '0967890123',
    password: '$2b$10$hashedpassword',
    interests: ['Điện thoại', 'Smartphone', 'Phụ kiện'],
    dateJoined: new Date('2024-03-10T10:00:00Z'),
    isGoogleUser: false,
    isBlocked: false,
    blockedReason: ''
  },
  {
    firstName: 'Bùi',
    lastName: 'Minh Phúc',
    email: 'buiminhphuc@customer.com',
    profilePic: {
      name: 'customer-8.jpg',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    mobile: '0978901234',
    password: '$2b$10$hashedpassword',
    interests: ['Laptop', 'Workstation', 'Máy tính bảng'],
    dateJoined: new Date('2024-03-15T10:00:00Z'),
    isGoogleUser: false,
    isBlocked: false,
    blockedReason: ''
  }
];

