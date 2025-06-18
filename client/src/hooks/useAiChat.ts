import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/reducers/authSlice';
import { toast } from 'react-toastify';
import {
  createAiChat,
  getUserChats,
  getChatDetails,
  sendMessage,
  updateChat,
  deleteChat,
  analyzeQuery
} from '../api/endpoints/aiChat/aiChatEndpoints';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AiChatResponse, ChatMessage, CreateChatRequest, SendMessageRequest } from '../api/services/aiChat/aiChatService';

export const useAiChat = () => {
  const [chats, setChats] = useState<AiChatResponse[]>([]);
  const [currentChat, setCurrentChat] = useState<AiChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // ✅ Kiểm tra trạng thái đăng nhập
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Lấy danh sách chat - chỉ khi đã đăng nhập
  const fetchUserChats = useCallback(async () => {
    if (!isLoggedIn) {
      console.log('User not logged in, skipping chat fetch');
      return;
    }

    try {
      setLoading(true);
      const response = await getUserChats();
      if (response.success) {
        setChats(response.data);
      }
    } catch (error: any) {
      // Chỉ hiển thị error nếu không phải lỗi 401 (unauthorized)
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách chat');
      }
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Tạo chat mới
  const createNewChat = useCallback(async (data: CreateChatRequest) => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng AI Chat');
      return;
    }

    try {
      setLoading(true);
      const response = await createAiChat(data);
      if (response.success) {
        const newChat = response.data;
        setChats(prev => [newChat, ...prev]);
        setCurrentChat(newChat);
        toast.success('Tạo phiên chat mới thành công');
        return newChat;
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo chat mới');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Chọn chat
  const selectChat = useCallback(async (chatId: string) => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng AI Chat');
      return;
    }

    try {
      setLoading(true);
      const response = await getChatDetails(chatId);
      if (response.success) {
        setCurrentChat(response.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else {
        toast.error(error.response?.data?.message || 'Lỗi khi tải chi tiết chat');
      }
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Gửi tin nhắn
  const sendChatMessage = useCallback(async (chatId: string, data: SendMessageRequest) => {
  if (!isLoggedIn) {
    toast.error('Vui lòng đăng nhập để sử dụng AI Chat');
    return;
  }

  try {
    setSendingMessage(true);
    const response = await sendMessage(chatId, data);
    if (response.success) {
      const { userMessage, assistantMessage, updatedTitle } = response.data;
      
      // Cập nhật chat hiện tại
      setCurrentChat(prev => {
        if (!prev || prev._id !== chatId) return prev;
        return {
          ...prev,
          messages: [...prev.messages, userMessage, assistantMessage],
          title: updatedTitle || prev.title, // ✅ Cập nhật title nếu có
          updatedAt: new Date()
        };
      });

      // Cập nhật danh sách chat (đưa chat lên đầu và update title)
      setChats(prev => {
        const updatedChats = prev.filter(chat => chat._id !== chatId);
        const currentChatUpdated = prev.find(chat => chat._id === chatId);
        if (currentChatUpdated) {
          return [{
            ...currentChatUpdated,
            title: updatedTitle || currentChatUpdated.title, // ✅ Cập nhật title
            updatedAt: new Date()
          }, ...updatedChats];
        }
        return prev;
      });

      return response.data;
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
    } else if (error.response?.status === 429) {
      toast.error('Quá nhiều tin nhắn. Vui lòng thử lại sau 1 phút');
    } else {
      toast.error(error.response?.data?.message || 'Lỗi khi gửi tin nhắn');
    }
    throw error;
  } finally {
    setSendingMessage(false);
  }
}, [isLoggedIn]);

  // Cập nhật chat
  const updateChatInfo = useCallback(async (chatId: string, data: { title?: string; metadata?: any }) => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng AI Chat');
      return;
    }

    try {
      const response = await updateChat(chatId, data);
      if (response.success) {
        setCurrentChat(prev => prev?._id === chatId ? response.data : prev);
        setChats(prev => prev.map(chat => 
          chat._id === chatId ? response.data : chat
        ));
        toast.success('Cập nhật chat thành công');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật chat');
      }
    }
  }, [isLoggedIn]);

  // Xóa chat
  const deleteChatById = useCallback(async (chatId: string) => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng AI Chat');
      return;
    }

    try {
      const response = await deleteChat(chatId);
      if (response.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        if (currentChat?._id === chatId) {
          setCurrentChat(null);
        }
        toast.success('Xóa chat thành công');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa chat');
      }
    }
  }, [currentChat, isLoggedIn]);

  // Phân tích truy vấn
  const analyzeUserQuery = useCallback(async (query: string) => {
    try {
      const response = await analyzeQuery(query);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi phân tích truy vấn:', error);
      return null;
    }
  }, []);

  // ✅ Chỉ load chats khi user đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserChats();
    } else {
      // Reset state khi user logout
      setChats([]);
      setCurrentChat(null);
    }
  }, [isLoggedIn, fetchUserChats]);

  return {
    chats,
    currentChat,
    loading,
    sendingMessage,
    isLoggedIn, // ✅ Export isLoggedIn để component sử dụng
    fetchUserChats,
    createNewChat,
    selectChat,
    sendChatMessage,
    updateChatInfo,
    deleteChatById,
    analyzeUserQuery,
    setCurrentChat
  };
};