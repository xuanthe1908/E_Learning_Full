import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';

/**
 * Lấy userId từ req.user với mọi trường hợp có thể:
 * - req.user.id
 * - req.user.Id
 * - req.user.payload?.Id
 */
const getUserIdFromRequest = (req: Request): string => {
  return (
    req.user?.id ||
    req.user?.Id ||
    req.user?.payload?.Id ||
    req.ip // fallback nếu không có userId
  );
};

// Rate limiting cho AI chat - 20 tin nhắn mỗi phút
export const aiChatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 20, // tối đa 20 requests
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getUserIdFromRequest,
  message: {
    success: false,
    message: 'Quá nhiều tin nhắn. Vui lòng thử lại sau 1 phút.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  handler: (req: Request, res: Response) => {
    res.status(HttpStatusCodes.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Quá nhiều tin nhắn. Vui lòng thử lại sau 1 phút.',
      error: 'RATE_LIMIT_EXCEEDED'
    });
  }
});

// Rate limiting cho tạo chat mới - 10 lần mỗi phút
export const createChatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 10, // tối đa 10 requests
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getUserIdFromRequest,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu tạo chat. Vui lòng thử lại sau.',
    error: 'CREATE_CHAT_RATE_LIMIT_EXCEEDED'
  },
  handler: (req: Request, res: Response) => {
    res.status(HttpStatusCodes.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Quá nhiều yêu cầu tạo chat. Vui lòng thử lại sau.',
      error: 'CREATE_CHAT_RATE_LIMIT_EXCEEDED'
    });
  }
});
