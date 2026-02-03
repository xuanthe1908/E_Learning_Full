// Mock Data for Seller Dashboard

import { GetProductBySellerInterface } from '../api/types/apiResponses/api-response-sellers';

// ==========================================
// MOCK SELLER PRODUCTS
// ==========================================
export const mockSellerProducts: GetProductBySellerInterface[] = [
  {
    _id: 'product1',
    title: 'Laptop Dell XPS 15 9520 - Intel Core i7',
    thumbnailUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop',
    description: 'Laptop cao cấp với màn hình OLED 15.6 inch 4K, CPU Intel Core i7-12700H',
    category: 'Laptop',
    sellerId: 'seller1',
    isPaid: true,
    price: 35000000,
    purchaseCount: 12,
    rating: 4.8,
    duration: 120,
    requirements: ['Windows 11 Pro', 'RAM 16GB'],
    tags: ['laptop', 'dell', 'xps', 'gaming'],
    completionStatus: 0,
    createdAt: '2024-01-15T10:00:00Z',
    isVerified: true,
    items: ['lesson1', 'lesson2'],
    reviews: [],
    __v: 0
  },
  {
    _id: 'product2',
    title: 'MacBook Pro 14 inch M3 Pro',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=800&fit=crop',
    description: 'MacBook Pro với chip M3 Pro, màn hình Liquid Retina XDR',
    category: 'Laptop',
    sellerId: 'seller1',
    isPaid: true,
    price: 55900000,
    purchaseCount: 8,
    rating: 4.9,
    duration: 90,
    requirements: ['macOS Sonoma', 'iCloud account'],
    tags: ['macbook', 'apple', 'm3', 'pro'],
    completionStatus: 0,
    createdAt: '2024-02-10T10:00:00Z',
    isVerified: true,
    items: ['lesson3', 'lesson4'],
    reviews: [],
    __v: 0
  },
  {
    _id: 'product3',
    title: 'Camera Canon EOS R6 Mark II',
    thumbnailUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=1200&h=800&fit=crop',
    description: 'Máy ảnh mirrorless full-frame với cảm biến 24.2MP',
    category: 'Máy ảnh',
    sellerId: 'seller1',
    isPaid: true,
    price: 45900000,
    purchaseCount: 5,
    rating: 4.7,
    duration: 150,
    requirements: ['Thẻ nhớ SDXC', 'Pin Canon LP-E6NH'],
    tags: ['camera', 'canon', 'mirrorless', 'photography'],
    completionStatus: 0,
    createdAt: '2024-02-20T10:00:00Z',
    isVerified: true,
    items: ['lesson5', 'lesson6'],
    reviews: [],
    __v: 0
  },
  {
    _id: 'product4',
    title: 'Samsung Galaxy S24 Ultra',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop',
    description: 'Galaxy S24 Ultra với S Pen, camera 200MP',
    category: 'Điện thoại',
    sellerId: 'seller1',
    isPaid: true,
    price: 29900000,
    purchaseCount: 0,
    rating: 0,
    duration: 60,
    requirements: ['SIM card', 'Samsung account'],
    tags: ['samsung', 'galaxy', 'smartphone', 's-pen'],
    completionStatus: 0,
    createdAt: '2024-03-05T10:00:00Z',
    isVerified: false,
    items: [],
    reviews: [],
    __v: 0
  },
  {
    _id: 'product5',
    title: 'ASUS ROG Zephyrus G16',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&h=800&fit=crop',
    description: 'Laptop gaming với RTX 4060, màn hình 16 inch 165Hz',
    category: 'Laptop',
    sellerId: 'seller1',
    isPaid: true,
    price: 42900000,
    purchaseCount: 15,
    rating: 4.6,
    duration: 180,
    requirements: ['Windows 11', 'NVIDIA drivers'],
    tags: ['asus', 'rog', 'gaming', 'rtx4060'],
    completionStatus: 0,
    createdAt: '2024-03-15T10:00:00Z',
    isVerified: true,
    items: ['lesson7', 'lesson8'],
    reviews: [],
    __v: 0
  }
];

// ==========================================
// MOCK SELLER STATS
// ==========================================
export interface MockSellerStats {
  totalproducts: number;
  totalcustomers: number;
  totalRevenue: number;
  totalitems: number;
}

export const mockSellerStats: MockSellerStats = {
  totalproducts: 5,
  totalcustomers: 40,
  totalRevenue: 209600000,
  totalitems: 8
};

// ==========================================
// MOCK SELLER INFO
// ==========================================
export interface MockSellerInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileUrl: string;
}

export const mockSellerInfo: MockSellerInfo = {
  _id: 'seller1',
  firstName: 'Nguyễn',
  lastName: 'Văn An',
  email: 'nguyenvanan@seller.com',
  profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
};

// ==========================================
// MOCK SELLER customers
// ==========================================
export interface MockSellerStudent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrolledDate: string;
  productsEnrolled: number;
  course?: string;
  dateJoined: string;
  isBlocked: boolean;
  isGoogleUser: boolean;
  profileUrl: string;
  profilePic?: {
    url: string;
  };
  mobile?: string;
}

export const mockSellercustomers: MockSellerStudent[] = [
  {
    _id: 'student1',
    firstName: 'Nguyễn',
    lastName: 'Thị Hoa',
    email: 'nguyenthihoa@customer.com',
    enrolledDate: '2024-03-01T10:00:00Z',
    productsEnrolled: 2,
    dateJoined: '2024-03-01T10:00:00Z',
    isBlocked: false,
    isGoogleUser: false,
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
    mobile: '0912345678'
  },
  {
    _id: 'student2',
    firstName: 'Trần',
    lastName: 'Văn Hùng',
    email: 'tranvanhung@customer.com',
    enrolledDate: '2024-03-05T10:00:00Z',
    productsEnrolled: 1,
    dateJoined: '2024-03-05T10:00:00Z',
    isBlocked: false,
    isGoogleUser: false,
    profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
    mobile: '0923456789'
  },
  {
    _id: 'student3',
    firstName: 'Lê',
    lastName: 'Thị Lan',
    email: 'lethilan@customer.com',
    enrolledDate: '2024-03-10T10:00:00Z',
    productsEnrolled: 3,
    dateJoined: '2024-03-10T10:00:00Z',
    isBlocked: false,
    isGoogleUser: true,
    profileUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces',
    profilePic: {
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces'
    },
    mobile: '0934567890'
  },
  {
    _id: 'student4',
    firstName: 'Phạm',
    lastName: 'Minh Khang',
    email: 'phamminhkhang@customer.com',
    enrolledDate: '2024-03-12T10:00:00Z',
    productsEnrolled: 1,
    dateJoined: '2024-03-12T10:00:00Z',
    isBlocked: false,
    isGoogleUser: false,
    profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    mobile: '0945678901'
  },
  {
    _id: 'student5',
    firstName: 'Hoàng',
    lastName: 'Thị Mai',
    email: 'hoangthimai@customer.com',
    enrolledDate: '2024-03-15T10:00:00Z',
    productsEnrolled: 2,
    dateJoined: '2024-03-15T10:00:00Z',
    isBlocked: false,
    isGoogleUser: false,
    profileUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=faces',
    mobile: '0956789012'
  }
];























