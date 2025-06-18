import AiChat from '../models/aiChat';
import { AiChatDbInterface } from '../../../../app/repositories/aiChatDbRepository';

export const aiChatRepositoryMongodb = (): ReturnType<AiChatDbInterface> => {
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
    return await AiChat.findById(chatId)
      .populate('userId', 'firstName lastName email')
      .populate('metadata.courseId', 'title')
      .populate('metadata.lessonId', 'title');
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