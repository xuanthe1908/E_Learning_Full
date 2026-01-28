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
  userType: 'students' | 'instructor';
  title: string;
  messages: MessageEntity[];
  isActive: boolean;
  metadata?: ShopMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export const createShop = (
  userId: string,
  userType: 'students' | 'instructor',
  title: string = 'Chat mới',
  metadata?: ShopMetadata
): ShopEntity => {
  return {
    userId,
    userType,
    title,
    messages: [],
    isActive: true,
    metadata,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

