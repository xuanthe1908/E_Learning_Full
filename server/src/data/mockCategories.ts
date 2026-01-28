import { Types } from 'mongoose';

export interface MockCategoryData {
  _id: Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const mockCategoriesData: Omit<MockCategoryData, '_id'>[] = [
  {
    name: 'Điện tử',
    description: 'Các sản phẩm điện tử công nghệ cao như laptop, điện thoại, tablet',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    name: 'Điện thoại',
    description: 'Smartphone và điện thoại di động các hãng',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    name: 'Laptop',
    description: 'Máy tính xách tay và laptop các thương hiệu',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    name: 'Máy tính bảng',
    description: 'Tablet và máy tính bảng',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    name: 'Tai nghe',
    description: 'Tai nghe không dây và có dây',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    name: 'Đồng hồ thông minh',
    description: 'Smartwatch và đồng hồ thông minh',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    name: 'Máy ảnh',
    description: 'Máy ảnh DSLR, mirrorless và camera',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    name: 'Âm thanh',
    description: 'Loa, tai nghe và thiết bị âm thanh',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    name: 'Phụ kiện',
    description: 'Phụ kiện điện tử và công nghệ',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  }
];

