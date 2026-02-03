import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatToINR } from "../../../utils/helpers";
import { CheckCircleIcon, MapPinIcon, TruckIcon } from "@heroicons/react/24/solid";

interface OrderData {
  items: any[];
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    note?: string;
  };
  totalPrice: number;
  shippingFee: number;
  finalTotal: number;
  paymentMethod: string;
  status: string;
  orderId: string;
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(
    location.state || null
  );

  useEffect(() => {
    // Lấy dữ liệu từ localStorage nếu không có trong location.state
    if (!orderData) {
      const savedOrder = localStorage.getItem("pendingOrder");
      if (savedOrder) {
        setOrderData(JSON.parse(savedOrder));
      } else {
        navigate("/");
      }
    }
  }, [location.state, navigate, orderData]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được đơn hàng của bạn.
          </p>
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-sm font-medium text-blue-900">
              Mã đơn hàng: <span className="font-bold">{orderData.orderId}</span>
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Thông tin giao hàng
              </h2>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Người nhận:</span>{" "}
                {orderData.shippingInfo.fullName}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {orderData.shippingInfo.phone}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {orderData.shippingInfo.address}, {orderData.shippingInfo.ward},{" "}
                {orderData.shippingInfo.district}, {orderData.shippingInfo.city}
              </p>
              {orderData.shippingInfo.note && (
                <p>
                  <span className="font-medium">Ghi chú:</span>{" "}
                  {orderData.shippingInfo.note}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TruckIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Phương thức thanh toán
              </h2>
            </div>
            <p className="text-gray-700">
              <span className="font-medium">
                {orderData.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : "Thanh toán qua VNPay"}
              </span>
            </p>
            {orderData.paymentMethod === "cod" && (
              <p className="text-sm text-gray-500 mt-2">
                Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng
              </p>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sản phẩm đã đặt
            </h2>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item._id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Số lượng: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      {item.isPaid
                        ? formatToINR((item.price || 0) * item.quantity)
                        : "Miễn phí"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium text-gray-900">
                  {formatToINR(orderData.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium text-gray-900">
                  {formatToINR(orderData.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">Tổng cộng:</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatToINR(orderData.finalTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/shop"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md text-center transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              to="/dashboard"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-md text-center transition-colors"
            >
              Xem đơn hàng của tôi
            </Link>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Đơn hàng của bạn đang được xử lý. Chúng tôi
              sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;




























