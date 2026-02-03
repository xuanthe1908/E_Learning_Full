import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createVNPayQRPayment, checkVNPayStatus } from '../../../api/endpoints/payment/vnpay';

// ✅ ObjectId validation utility
const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

const VNPayQRPayment: React.FC = () => {
  const params = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const productId = params.productId;
  
  const [qrCode, setQrCode] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  console.log('🔍 VNPayQR - Raw params:', params);
  console.log('🔍 VNPayQR - Extracted productId:', productId);

  // ✅ Enhanced validation on mount
  useEffect(() => {
    console.log('📝 Course ID from params:', productId);
    
    if (!productId) {
      setError('Course ID không được cung cấp');
      toast.error('Course ID không hợp lệ');
      navigate('/products');
      return;
    }

    // ✅ Validate ObjectId format
    if (!isValidObjectId(productId)) {
      console.error('❌ Invalid ObjectId format:', productId);
      setError('Course ID không đúng định dạng');
      toast.error('Course ID không hợp lệ');
      navigate('/products');
      return;
    }

    console.log('✅ Valid ObjectId format:', productId);
    createQRPayment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Tạo thanh toán VNPay
  const createQRPayment = async () => {
    if (!productId) {
      setError('Course ID không hợp lệ');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      console.log('🚀 Creating QR payment for productId:', productId);
      console.log('📊 productId type:', typeof productId);
      console.log('📏 productId length:', productId.length);
      console.log('🔤 productId format test:', isValidObjectId(productId));
      
      // ✅ Additional validation before API call
      if (!isValidObjectId(productId)) {
        throw new Error('Course ID không đúng định dạng ObjectId');
      }
      
      const response = await createVNPayQRPayment(productId);
      
      console.log('📨 QR Payment response:', response);
      
      if (response?.status === 200 && response?.data?.status === 'success') {
        const { qrCode: qrCodeData, orderId: orderIdData, amount: amountData } = response.data.data;
        
        // Validation response data
        if (!qrCodeData || !orderIdData) {
          throw new Error('Dữ liệu thanh toán không hợp lệ từ server');
        }
        
        setQrCode(qrCodeData);
        setOrderId(orderIdData);
        setAmount(amountData || 0);
        
        console.log('✅ Payment created successfully:', {
          orderId: orderIdData,
          amount: amountData,
          paymentUrl: qrCodeData
        });
        
        toast.success('Tạo thanh toán thành công!');
        
      } else {
        const errorMessage = response?.data?.message || 'Không thể tạo thanh toán';
        throw new Error(errorMessage);
      }
      
    } catch (error: any) {
      console.error('❌ Create QR payment error:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo thanh toán';
      
      // ✅ Enhanced error handling
      if (error?.response?.status === 400) {
        if (error?.response?.data?.message?.includes('ObjectId')) {
          errorMessage = 'Course ID không đúng định dạng';
        } else if (error?.response?.data?.message?.includes('Validation error')) {
          errorMessage = 'Dữ liệu không hợp lệ: ' + error.response.data.message;
        } else {
          errorMessage = error?.response?.data?.message || 'Yêu cầu không hợp lệ';
        }
      } else if (error?.response?.status === 404) {
        errorMessage = 'Không tìm thấy khóa học';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Navigate back on critical errors
      if (errorMessage.includes('Course ID') || errorMessage.includes('ObjectId')) {
        setTimeout(() => navigate('/products'), 2000);
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  // Check payment status
  const checkPaymentStatus = async () => {
    if (!orderId) return;
    
    try {
      const response = await checkVNPayStatus(orderId);
      
      if (response?.status === 200) {
        const { status } = response.data.data;
        
        console.log('📊 Payment status:', status);
        
        if (status === 'completed') {
          toast.success('Thanh toán thành công! Chuyển hướng...');
          navigate(`/products/${productId}#success`);
        } else if (status === 'expired') {
          toast.error('Thanh toán đã hết hạn. Vui lòng thử lại.');
          navigate(`/products/${productId}`);
        } else if (status === 'failed') {
          toast.error('Thanh toán thất bại. Vui lòng thử lại.');
          navigate(`/products/${productId}`);
        }
        // Nếu status là 'pending', tiếp tục polling
      }
    } catch (error) {
      console.error('❌ Check payment status error:', error);
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
      console.log('🔗 Redirecting to VNPay:', qrCode);
      
      // Chuyển hướng đến trang thanh toán VNPay
      window.location.href = qrCode;
    } catch (error) {
      console.error('❌ Direct payment error:', error);
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
    navigate(`/products/${productId}`);
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

  // ✅ Error state for invalid productId
  if (error && error.includes('Course ID')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Lỗi Course ID</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/products')}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Quay lại danh sách khóa học
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Có lỗi xảy ra</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleRetry}
                className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Thử lại
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main payment interface
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Thanh toán VNPay
              </h1>
              
              {amount > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg font-semibold text-blue-900">
                    Số tiền: {amount.toLocaleString('vi-VN')} VND
                  </p>
                  {orderId && (
                    <p className="text-sm text-blue-700 mt-1">
                      Mã đơn hàng: {orderId}
                    </p>
                  )}
                </div>
              )}

              {qrCode && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Nhấn nút bên dưới để chuyển đến trang thanh toán VNPay
                  </p>
                  
                  <button
                    onClick={handleDirectPayment}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? 'Đang chuyển hướng...' : 'Thanh toán ngay'}
                  </button>
                  
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Lưu ý:</strong> Giao dịch sẽ tự động hết hạn sau 15 phút
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Quay lại khóa học
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VNPayQRPayment;


























