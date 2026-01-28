// Mock Data for Customer Dashboard

import { CourseInterface } from '../types/course';

// ==========================================
// MOCK CUSTOMER PRODUCTS (My Products)
// ==========================================
export const mockCustomerProducts: CourseInterface[] = [
  {
    _id: '1',
    title: 'Laptop Dell XPS 15 9520 - Intel Core i7',
    instructorId: 'seller1',
    instructorName: 'Nguyễn Văn An',
    category: 'Laptop',
    level: 'Mới',
    tags: ['laptop', 'dell', 'xps'],
    price: 35000000,
    isPaid: true,
    about: 'Laptop Dell XPS 15 với hiệu năng mạnh mẽ',
    description: 'Dell XPS 15 9520 là laptop cao cấp với màn hình OLED 15.6 inch 4K',
    syllabus: ['Thông số kỹ thuật', 'Hướng dẫn sử dụng'],
    requirements: ['Windows 11 Pro'],
    thumbnail: {
      name: 'dell-xps-15.jpg',
      key: 'products/dell-xps-15.jpg',
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop',
    rating: 4.8,
    isVerified: true,
    createdAt: '2024-01-15T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 65
  },
  {
    _id: '2',
    title: 'iPhone 15 Pro Max 256GB - Titanium',
    instructorId: 'seller2',
    instructorName: 'Trần Thị Bình',
    category: 'Điện thoại',
    level: 'Mới',
    tags: ['iphone', 'apple', 'smartphone'],
    price: 32900000,
    isPaid: true,
    about: 'iPhone 15 Pro Max với chip A17 Pro',
    description: 'iPhone 15 Pro Max là flagship mới nhất của Apple',
    syllabus: ['Tính năng nổi bật', 'Hướng dẫn sử dụng'],
    requirements: ['iOS 17+'],
    thumbnail: {
      name: 'iphone-15-pro-max.jpg',
      key: 'products/iphone-15-pro-max.jpg',
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=800&fit=crop',
    rating: 4.9,
    isVerified: true,
    createdAt: '2024-01-20T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 30
  },
  {
    _id: '3',
    title: 'Samsung Galaxy Watch 6 Classic 47mm',
    instructorId: 'seller3',
    instructorName: 'Lê Minh Cường',
    category: 'Đồng hồ thông minh',
    level: 'Mới',
    tags: ['samsung', 'smartwatch', 'fitness'],
    price: 8990000,
    isPaid: true,
    about: 'Đồng hồ thông minh với màn hình AMOLED',
    description: 'Samsung Galaxy Watch 6 Classic với màn hình AMOLED 1.4 inch',
    syllabus: ['Cài đặt', 'Theo dõi sức khỏe'],
    requirements: ['Android 8.0+'],
    thumbnail: {
      name: 'galaxy-watch-6.jpg',
      key: 'products/galaxy-watch-6.jpg',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop',
    rating: 4.6,
    isVerified: true,
    createdAt: '2024-01-25T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 100
  }
];

// ==========================================
// MOCK CUSTOMER INFO
// ==========================================
export interface MockCustomerInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileUrl: string;
}

export const mockCustomerInfo: MockCustomerInfo = {
  _id: 'customer1',
  firstName: 'Nguyễn',
  lastName: 'Thị Hoa',
  email: 'nguyenthihoa@customer.com',
  profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces'
};

