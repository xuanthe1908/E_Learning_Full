import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface VNPayQRPaymentProps {
  courseId?: string;
}

const VNPayQRPayment: React.FC<VNPayQRPaymentProps> = ({ courseId = "sample-course-id" }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createQRPayment = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payments/vnpay/create-qr-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ courseId })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setQrCode(data.data.qrCode);
        setOrderId(data.data.orderId);
        setAmount(data.data.amount);
      } else {
        toast.error('Không thể tạo mã QR thanh toán');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi tạo thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    // Implement polling để check payment status
    // Hoặc dùng webhook từ VNPay
    try {
      const response = await fetch(`/api/payments/vnpay/check-status/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data.paymentStatus === 'completed') {
        // Enroll student
        await enrollStudent();
        alert('Thanh toán thành công!');
        // navigate(`/course/${courseId}`);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const enrollStudent = async () => {
    try {
      const response = await fetch(`/api/courses/enroll-student/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentMethod: 'vnpay',
          orderId: orderId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to enroll student');
      }
    } catch (error) {
      alert('Có lỗi khi đăng ký khóa học');
    }
  };

  const handleDirectPayment = () => {
    if (qrCode) {
      window.open(qrCode, '_blank');
      setIsProcessing(true);
      // Start polling for payment status
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 3000);

      // Stop polling after 10 minutes
      setTimeout(() => {
        clearInterval(interval);
        setIsProcessing(false);
      }, 600000);
    }
  };

  useEffect(() => {
    if (courseId) {
      createQRPayment();
    }
  }, [courseId, createQRPayment]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tạo mã QR thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Thanh toán VNPay
          </h2>
          <p className="text-gray-600 mb-6">
            Quét mã QR để thanh toán khóa học
          </p>
          
          {qrCode && (
            <>
              {/* QR Code Display */}
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-6">
                <div className="w-48 h-48 bg-gray-100 mx-auto flex items-center justify-center rounded">
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
                  onClick={() => window.history.back()}
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