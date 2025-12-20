import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotalPrice,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../../redux/reducers/cartSlice";
import { formatToINR } from "../../../utils/helpers";
import { Link } from "react-router-dom";
import { TrashIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const CartPage: React.FC = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const dispatch = useDispatch();

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Đã xóa toàn bộ giỏ hàng", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <ShoppingCartIcon className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
            <Link
              to="/courses"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item._id} className="p-4">
                  <div className="flex gap-4">
                    <Link to={`/courses/${item._id}`} className="flex-shrink-0">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/courses/${item._id}`}>
                        <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-base font-semibold text-blue-600">
                          {item.isPaid ? formatToINR(item.price) : "Miễn phí"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                            >
                              <MinusIcon className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="px-3 py-1.5 min-w-[2.5rem] text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                            >
                              <PlusIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Xóa"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-500">Thành tiền: </span>
                        <span className="text-lg font-bold text-gray-900">
                          {item.isPaid
                            ? formatToINR((item.price || 0) * item.quantity)
                            : "Miễn phí"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium text-gray-900">
                    {formatToINR(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium text-gray-900">
                    {totalPrice > 0 ? formatToINR(30000) : "Miễn phí"}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Tổng cộng:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formatToINR(totalPrice + (totalPrice > 0 ? 30000 : 0))}
                  </span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md text-center transition-colors mb-3"
              >
                Đặt hàng
              </Link>
              <Link
                to="/courses"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md text-center transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

