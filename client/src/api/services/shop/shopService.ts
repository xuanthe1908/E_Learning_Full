import api from '../../middlewares/protected-interceptor'; 
import END_POINTS from '../../../constants/endpoints';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ShopResponse {
  _id: string;
  userId: string;
  userType: string;
  title: string;
  messages: ChatMessage[];
  isActive: boolean;
  metadata?: {
    productId?: string;
    itemId?: string;
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatRequest {
  title?: string;
  metadata?: {
    productId?: string;
    itemId?: string;
    tags?: string[];
  };
}

export interface SendMessageRequest {
  message: string;
  context?: any;
}

export const createShopService = async (data: CreateChatRequest) => {
  const response = await api.post(END_POINTS.SHOP_CREATE, data);
  return response.data;
};

export const getUserChatsService = async () => {
  const response = await api.get(END_POINTS.SHOP_GET_USER_CHATS);
  return response.data;
};

export const getChatDetailsService = async (chatId: string) => {
  const response = await api.get(`${END_POINTS.SHOP_GET_DETAILS}/${chatId}`);
  return response.data;
};

export const sendMessageService = async (chatId: string, data: SendMessageRequest) => {
  const response = await api.post(`${END_POINTS.SHOP_SEND_MESSAGE}/${chatId}/message`, data);
  return response.data;
};

export const updateChatService = async (chatId: string, data: { title?: string; metadata?: any }) => {
  const response = await api.put(`${END_POINTS.SHOP_UPDATE}/${chatId}`, data);
  return response.data;
};

export const deleteChatService = async (chatId: string) => {
  const response = await api.delete(`${END_POINTS.SHOP_DELETE}/${chatId}`);
  return response.data;
};

export const analyzeQueryService = async (query: string) => {
  const response = await api.post(END_POINTS.SHOP_ANALYZE_QUERY, { query });
  return response.data;
};
























