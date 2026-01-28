import { Types } from 'mongoose';

export interface MockSellerData {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: {
    name: string;
    key?: string;
    url?: string;
  };
  certificates: Array<{
    name: string;
    issuer: string;
    issueDate: Date;
  }>;
  mobile: string;
  qualification: string;
  subjects: string[];
  experience: string;
  skills: string;
  about: string;
  password: string;
  isVerified: boolean;
  coursesCreated: Types.ObjectId[];
  rejected: boolean;
  rejectedReason: string;
  isBlocked: boolean;
  blockedReason: string;
  dateJoined: Date;
  profileUrl: string;
}

export const mockSellersData: Omit<MockSellerData, '_id' | 'coursesCreated'>[] = [
  {
    firstName: 'Nguyễn',
    lastName: 'Văn An',
    email: 'nguyenvanan@seller.com',
    profilePic: {
      name: 'seller-1.jpg',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    certificates: [
      {
        name: 'Chứng chỉ Bán hàng Chuyên nghiệp',
        issuer: 'Hiệp hội Thương mại Việt Nam',
        issueDate: new Date('2023-01-15')
      },
      {
        name: 'Chứng chỉ Quản lý Sản phẩm',
        issuer: 'Trường Đại học Kinh tế',
        issueDate: new Date('2022-06-20')
      }
    ],
    mobile: '0912345678',
    qualification: 'Cử nhân Kinh tế',
    subjects: ['Điện tử', 'Laptop', 'Điện thoại'],
    experience: '5 năm kinh nghiệm bán hàng điện tử và công nghệ',
    skills: 'Tư vấn sản phẩm, Quản lý kho, Dịch vụ khách hàng',
    about: 'Chuyên bán các sản phẩm điện tử cao cấp với chất lượng đảm bảo',
    password: '$2b$10$hashedpassword', // Will be hashed in seed script
    isVerified: true,
    rejected: false,
    rejectedReason: '',
    isBlocked: false,
    blockedReason: '',
    dateJoined: new Date('2023-01-01T10:00:00Z'),
    profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  {
    firstName: 'Trần',
    lastName: 'Thị Bình',
    email: 'tranthibinh@seller.com',
    profilePic: {
      name: 'seller-2.jpg',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    certificates: [
      {
        name: 'Chứng chỉ Kinh doanh Online',
        issuer: 'Trung tâm Đào tạo Thương mại Điện tử',
        issueDate: new Date('2023-03-10')
      }
    ],
    mobile: '0923456789',
    qualification: 'Thạc sĩ Marketing',
    subjects: ['Tai nghe', 'Đồng hồ thông minh', 'Phụ kiện'],
    experience: '3 năm kinh nghiệm bán hàng online và marketing',
    skills: 'Marketing online, SEO, Quản lý đơn hàng',
    about: 'Chuyên cung cấp phụ kiện công nghệ chất lượng cao',
    password: '$2b$10$hashedpassword',
    isVerified: true,
    rejected: false,
    rejectedReason: '',
    isBlocked: false,
    blockedReason: '',
    dateJoined: new Date('2023-02-15T10:00:00Z'),
    profileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  },
  {
    firstName: 'Lê',
    lastName: 'Minh Cường',
    email: 'leminhcuong@seller.com',
    profilePic: {
      name: 'seller-3.jpg',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    },
    certificates: [
      {
        name: 'Chứng chỉ Nhiếp ảnh Chuyên nghiệp',
        issuer: 'Hiệp hội Nhiếp ảnh Việt Nam',
        issueDate: new Date('2022-09-05')
      },
      {
        name: 'Chứng chỉ Quay phim',
        issuer: 'Học viện Báo chí và Tuyên truyền',
        issueDate: new Date('2021-12-10')
      }
    ],
    mobile: '0934567890',
    qualification: 'Cử nhân Truyền thông',
    subjects: ['Máy ảnh', 'Camera', 'Phụ kiện nhiếp ảnh'],
    experience: '7 năm kinh nghiệm trong lĩnh vực nhiếp ảnh và quay phim',
    skills: 'Tư vấn máy ảnh, Kỹ thuật nhiếp ảnh, Quay phim',
    about: 'Chuyên cung cấp máy ảnh và thiết bị nhiếp ảnh chuyên nghiệp',
    password: '$2b$10$hashedpassword',
    isVerified: true,
    rejected: false,
    rejectedReason: '',
    isBlocked: false,
    blockedReason: '',
    dateJoined: new Date('2023-03-01T10:00:00Z'),
    profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  },
  {
    firstName: 'Phạm',
    lastName: 'Thị Dung',
    email: 'phamthidung@seller.com',
    profilePic: {
      name: 'seller-4.jpg',
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    certificates: [
      {
        name: 'Chứng chỉ Quản lý Bán lẻ',
        issuer: 'Viện Quản trị Kinh doanh',
        issueDate: new Date('2023-05-20')
      }
    ],
    mobile: '0945678901',
    qualification: 'Cử nhân Quản trị Kinh doanh',
    subjects: ['Máy tính bảng', 'Laptop', 'Điện thoại'],
    experience: '4 năm kinh nghiệm quản lý cửa hàng điện tử',
    skills: 'Quản lý bán hàng, Dịch vụ khách hàng, Tư vấn sản phẩm',
    about: 'Chuyên bán các sản phẩm Apple và công nghệ cao cấp',
    password: '$2b$10$hashedpassword',
    isVerified: true,
    rejected: false,
    rejectedReason: '',
    isBlocked: false,
    blockedReason: '',
    dateJoined: new Date('2023-04-10T10:00:00Z'),
    profileUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
  },
  {
    firstName: 'Hoàng',
    lastName: 'Văn Em',
    email: 'hoangvanem@seller.com',
    profilePic: {
      name: 'seller-5.jpg',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    certificates: [
      {
        name: 'Chứng chỉ Kỹ thuật Điện tử',
        issuer: 'Trường Đại học Bách khoa',
        issueDate: new Date('2021-07-15')
      }
    ],
    mobile: '0956789012',
    qualification: 'Kỹ sư Điện tử',
    subjects: ['Laptop', 'Máy tính bảng', 'Phụ kiện'],
    experience: '6 năm kinh nghiệm sửa chữa và bán linh kiện điện tử',
    skills: 'Kỹ thuật điện tử, Tư vấn kỹ thuật, Bảo hành sửa chữa',
    about: 'Chuyên cung cấp laptop và thiết bị công nghệ với dịch vụ bảo hành tốt',
    password: '$2b$10$hashedpassword',
    isVerified: true,
    rejected: false,
    rejectedReason: '',
    isBlocked: false,
    blockedReason: '',
    dateJoined: new Date('2023-05-20T10:00:00Z'),
    profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  }
];

