import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AiChatDbInterface } from '../../app/repositories/aiChatDbRepository';
import { createAiChat } from '../../entities/aiChatEntity';
import HttpStatusCodes from '../../constants/HttpStatusCodes';
import AppError from '../../utils/appError';

interface CustomRequest extends Request {
  user?: {
    Id: string;
    email: string;
    role: 'student' | 'instructor' | 'admin'; 
  };
}

const aiChatController = (
  aiChatDbRepository: AiChatDbInterface,
  aiChatDbImpl: ReturnType<AiChatDbInterface>,
  aiService: any
) => {
  const dbRepository = aiChatDbRepository(aiChatDbImpl);

  const getChatUserId = (chat: any): string => {
    if (!chat || !chat.userId) return '';
    
    if (typeof chat.userId === 'object' && chat.userId._id) {
      return chat.userId._id.toString();
    }
    
    return chat.userId.toString();
  };

  const createNewChat = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { title, metadata } = req.body;
    const { Id: userId, role } = req.user || {};

    if (!userId || !role) {
      throw new AppError('User information not found', HttpStatusCodes.UNAUTHORIZED);
    }

    const userTypeMap = {
      'student': 'students',
      'instructor': 'instructor',
      'admin': 'instructor' // Admin được treat như instructor
    };

    const userType = userTypeMap[role];
    if (!userType) {
      throw new AppError('Invalid user role', HttpStatusCodes.BAD_REQUEST);
    }

    const chatData = createAiChat(
      userId,
      userType as 'students' | 'instructor',
      title || 'Chat mới',
      metadata
    );

    const newChat = await dbRepository.createChat(chatData);

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: 'Tạo phiên chat thành công',
      data: newChat
    });
  });

  // Lấy danh sách chat của user
  const getUserChats = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { Id: userId, role } = req.user || {};

    if (!userId || !role) {
      throw new AppError('User information not found', HttpStatusCodes.UNAUTHORIZED);
    }

    // ✅ Map role to userType
    const userTypeMap = {
      'student': 'students',
      'instructor': 'instructor',
      'admin': 'instructor'
    };
    const userType = userTypeMap[role];

    const chats = await dbRepository.getChatsByUser(userId, userType);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Lấy danh sách chat thành công',
      data: chats
    });
  });

  // Lấy chi tiết một phiên chat
  const getChatDetails = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { chatId } = req.params;
    const { Id: userId } = req.user || {};

    if (!userId) {
      throw new AppError('User information not found', HttpStatusCodes.UNAUTHORIZED);
    }

    const chat = await dbRepository.getChatById(chatId);
    console.log('DEBUG chat:', chat);
    console.log('DEBUG userId:', userId);
    
    if (!chat) {
      throw new AppError('Không tìm thấy phiên chat', HttpStatusCodes.NOT_FOUND);
    }

    // ✅ Sử dụng helper function để so sánh
    const chatUserId = getChatUserId(chat);
    console.log('DEBUG chatUserId:', chatUserId);
    console.log('DEBUG comparison:', chatUserId === userId);
    
    if (chatUserId !== userId) {
      throw new AppError('Không có quyền truy cập phiên chat này', HttpStatusCodes.FORBIDDEN);
    }

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Lấy chi tiết chat thành công',
      data: chat
    });
  });

  // Gửi tin nhắn và nhận phản hồi từ AI
  const sendMessage = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { chatId } = req.params;
  const { message, context } = req.body;
  const { Id: userId } = req.user || {};

  if (!userId) {
    throw new AppError('User information not found', HttpStatusCodes.UNAUTHORIZED);
  }

  if (!message || message.trim().length === 0) {
    throw new AppError('Tin nhắn không được để trống', HttpStatusCodes.BAD_REQUEST);
  }

  if (message.length > 2000) {
    throw new AppError('Tin nhắn quá dài (tối đa 2000 ký tự)', HttpStatusCodes.BAD_REQUEST);
  }

  // Kiểm tra chat tồn tại và quyền truy cập
  const chat = await dbRepository.getChatById(chatId);
  
  if (!chat) {
    throw new AppError('Không tìm thấy phiên chat', HttpStatusCodes.NOT_FOUND);
  }

  // ✅ Sử dụng helper function để so sánh
  const chatUserId = getChatUserId(chat);
  console.log('DEBUG sendMessage - chatUserId:', chatUserId);
  console.log('DEBUG sendMessage - userId:', userId);
  
  if (chatUserId !== userId) {
    throw new AppError('Không tìm thấy phiên chat hoặc không có quyền truy cập', HttpStatusCodes.FORBIDDEN);
  }

  // ✅ Kiểm tra xem đây có phải tin nhắn đầu tiên không
  const isFirstMessage = (chat as any).messages?.length === 0;
  const shouldUpdateTitle = isFirstMessage || (chat as any).title === 'Chat mới';

  // Thêm tin nhắn của user
  const userMessage = {
    role: 'user' as const,
    content: message.trim(),
    timestamp: new Date()
  };

  await dbRepository.addMessage(chatId, userMessage);

  // Chuẩn bị context cho AI
  const messages = [
    ...(chat as unknown as { messages: Array<{ role: string; content: string }> }).messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: message.trim()
    }
  ];

  // Gọi AI service để tạo phản hồi
  const aiResponse = await aiService.generateResponse(messages, context);

  if (!aiResponse.success) {
    throw new AppError('Lỗi khi tạo phản hồi AI: ' + aiResponse.error, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  // Thêm phản hồi của AI
  const assistantMessage = {
    role: 'assistant' as const,
    content: aiResponse.content,
    timestamp: new Date()
  };

  await dbRepository.addMessage(chatId, assistantMessage);

  // ✅ Cập nhật tiêu đề chat - cải thiện logic
  let updatedTitle = (chat as any).title;
  if (shouldUpdateTitle) {
    try {
      console.log('🔄 Generating title for message:', message.substring(0, 50) + '...');
      const generatedTitle = await aiService.generateTitle(message.trim());
      
      if (generatedTitle && generatedTitle !== 'Chat mới' && generatedTitle.length >= 3) {
        updatedTitle = generatedTitle;
        await dbRepository.updateChat(chatId, { title: generatedTitle });
        console.log('✅ Title updated to:', generatedTitle);
      } else {
        console.log('⚠️ Generated title not suitable, keeping default');
      }
    } catch (error) {
      console.error('❌ Error generating title:', error);
    }
  }

  res.status(HttpStatusCodes.OK).json({
    success: true,
    message: 'Gửi tin nhắn thành công',
    data: {
      userMessage,
      assistantMessage,
      usage: aiResponse.usage,
      updatedTitle // ✅ Trả về title mới nếu có
    }
  });
});

  // Xóa phiên chat
  const deleteChat = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { chatId } = req.params;
    const { Id: userId } = req.user || {};

    if (!userId) {
      throw new AppError('User information not found', HttpStatusCodes.UNAUTHORIZED);
    }

    const chat = await dbRepository.getChatById(chatId);
    
    if (!chat) {
      throw new AppError('Không tìm thấy phiên chat', HttpStatusCodes.NOT_FOUND);
    }

    // ✅ Sử dụng helper function để so sánh
    const chatUserId = getChatUserId(chat);
    console.log('DEBUG deleteChat - chatUserId:', chatUserId);
    console.log('DEBUG deleteChat - userId:', userId);
    
    if (chatUserId !== userId) {
      throw new AppError('Không tìm thấy phiên chat hoặc không có quyền truy cập', HttpStatusCodes.FORBIDDEN);
    }

    await dbRepository.deleteChat(chatId);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Xóa phiên chat thành công'
    });
  });

  // Cập nhật thông tin chat
  const updateChat = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { chatId } = req.params;
    const { title, metadata } = req.body;
    const { Id: userId } = req.user || {};

    if (!userId) {
      throw new AppError('User information not found', HttpStatusCodes.UNAUTHORIZED);
    }

    const chat = await dbRepository.getChatById(chatId);
    
    if (!chat) {
      throw new AppError('Không tìm thấy phiên chat', HttpStatusCodes.NOT_FOUND);
    }

    // ✅ Sử dụng helper function để so sánh
    const chatUserId = getChatUserId(chat);
    console.log('DEBUG updateChat - chatUserId:', chatUserId);
    console.log('DEBUG updateChat - userId:', userId);
    
    if (chatUserId !== userId) {
      throw new AppError('Không tìm thấy phiên chat hoặc không có quyền truy cập', HttpStatusCodes.FORBIDDEN);
    }

    const updateData: any = {};
    if (title) {
      if (title.length > 100) {
        throw new AppError('Tiêu đề quá dài (tối đa 100 ký tự)', HttpStatusCodes.BAD_REQUEST);
      }
      updateData.title = title.trim();
    }
    if (metadata) updateData.metadata = { ...(chat as any).metadata, ...metadata };

    const updatedChat = await dbRepository.updateChat(chatId, updateData);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Cập nhật chat thành công',
      data: updatedChat
    });
  });

  // Phân tích truy vấn
  const analyzeQuery = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      throw new AppError('Query không được để trống', HttpStatusCodes.BAD_REQUEST);
    }

    try {
      const analysis = await aiService.analyzeQuery(query.trim());

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: 'Phân tích truy vấn thành công',
        data: analysis
      });
    } catch (error) {
      console.error('Query analysis error:', error);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: 'Phân tích truy vấn thành công',
        data: { category: 'general', confidence: 0.5, keywords: [] }
      });
    }
  });

  return {
    createNewChat,
    getUserChats,
    getChatDetails,
    sendMessage,
    deleteChat,
    updateChat,
    analyzeQuery
  };
};

export default aiChatController;