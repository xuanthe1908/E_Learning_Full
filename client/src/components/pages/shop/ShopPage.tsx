import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShopInterface from 'components/shop/ShopInterface';
import { selectIsLoggedIn } from 'redux/reducers/authSlice';


const ShopPage: React.FC = () => {
  const { productId, itemId } = useParams<{ productId?: string; itemId?: string }>();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat AI</h1>
          <p className="text-gray-600">
            {isLoggedIn 
              ? "Hỏi bất cứ điều gì về sản phẩm, dịch vụ hoặc các chủ đề khác"
              : "Đăng nhập để trò chuyện với AI và nhận hỗ trợ tư vấn"
            }
          </p>
        </div>
        
        <ShopInterface productId={productId} itemId={itemId} />
      </div>
    </div>
  );
};

export default ShopPage;




























