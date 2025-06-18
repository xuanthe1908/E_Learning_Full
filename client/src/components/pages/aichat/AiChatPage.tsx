import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AiChatInterface from 'components/aiChat/AiChatInterface';
import { selectIsLoggedIn } from 'redux/reducers/authSlice';


const AiChatPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId?: string; lessonId?: string }>();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trợ lý AI học tập</h1>
          <p className="text-gray-600">
            {isLoggedIn 
              ? "Hỏi bất cứ điều gì về khóa học, bài học hoặc các chủ đề học tập khác"
              : "Đăng nhập để trò chuyện với trợ lý AI và nhận hỗ trợ học tập"
            }
          </p>
        </div>
        
        <AiChatInterface courseId={courseId} lessonId={lessonId} />
      </div>
    </div>
  );
};

export default AiChatPage;