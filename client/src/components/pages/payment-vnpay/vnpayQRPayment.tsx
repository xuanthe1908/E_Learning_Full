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

  // ✅ FIX: Cải thiện error handling
  const createQRPayment = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Creating QR payment for courseId:', courseId);
      
      const response = await createVNPayQRPayment(courseId!);
      
      console.log('QR Payment response:', response);
      
      if (response.status === 200 && response.data?.data) {
        const { qrCode: qrCodeData, orderId: orderIdData, amount: amountData } = response.data.data;
        
        setQrCode(qrCodeData);
        setOrderId(orderIdData);
        setAmount(amountData);
        
        console.log('QR Payment created successfully:', {
          orderId: orderIdData,
          amount: amountData,
          qrCodeLength: qrCodeData?.length
        });
        
        toast.success('Tạo mã QR thanh toán thành công!');
      } else {
        throw new Error(response.data?.message || 'Không thể tạo mã QR thanh toán');
      }
    } catch (error: any) {
      console.error('Payment creation error:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo thanh toán';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIX: Cải thiện check payment status
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

  const handleDirectPayment = async () => {
    if (!qrCode) {
      toast.error('Chưa có mã QR để thanh toán');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Nếu qrCode là data URL (base64), hiển thị lỗi
      if (qrCode.startsWith('data:')) {
        toast.error('Vui lòng quét mã QR bằng ứng dụng ngân hàng');
        return;
      }
      
      // Nếu qrCode là URL, redirect
      window.location.href = qrCode;
    } catch (error) {
      console.error('Direct payment error:', error);
      toast.error('Không thể chuyển hướng đến trang thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Retry function
  const handleRetry = () => {
    setError('');
    setQrCode('');
    setOrderId('');
    setAmount(0);
    createQRPayment();
  };

  // Poll payment status every 5 seconds when QR is generated
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

  // ✅ Loading state
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

  // ✅ Error state
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
                onClick={() => navigate(`/courses/${courseId}`)}
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Thanh Toán VNPay
          </h2>

          {qrCode && (
            <>
              {/* ✅ FIX: QR Code Display */}
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {qrCode.startsWith('data:') ? (
                    // Hiển thị QR code từ base64 data URL
                    <img 
                      src={qrCode} 
                      alt="QR Code thanh toán" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    // Fallback nếu không phải data URL
                    <div className="text-center">
                      <span className="text-gray-500 text-sm block mb-2">
                        QR Code được tạo
                      </span>
                      <button
                        onClick={handleDirectPayment}
                        className="text-blue-600 text-sm underline"
                      >
                        Nhấn để thanh toán
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Payment Info */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Mã đơn hàng:</span>
                    <span className="font-mono text-xs">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số tiền:</span>
                    <span className="font-semibold text-red-600">
                      {amount.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Chỉ hiển thị nút thanh toán trực tiếp nếu không phải QR code */}
                {!qrCode.startsWith('data:') && (
                  <button
                    onClick={handleDirectPayment}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang xử lý thanh toán...
                      </span>
                    ) : (
                      'Thanh toán ngay'
                    )}
                  </button>
                )}
                
                <button
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Quay lại
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6 text-xs text-gray-500">
                <p className="mb-2">Hướng dẫn thanh toán:</p>
                <ol className="text-left space-y-1">
                  <li>1. Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                  <li>2. Quét mã QR phía trên</li>
                  <li>3. Xác nhận thanh toán</li>
                  <li>4. Hệ thống sẽ tự động kích hoạt khóa học</li>
                </ol>
              </div>

              {/* ✅ Status indicator */}
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <div className="animate-pulse flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Đang chờ thanh toán...
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VNPayQRPayment;