import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/reducers/authSlice';
import { MessageCircle, X, Minimize2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import AiChatInterface from './AiChatInterface';

interface AiChatWidgetProps {
  courseId?: string;
  lessonId?: string;
}

const AiChatWidget: React.FC<AiChatWidgetProps> = ({ courseId, lessonId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 relative"
        >
          <MessageCircle className="w-6 h-6" />
          {!isLoggedIn && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-96 h-[500px]'
      }`}>
        {/* Header widget */}
        <div className="flex items-center justify-between p-3 bg-blue-500 text-white rounded-t-lg">
          <h3 className="font-semibold text-sm">
            Trợ lý AI {!isLoggedIn && '(Chưa đăng nhập)'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-blue-600 p-1 rounded"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-600 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="h-[calc(100%-48px)]">
            {isLoggedIn ? (
              <AiChatInterface courseId={courseId} lessonId={lessonId} />
            ) : (
              // Login prompt cho widget
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center">
                  <LogIn className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">
                    Đăng nhập để sử dụng AI Chat
                  </p>
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                        Đăng nhập
                      </button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                        Đăng ký
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChatWidget;