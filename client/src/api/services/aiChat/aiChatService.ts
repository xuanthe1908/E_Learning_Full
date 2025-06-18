import api from '../../middlewares/protected-interceptor'; 
import END_POINTS from '../../../constants/endpoints';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AiChatResponse {
  _id: string;
  userId: string;
  userType: string;
  title: string;
  messages: ChatMessage[];
  isActive: boolean;
  metadata?: {
    courseId?: string;
    lessonId?: string;
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatRequest {
  title?: string;
  metadata?: {
    courseId?: string;
    lessonId?: string;
    tags?: string[];
  };
}

export interface SendMessageRequest {
  message: string;
  context?: any;
}

export const createAiChatService = async (data: CreateChatRequest) => {
  const response = await api.post(END_POINTS.AI_CHAT_CREATE, data);
  return response.data;
};

export const getUserChatsService = async () => {
  const response = await api.get(END_POINTS.AI_CHAT_GET_USER_CHATS);
  return response.data;
};

export const getChatDetailsService = async (chatId: string) => {
  const response = await api.get(`${END_POINTS.AI_CHAT_GET_DETAILS}/${chatId}`);
  return response.data;
};

export const sendMessageService = async (chatId: string, data: SendMessageRequest) => {
  const response = await api.post(`${END_POINTS.AI_CHAT_SEND_MESSAGE}/${chatId}/message`, data);
  return response.data;
};

export const updateChatService = async (chatId: string, data: { title?: string; metadata?: any }) => {
  const response = await api.put(`${END_POINTS.AI_CHAT_UPDATE}/${chatId}`, data);
  return response.data;
};

export const deleteChatService = async (chatId: string) => {
  const response = await api.delete(`${END_POINTS.AI_CHAT_DELETE}/${chatId}`);
  return response.data;
};

export const analyzeQueryService = async (query: string) => {
  const response = await api.post(END_POINTS.AI_CHAT_ANALYZE_QUERY, { query });
  return response.data;
};