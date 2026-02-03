export interface MessageEntity {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ShopMetadata {
  courseId?: string;
  lessonId?: string;
  tags?: string[];
}

export interface ShopEntity {
  id?: string;
  userId: string;
  userType: 'customers' | 'sellers' | 'students' | 'instructor'; // Support both old and new
  title: string;
  messages: MessageEntity[];
  isActive: boolean;
  metadata?: ShopMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export const createShop = (
  userId: string,
  userType: 'customers' | 'sellers' | 'students' | 'instructor',
  title: string = 'Chat mới',
  metadata?: ShopMetadata
): ShopEntity => {
  // Map old userType to new names for backward compatibility
  const userTypeMap: { [key: string]: 'customers' | 'sellers' } = {
    'students': 'customers',
    'instructor': 'sellers',
    'customers': 'customers',
    'sellers': 'sellers'
  };
  
  const mappedUserType = userTypeMap[userType] || userType as 'customers' | 'sellers';
  
  return {
    userId,
    userType: mappedUserType,
    title,
    messages: [],
    isActive: true,
    metadata,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

