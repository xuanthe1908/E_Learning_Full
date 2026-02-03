// Mock Data for Customer Dashboard

import { ProductInterface, Media } from '../types/product';

// ==========================================
// MOCK CUSTOMER PRODUCTS (My Products)
// ==========================================
export const mockCustomerProducts: ProductInterface[] = [
  {
    _id: '1',
    title: 'Laptop Dell XPS 15 9520 - Intel Core i7',
    sellerId: 'seller1',
    duration: 120,
    category: 'Laptop',
    level: 'Mới',
    tags: ['laptop', 'dell', 'xps'],
    price: 35000000,
    isPaid: true,
    about: 'Laptop Dell XPS 15 với hiệu năng mạnh mẽ',
    description: 'Dell XPS 15 9520 là laptop cao cấp với màn hình OLED 15.6 inch 4K',
    introduction: {
      key: 'products/intro/dell-xps-15-intro.mp4',
      name: 'dell-xps-15-intro.mp4',
      _id: 'intro1'
    },
    syllabus: ['Thông số kỹ thuật', 'Hướng dẫn sử dụng'],
    requirements: ['Windows 11 Pro'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop',
    guidelinesUrl: 'https://example.com/guidelines/dell-xps-15.pdf',
    productsPurchased: [],
    rating: 4.8,
    isVerified: true,
    createdAt: '2024-01-15T10:00:00Z',
    completionStatus: 65,
    __v: 0
  },
  {
    _id: '2',
    title: 'iPhone 15 Pro Max 256GB - Titanium',
    sellerId: 'seller2',
    duration: 90,
    category: 'Điện thoại',
    level: 'Mới',
    tags: ['iphone', 'apple', 'smartphone'],
    price: 32900000,
    isPaid: true,
    about: 'iPhone 15 Pro Max với chip A17 Pro',
    description: 'iPhone 15 Pro Max là flagship mới nhất của Apple',
    introduction: {
      key: 'products/intro/iphone-15-pro-max-intro.mp4',
      name: 'iphone-15-pro-max-intro.mp4',
      _id: 'intro2'
    },
    syllabus: ['Tính năng nổi bật', 'Hướng dẫn sử dụng'],
    requirements: ['iOS 17+'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=800&fit=crop',
    guidelinesUrl: 'https://example.com/guidelines/iphone-15-pro-max.pdf',
    productsPurchased: [],
    rating: 4.9,
    isVerified: true,
    createdAt: '2024-01-20T10:00:00Z',
    completionStatus: 30,
    __v: 0
  },
  {
    _id: '3',
    title: 'Samsung Galaxy Watch 6 Classic 47mm',
    sellerId: 'seller3',
    duration: 60,
    category: 'Đồng hồ thông minh',
    level: 'Mới',
    tags: ['samsung', 'smartwatch', 'fitness'],
    price: 8990000,
    isPaid: true,
    about: 'Đồng hồ thông minh với màn hình AMOLED',
    description: 'Samsung Galaxy Watch 6 Classic với màn hình AMOLED 1.4 inch',
    introduction: {
      key: 'products/intro/galaxy-watch-6-intro.mp4',
      name: 'galaxy-watch-6-intro.mp4',
      _id: 'intro3'
    },
    syllabus: ['Cài đặt', 'Theo dõi sức khỏe'],
    requirements: ['Android 8.0+'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop',
    guidelinesUrl: 'https://example.com/guidelines/galaxy-watch-6.pdf',
    productsPurchased: [],
    rating: 4.6,
    isVerified: true,
    createdAt: '2024-01-25T10:00:00Z',
    completionStatus: 100,
    __v: 0
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























