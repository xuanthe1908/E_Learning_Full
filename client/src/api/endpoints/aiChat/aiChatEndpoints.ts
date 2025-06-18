import {
  createAiChatService,
  getUserChatsService,
  getChatDetailsService,
  sendMessageService,
  updateChatService,
  deleteChatService,
  analyzeQueryService,
  CreateChatRequest,
  SendMessageRequest
} from '../../services/aiChat/aiChatService';

// Tạo phiên chat mới
export const createAiChat = (data: CreateChatRequest) => {
  return createAiChatService(data);
};

// Lấy danh sách chat của user
export const getUserChats = () => {
  return getUserChatsService();
};

// Lấy chi tiết một phiên chat
export const getChatDetails = (chatId: string) => {
  return getChatDetailsService(chatId);
};

// Gửi tin nhắn
export const sendMessage = (chatId: string, data: SendMessageRequest) => {
  return sendMessageService(chatId, data);
};

// Cập nhật chat
export const updateChat = (chatId: string, data: { title?: string; metadata?: any }) => {
  return updateChatService(chatId, data);
};

// Xóa chat
export const deleteChat = (chatId: string) => {
  return deleteChatService(chatId);
};

// Phân tích truy vấn
export const analyzeQuery = (query: string) => {
  return analyzeQueryService(query);
};