export interface MessageEntity {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AiChatMetadata {
  courseId?: string;
  lessonId?: string;
  tags?: string[];
}

export interface AiChatEntity {
  id?: string;
  userId: string;
  userType: 'students' | 'instructor';
  title: string;
  messages: MessageEntity[];
  isActive: boolean;
  metadata?: AiChatMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export const createAiChat = (
  userId: string,
  userType: 'students' | 'instructor',
  title: string = 'Chat mới',
  metadata?: AiChatMetadata
): AiChatEntity => {
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