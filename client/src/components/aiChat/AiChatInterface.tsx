/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Edit3, Plus, MessageSquare } from 'lucide-react';
import { useAiChat } from '../../hooks/useAiChat';
import { AiChatResponse, ChatMessage } from '../../api/services/aiChat/aiChatService';

interface AiChatInterfaceProps {
  courseId?: string;
  lessonId?: string;
}

const AiChatInterface: React.FC<AiChatInterfaceProps> = ({ courseId, lessonId }) => {
  const {
    chats,
    currentChat,
    loading,
    sendingMessage,
    createNewChat,
    selectChat,
    sendChatMessage,
    updateChatInfo,
    deleteChatById
  } = useAiChat();

  const [message, setMessage] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage) return;

    let chatId = currentChat?._id;

    // Tạo chat mới nếu chưa có
    if (!chatId) {
      try {
        const newChat = await createNewChat({
          title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
          metadata: { courseId, lessonId }
        });
        chatId = newChat._id;
      } catch (error) {
        return;
      }
    }

    try {
      if (!chatId) return; // đảm bảo chatId luôn tồn tại

        await sendChatMessage(chatId, {
        message,
        context: { courseId, lessonId }
        });
      setMessage('');
    } catch (error) {
      // Error đã được xử lý trong hook
    }
  };

  // Xử lý cập nhật tiêu đề
  const handleUpdateTitle = async () => {
    if (!currentChat || !editTitle.trim()) return;
    
    await updateChatInfo(currentChat._id, { title: editTitle.trim() });
    setIsEditingTitle(false);
  };

  // Render tin nhắn
  const renderMessage = (msg: ChatMessage, index: number) => (
    <div key={index} className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {msg.role === 'assistant' && (
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] p-3 rounded-lg ${
        msg.role === 'user' 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        <div className="whitespace-pre-wrap">{msg.content}</div>
        <div className={`text-xs mt-1 opacity-70`}>
          {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
        </div>
      </div>

      {msg.role === 'user' && (
        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar - Danh sách chat */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header sidebar */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => createNewChat({ metadata: { courseId, lessonId } })}
            className="w-full flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            <Plus className="w-4 h-4" />
            Chat mới
          </button>
        </div>

        {/* Danh sách chat */}
        <div className="flex-1 overflow-y-auto">
          {loading && chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Đang tải...</div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => selectChat(chat._id)}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${
                  currentChat?._id === chat._id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {chat.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(chat.updatedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatById(chat._id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Khu vực chat chính */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Header chat */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateTitle()}
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateTitle}
                      className="text-green-500 hover:text-green-600"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setIsEditingTitle(false)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">{currentChat.title}</h2>
                    <button
                      onClick={() => {
                        setIsEditingTitle(true);
                        setEditTitle(currentChat.title);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentChat.messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Bắt đầu cuộc trò chuyện với AI</p>
                  <p className="text-sm mt-1">Hỏi bất cứ điều gì về học tập!</p>
                </div>
              ) : (
                currentChat.messages.map((msg, index) => renderMessage(msg, index))
              )}
              {sendingMessage && (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Form gửi tin nhắn */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || sendingMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Chọn một cuộc trò chuyện</p>
              <p className="text-sm">hoặc tạo chat mới để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChatInterface;