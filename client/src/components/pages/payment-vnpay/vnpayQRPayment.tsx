import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createVNPayQRPayment, checkVNPayStatus } from '../../../api/endpoints/payment/vnpay';

const VNPayQRPayment: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (courseId) {
      createQRPayment();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Tạo thanh toán VNPay
  const createQRPayment = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Validation
      if (!courseId) {
        throw new Error('Course ID không hợp lệ');
      }
      
      console.log('Creating QR payment for courseId:', courseId);
      
      const response = await createVNPayQRPayment(courseId);
      
      console.log('QR Payment response:', response);
      
      if (response?.status === 200 && response?.data?.status === 'success') {
        const { qrCode: qrCodeData, orderId: orderIdData, amount: amountData } = response.data.data;
        
        // Validation response data
        if (!qrCodeData || !orderIdData) {
          throw new Error('Dữ liệu thanh toán không hợp lệ từ server');
        }
        
        setQrCode(qrCodeData);
        setOrderId(orderIdData);
        setAmount(amountData || 0);
        
        console.log('Payment created successfully:', {
          orderId: orderIdData,
          amount: amountData,
          paymentUrl: qrCodeData
        });
        
        toast.success('Tạo thanh toán thành công!');
      } else {
        const errorMsg = response?.data?.message || 'Không thể tạo thanh toán';
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('Payment creation error:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo thanh toán';
      
      if (error?.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập để thực hiện thanh toán';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Không tìm thấy khóa học';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra trạng thái thanh toán
  const checkPaymentStatus = async () => {
    if (!orderId) return;
    
    try {
      console.log('Checking payment status for orderId:', orderId);
      
      const response = await checkVNPayStatus(orderId);
      
      if (response.status === 200 && response.data?.data) {
        const { status } = response.data.data;
        
        console.log('Payment status:', status);
        
        if (status === 'completed') {
          toast.success('Thanh toán thành công!');
          navigate(`/courses/${courseId}#success`);
        } else if (status === 'expired') {
          toast.error('Thanh toán đã hết hạn. Vui lòng thử lại.');
          navigate(`/courses/${courseId}`);
        } else if (status === 'failed') {
          toast.error('Thanh toán thất bại. Vui lòng thử lại.');
          navigate(`/courses/${courseId}`);
        }
        // Nếu status là 'pending', tiếp tục polling
      }
    } catch (error) {
      console.error('Check payment status error:', error);
      // Không hiển thị toast lỗi cho việc check status để tránh spam
    }
  };

  // Chuyển hướng đến VNPay
  const handleDirectPayment = async () => {
    if (!qrCode) {
      toast.error('Chưa có thông tin thanh toán');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log('Redirecting to VNPay:', qrCode);
      
      // Chuyển hướng đến trang thanh toán VNPay
      window.location.href = qrCode;
    } catch (error) {
      console.error('Direct payment error:', error);
      toast.error('Không thể chuyển hướng đến trang thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  // Thử lại tạo thanh toán
  const handleRetry = () => {
    setError('');
    setQrCode('');
    setOrderId('');
    setAmount(0);
    createQRPayment();
  };

  // Hủy thanh toán và quay lại
  const handleCancel = () => {
    navigate(`/courses/${courseId}`);
  };

  // Poll payment status every 5 seconds when orderId exists
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderId && !isProcessing) {
      interval = setInterval(checkPaymentStatus, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isProcessing]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tạo thanh toán...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !qrCode) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Lỗi Tạo Thanh Toán
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Thử Lại
              </button>
              <button
                onClick={handleCancel}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Quay Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main payment interface
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-blue-600 text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Thanh Toán VNPay
          </h2>
          <p className="text-gray-600">
            Nhấn nút bên dưới để chuyển đến trang thanh toán VNPay
          </p>
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Mã đơn hàng:</span>
              <span className="font-mono text-xs text-blue-800">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Số tiền:</span>
              <span className="font-semibold text-red-600">
                {amount.toLocaleString('vi-VN')} VND
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phương thức:</span>
              <span className="font-medium text-blue-600">VNPay QR</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDirectPayment}
            disabled={isProcessing || !qrCode}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang chuyển hướng...
              </>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Thanh Toán VNPay
              </>
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Hủy Thanh Toán
          </button>
        </div>

        {/* Payment Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">📝 Hướng dẫn:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Nhấn "Thanh Toán VNPay" để chuyển đến trang thanh toán</li>
            <li>• Chọn phương thức thanh toán phù hợp</li>
            <li>• Hoàn tất thanh toán theo hướng dẫn</li>
            <li>• Hệ thống sẽ tự động cập nhật kết quả</li>
          </ul>
        </div>

        {/* Status Indicator */}
        {orderId && !isProcessing && (
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Đang theo dõi trạng thái thanh toán...
          </div>
        )}
      </div>
    </div>
  );
};

export default VNPayQRPayment;