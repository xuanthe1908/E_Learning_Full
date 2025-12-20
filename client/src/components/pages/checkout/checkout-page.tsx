import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotalPrice,
  clearCart,
} from "../../../redux/reducers/cartSlice";
import { formatToINR } from "../../../utils/helpers";
import { Link } from "react-router-dom";
import { createVNPayQRPayment } from "../../../api/endpoints/payment/vnpay";
import { toast } from "react-toastify";
import { MapPinIcon } from "@heroicons/react/24/outline";

const CheckoutPage: React.FC = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "cod" | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!shippingInfo.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return false;
    }
    if (!shippingInfo.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!/^[0-9]{10}$/.test(shippingInfo.phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }
    if (!shippingInfo.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      return false;
    }
    if (!shippingInfo.city.trim()) {
      toast.error("Vui lòng nhập thành phố/tỉnh");
      return false;
    }
    if (!shippingInfo.district.trim()) {
      toast.error("Vui lòng nhập quận/huyện");
      return false;
    }
    if (!shippingInfo.ward.trim()) {
      toast.error("Vui lòng nhập phường/xã");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống");
      navigate("/cart");
      return;
    }

    setIsProcessing(true);

    try {
      // Thanh toán khi nhận hàng (COD)
      if (paymentMethod === "cod") {
        // Lưu thông tin đơn hàng vào localStorage
        const orderData = {
          items: cartItems,
          shippingInfo,
          totalPrice,
          shippingFee: totalPrice > 0 ? 30000 : 0,
          finalTotal: totalPrice + (totalPrice > 0 ? 30000 : 0),
          paymentMethod: "cod",
          status: "pending",
          createdAt: new Date().toISOString(),
          orderId: `COD-${Date.now()}`,
        };

        localStorage.setItem("pendingOrder", JSON.stringify(orderData));
        localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

        // Xóa giỏ hàng
        dispatch(clearCart());

        toast.success("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
        
        // Redirect đến trang xác nhận đơn hàng
        navigate("/order-confirmation", { state: orderData });
        return;
      }

      // Thanh toán VNPay - với e-commerce, có thể cần login để thanh toán
      // Nhưng để đơn giản, tạm thời lưu order và báo cần đăng nhập hoặc xử lý sau
      if (paymentMethod === "vnpay") {
        // Lưu thông tin đơn hàng vào localStorage
        const orderData = {
          items: cartItems,
          shippingInfo,
          totalPrice,
          shippingFee: totalPrice > 0 ? 30000 : 0,
          finalTotal: totalPrice + (totalPrice > 0 ? 30000 : 0),
          paymentMethod: "vnpay",
          status: "pending",
          createdAt: new Date().toISOString(),
          orderId: `VNPAY-${Date.now()}`,
        };

        localStorage.setItem("pendingOrder", JSON.stringify(orderData));
        localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

        // Với VNPay, cần có API backend hỗ trợ thanh toán không cần login
        // Tạm thời lưu order và redirect đến trang thanh toán
        // Nếu cần login, sẽ được xử lý ở trang thanh toán
        toast.info("Đang chuyển đến trang thanh toán...");
        
        // Lấy sản phẩm đầu tiên để thanh toán
        const firstItem = cartItems[0];
        if (firstItem?._id) {
          try {
            const response = await createVNPayQRPayment(firstItem._id);
            if (response?.status === 200 && response?.data?.status === "success") {
              const { qrCode } = response.data.data;
              window.location.href = qrCode;
              return;
            }
          } catch (error: any) {
            // Nếu API cần login, hiển thị thông báo
            if (error?.response?.status === 401) {
              toast.error("Vui lòng đăng nhập để thanh toán qua VNPay");
              navigate("/login");
              return;
            }
          }
        }
        
        // Fallback: Lưu order và chuyển đến trang xác nhận
        dispatch(clearCart());
        toast.success("Đơn hàng đã được lưu. Vui lòng đăng nhập để hoàn tất thanh toán.");
        navigate("/order-confirmation", { state: orderData });
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi thanh toán"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Giỏ hàng trống
            </h1>
            <p className="text-gray-600 mb-8">
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
            </p>
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

  const shippingFee = totalPrice > 0 ? 30000 : 0;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Thanh toán đơn hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Info & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Thông tin giao hàng
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Số nhà, tên đường"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ward"
                      value={shippingInfo.ward}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Phường/Xã"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={shippingInfo.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Quận/Huyện"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thành phố/Tỉnh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Thành phố/Tỉnh"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    name="note"
                    value={shippingInfo.note}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ghi chú cho người giao hàng (không bắt buộc)"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "cod" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-900">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                      {paymentMethod === "cod" && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Khuyến nghị
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </p>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "vnpay" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => setPaymentMethod("vnpay")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="text-base font-medium text-gray-900">
                      Thanh toán qua VNPay
                    </span>
                    <p className="text-sm text-gray-500">
                      Thanh toán an toàn qua VNPay (Thẻ, Ví điện tử)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Đơn hàng của bạn
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        SL: {item.quantity} x {item.isPaid ? formatToINR(item.price) : "Miễn phí"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium text-gray-900">
                    {formatToINR(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium text-gray-900">
                    {formatToINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Tổng cộng:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formatToINR(finalTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                {isProcessing ? "Đang xử lý..." : "Thanh toán"}
              </button>

              <Link
                to="/cart"
                className="block w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md text-center transition-colors"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

