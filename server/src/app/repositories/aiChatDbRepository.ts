import { Document } from 'mongoose';

export const aiChatDbRepositoryInterface = () => {
  return {
    createChat: async (chatData: any): Promise<Document> => {
      return {} as Document;
    },
    getChatsByUser: async (userId: string, userType: string): Promise<Document[]> => {
      return [];
    },
    getChatById: async (chatId: string): Promise<Document | null> => {
      return null;
    },
    updateChat: async (chatId: string, updateData: any): Promise<Document | null> => {
      return null;
    },
    deleteChat: async (chatId: string): Promise<Document | null> => {
      return null;
    },
    addMessage: async (chatId: string, message: any): Promise<Document | null> => {
      return null;
    }
  };
};

export const aiChatDbRepository = (repository: ReturnType<typeof aiChatDbRepositoryInterface>) => {
  const createChat = async (chatData: any) => repository.createChat(chatData);
  const getChatsByUser = async (userId: string, userType: string) => repository.getChatsByUser(userId, userType);
  const getChatById = async (chatId: string) => repository.getChatById(chatId);
  const updateChat = async (chatId: string, updateData: any) => repository.updateChat(chatId, updateData);
  const deleteChat = async (chatId: string) => repository.deleteChat(chatId);
  const addMessage = async (chatId: string, message: any) => repository.addMessage(chatId, message);

  return {
    createChat,
    getChatsByUser,
    getChatById,
    updateChat,
    deleteChat,
    addMessage
  };
};

export type AiChatDbInterface = typeof aiChatDbRepository;