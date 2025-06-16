import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VNPayReturnHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        const vnpResponseCode = searchParams.get('vnp_ResponseCode');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const orderId = searchParams.get('vnp_TxnRef');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const amount = searchParams.get('vnp_Amount');
        
        if (vnpResponseCode === '00') {
          // Payment successful
          toast.success('Thanh toán thành công!');
          
          // Extract courseId from orderId if needed, or get from URL
          const courseId = searchParams.get('courseId') || 'default';
          
          // Redirect to course page with success flag
          navigate(`/courses/${courseId}#success`);
        } else {
          // Payment failed
          const errorMessage = getErrorMessage(vnpResponseCode);
          toast.error(`Thanh toán thất bại: ${errorMessage}`);
          
          // Redirect back to course page
          const courseId = searchParams.get('courseId') || 'default';
          navigate(`/courses/${courseId}`);
        }
      } catch (error) {
        console.error('Payment return handler error:', error);
        toast.error('Có lỗi xảy ra khi xử lý kết quả thanh toán');
        navigate('/courses');
      } finally {
        setIsProcessing(false);
      }
    };

    handlePaymentReturn();
  }, [searchParams, navigate]);

  const getErrorMessage = (responseCode: string | null): string => {
    const errorMessages: { [key: string]: string } = {
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };

    return errorMessages[responseCode || '99'] || 'Lỗi không xác định';
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default VNPayReturnHandler;