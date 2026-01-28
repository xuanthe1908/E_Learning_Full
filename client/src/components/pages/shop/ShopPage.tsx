import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShopInterface from 'components/shop/ShopInterface';
import { selectIsLoggedIn } from 'redux/reducers/authSlice';


const ShopPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId?: string; lessonId?: string }>();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">
            {isLoggedIn 
              ? "Hỏi bất cứ điều gì về khóa học, bài học hoặc các chủ đề học tập khác"
              : "Đăng nhập để trò chuyện với Shop và nhận hỗ trợ học tập"
            }
          </p>
        </div>
        
        <ShopInterface courseId={courseId} lessonId={lessonId} />
      </div>
    </div>
  );
};

export default ShopPage;

