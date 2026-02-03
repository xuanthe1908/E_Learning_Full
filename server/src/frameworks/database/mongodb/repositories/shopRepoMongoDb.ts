import AiChat from '../models/aiChat';
import { ShopDbInterface } from '../../../../app/repositories/shopDbRepository';

export const shopRepositoryMongodb = (): ReturnType<ShopDbInterface> => {
  const createChat = async (chatData: any) => {
    const newChat = new AiChat(chatData);
    return await newChat.save();
  };

  const getChatsByUser = async (userId: string, userType: string) => {
    return await AiChat.find({ 
      userId, 
      userType, 
      isActive: true 
    })
    .sort({ updatedAt: -1 })
    .select('_id title createdAt updatedAt messages metadata')
    .limit(50);
  };

  const getChatById = async (chatId: string) => {
    const chat = await AiChat.findById(chatId);
    if (!chat) return null;
    
    // Populate userId based on userType
    // Map old userType values to new model names
    const userTypeMap: { [key: string]: string } = {
      'students': 'customers',
      'instructor': 'sellers',
      'customers': 'customers',
      'sellers': 'sellers'
    };
    
    const modelName = userTypeMap[chat.userType] || chat.userType;
    
    try {
      // Populate userId with correct model name
      const populatedChat = await AiChat.findById(chatId)
        .populate({
          path: 'userId',
          model: modelName,
          select: 'firstName lastName email'
        })
        .populate('metadata.courseId', 'title')
        .populate('metadata.lessonId', 'title');
      
      return populatedChat;
    } catch (error) {
      console.error('Error populating chat:', error);
      // Return chat without population if model not found
      return chat;
    }
  };

  const updateChat = async (chatId: string, updateData: any) => {
    return await AiChat.findByIdAndUpdate(
      chatId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  };

  const deleteChat = async (chatId: string) => {
    return await AiChat.findByIdAndUpdate(
      chatId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
  };

  const addMessage = async (chatId: string, message: any) => {
    return await AiChat.findByIdAndUpdate(
      chatId,
      { 
        $push: { messages: message },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  };

  return {
    createChat,
    getChatsByUser,
    getChatById,
    updateChat,
    deleteChat,
    addMessage
  };
};

