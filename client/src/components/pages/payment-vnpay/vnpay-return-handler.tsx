import { useEffect, useState } from 'react';

const VNPayReturnHandler: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const vnp_TxnRef = urlParams.get('vnp_TxnRef');
    
    if (vnp_ResponseCode === '00') {
      setStatus('success');
      // Redirect to course page after success
      setTimeout(() => {
        const courseId = localStorage.getItem('pendingCourseId');
        if (courseId) {
          window.location.href = `/course/${courseId}`;
        }
      }, 3000);
    } else {
      setStatus('failed');
    }
  }, []);

  if (status === 'loading') {
    return <div className="text-center p-8">Đang xử lý thanh toán...</div>;
  }
  
  if (status === 'success') {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Thanh toán thành công!
        </h2>
        <p>Bạn sẽ được chuyển đến khóa học trong giây lát...</p>
      </div>
    );
  }
  
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Thanh toán thất bại
      </h2>
      <p>Vui lòng thử lại sau.</p>
    </div>
  );
};

export default VNPayReturnHandler;