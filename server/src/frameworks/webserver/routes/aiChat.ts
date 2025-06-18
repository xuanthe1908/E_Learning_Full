import express from 'express';
import aiChatController from '../../../adapters/controllers/aiChatController';
import { aiChatDbRepository } from '../../../app/repositories/aiChatDbRepository';
import { aiChatRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/aiChatRepoMongoDb';
import { openAiService } from '../../../frameworks/services/openAiService';
import jwtAuthMiddleware from '../middlewares/userAuth';
import { aiChatRateLimit, createChatRateLimit } from '../middlewares/rateLimitMiddleware';

const aiChatRouter = () => {
  const router = express.Router();

  // Khởi tạo OpenAI service với config
  const aiServiceInstance = openAiService({
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7')
  });

  const controller = aiChatController(
    aiChatDbRepository,
    aiChatRepositoryMongodb(),
    aiServiceInstance
  );

  // Áp dụng middleware xác thực cho tất cả routes
  router.use(jwtAuthMiddleware);

  // Tạo phiên chat mới (có rate limiting)
  router.post('/create', createChatRateLimit, controller.createNewChat);

  // Lấy danh sách chat của user
  router.get('/my-chats', controller.getUserChats);

  // Lấy chi tiết một phiên chat
  router.get('/:chatId', controller.getChatDetails);

  // Gửi tin nhắn (có rate limiting)
  router.post('/:chatId/message', aiChatRateLimit, controller.sendMessage);

  // Cập nhật thông tin chat
  router.put('/:chatId', controller.updateChat);

  // Xóa phiên chat
  router.delete('/:chatId', controller.deleteChat);

  // Phân tích truy vấn
  router.post('/analyze-query', controller.analyzeQuery);

  return router;
};

export default aiChatRouter;