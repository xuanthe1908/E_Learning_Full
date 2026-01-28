import { Types } from 'mongoose';

export interface MockAdminData {
  _id: Types.ObjectId;
  email: string;
  password: string;
}

export const mockAdminData: Omit<MockAdminData, '_id'>[] = [
  {
    email: 'admin@shop.com',
    password: '$2b$10$hashedpassword' // Will be hashed in seed script
  }
];

