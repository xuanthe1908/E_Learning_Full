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

  useEffect(() => {
    if (courseId) {
      createQRPayment();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const createQRPayment = async () => {
    try {
      setIsLoading(true);
      const response = await createVNPayQRPayment(courseId!);
      
      if (response.status === 200) {
        setQrCode(response.data.qrCode);
        setOrderId(response.data.orderId);
        setAmount(response.data.amount);
      } else {
        toast.error('Không thể tạo mã QR thanh toán');
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi tạo thanh toán');
      console.error('Payment creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await checkVNPayStatus(orderId);
      
      if (response.status === 200 && response.data.status === 'completed') {
        toast.success('Thanh toán thành công!');
        navigate(`/courses/${courseId}#success`);
      }
    } catch (error) {
      console.error('Check payment status error:', error);
    }
  };

  const handleDirectPayment = async () => {
    setIsProcessing(true);
    // Redirect to VNPay payment URL
    window.location.href = qrCode;
  };

  // Poll payment status every 5 seconds when QR is generated
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderId) {
      interval = setInterval(checkPaymentStatus, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tạo thanh toán...</p>
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
              {/* QR Code Display */}
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">QR Code hiển thị tại đây</span>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VNPayQRPayment;