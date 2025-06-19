// client/src/components/pages/course-pages/payment-confirmation-modal.tsx
import React, { useState, useEffect, Fragment } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { formatToINR, formatTime } from "../../../utils/helpers";
import { enrollStudent } from "../../../api/endpoints/course/course";
import { createVNPayQRPayment } from "../../../api/endpoints/payment/vnpay"; 
import { useSelector } from "react-redux"; 
import { selectIsLoggedIn } from "../../../redux/reducers/authSlice"; 
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

// ✅ ObjectId validation utility
const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

interface PaymentModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdated: () => void;
  courseDetails: {
    price: number;
    overview: string;
    isPaid: boolean;
  };
}

const PaymentConfirmationModal: React.FC<PaymentModalProps> = ({
  open,
  setOpen,
  setUpdated,
  courseDetails,
}) => {
  const handleOpen = () => setOpen((cur) => !cur);
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const offerExpiration = "2023-08-13T22:59:59.000Z";
  
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // ✅ Debug logs for courseDetails
  useEffect(() => {
    if (open) {
      console.group('💳 Payment Modal Debug');
      console.log('courseDetails:', courseDetails);
      console.log('courseDetails.isPaid:', courseDetails.isPaid);
      console.log('courseDetails.price:', courseDetails.price);
      console.log('typeof courseDetails.isPaid:', typeof courseDetails.isPaid);
      console.log('courseId:', courseId);
      console.log('courseId valid:', courseId ? isValidObjectId(courseId) : false);
      console.groupEnd();
    }
  }, [open, courseDetails, courseId]);

  // ✅ Enhanced isFreeCourse logic
  const isFreeCourse = courseDetails?.isPaid === false || courseDetails?.price === 0;
  console.log('🎯 isFreeCourse result:', isFreeCourse);

  const handleConfirmPayment = async () => {
    if (!courseId) {
      toast.error('Course ID is missing', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await enrollStudent(courseId);
      setTimeout(() => {
        setUpdated();
        setIsLoading(false);
        setOpen(false);
        toast.success(response?.message || 'Successfully enrolled!', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }, 3000);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleVNPayPayment = async () => {
    if (!isLoggedIn) {
      toast.error('Bạn cần đăng nhập để thực hiện thanh toán', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (!courseId) {
      toast.error('Course ID không hợp lệ', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (!isValidObjectId(courseId)) {
      toast.error('ID khóa học không đúng định dạng', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    const tokenString = localStorage.getItem("accessToken");
    if (!tokenString) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('🚀 Creating VNPay payment for courseId:', courseId);
      console.log('✅ User logged in:', isLoggedIn);
      console.log('✅ Access token exists:', !!tokenString);
      console.log('✅ Course details:', {
        id: courseId,
        price: courseDetails.price,
        isPaid: courseDetails.isPaid
      });
      
      // Gọi API tạo QR payment
      const response = await createVNPayQRPayment(courseId);
      
      console.log('📨 VNPay payment response:', response);
      
      if (response?.status === 200 && response?.data?.status === 'success') {
        const { qrCode } = response.data.data;
        
        if (!qrCode) {
          throw new Error('Không nhận được URL thanh toán từ server');
        }
        
        // Đóng modal
        setOpen(false);
        
        // Chuyển hướng trực tiếp đến VNPay
        console.log('🔗 Redirecting to VNPay:', qrCode);
        window.location.href = qrCode;
        
      } else {
        const errorMessage = response?.data?.message || 'Không thể tạo thanh toán VNPay';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('❌ VNPay payment error:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo thanh toán';
      
      if (error?.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
      } else if (error?.response?.status === 400) {
        if (error?.response?.data?.message?.includes('ObjectId')) {
          errorMessage = 'ID khóa học không đúng định dạng';
        } else if (error?.response?.data?.message?.includes('Validation error')) {
          errorMessage = 'Dữ liệu không hợp lệ: ' + error.response.data.message;
        } else {
          errorMessage = error?.response?.data?.message || 'Yêu cầu không hợp lệ';
        }
      } else if (error?.response?.status === 404) {
        errorMessage = 'Không tìm thấy khóa học';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Enhanced course enrollment handler
  const handleCourseEnroll = () => {
    console.group('🚀 Handle Course Enroll');
    console.log('courseDetails.isPaid:', courseDetails.isPaid);
    console.log('courseDetails.price:', courseDetails.price);
    console.log('isFreeCourse:', isFreeCourse);
    console.log('Will call:', isFreeCourse ? 'Free Enrollment' : 'VNPay Payment');
    console.groupEnd();

    if (!courseId || !isValidObjectId(courseId)) {
      toast.error('ID khóa học không hợp lệ', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (!courseDetails) {
      toast.error('Không tìm thấy thông tin khóa học', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (isFreeCourse) {
      // Khóa học miễn phí - gọi enroll trực tiếp
      handleConfirmPayment();
    } else {
      // Khóa học trả phí - gọi VNPay payment
      handleVNPayPayment();
    }
  };

  useEffect(() => {
    if (!isFreeCourse) {
      const offerEndTime = new Date(offerExpiration).getTime();
      const currentTime = new Date().getTime();

      const timeRemaining = offerEndTime - currentTime;
      setTimeLeft(timeRemaining);

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 1000 ? prevTime - 1000 : 0));
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isFreeCourse, offerExpiration]);

  return (
    <Fragment>
      <Dialog open={open} size='sm' handler={handleOpen}>
        <DialogHeader>
          <div className='flex items-center justify-center'>
            <ExclamationCircleIcon className='h-8 w-8 text-yellow-500' />
            <Typography
              variant='h5'
              color='gray'
              className='ml-2 font-semibold'
            >
              {isFreeCourse
                ? "Explore Your Free Learning Adventure"
                : "Payment Confirmation"}
            </Typography>
          </div>
        </DialogHeader>
        
        <DialogBody divider>

          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-3 mb-4 rounded text-xs">
              <strong>Debug Info:</strong><br/>
              isPaid: {String(courseDetails.isPaid)} ({typeof courseDetails.isPaid})<br/>
              price: {courseDetails.price}<br/>
              isFreeCourse: {String(isFreeCourse)}<br/>
              courseId: {courseId}<br/>
              courseId valid: {courseId ? String(isValidObjectId(courseId)) : 'N/A'}
            </div>
          )}

          <Typography variant='paragraph' className='font-semibold text-md' color='gray'>
            Please review the details before proceeding:
          </Typography>
          
          <Typography variant='paragraph' color='gray' className='mt-2 mb-1'>
            {isFreeCourse ? (
              <span className='font-semibold text-green-500'>
                This course is free!
              </span>
            ) : (
              <div className="bg-gray-100 p-2">
                <p className="text-lg font-semibold mb-2">🎉 Limited Time Offer 🎉</p>
                <p className="text-xl font-bold mb-2">
                  Price:{" "}
                  <span className="text-green-600">
                    {formatToINR(courseDetails?.price)}
                  </span>{" "}
                  <span className="text-gray-600 line-through">
                    {formatToINR(courseDetails?.price + 100)}
                  </span>
                </p>
                <p className="text-lg">
                  Offer Expires in: 
                  <span className="text-gray-600 font-semibold">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>
            )}
          </Typography>
          
          <Typography variant='paragraph' color='gray'>
            <span className='font-semibold'>Course Overview:</span><br />
            {courseDetails?.overview}
          </Typography>
        </DialogBody>
        
        <DialogFooter>
          <Button  
            variant='gradient'
            color='green'
            onClick={handleCourseEnroll}
            disabled={isLoading} 
            className='w-full'
          >
            {isLoading ? (
              <span className='flex items-center justify-center'>
                <span>Processing...</span>
                <FaSpinner className='animate-spin ml-1' size={20} />
              </span>
            ) : (
              <span>
                {isFreeCourse ? "Start Course" : "Confirm Payment"}
              </span>
            )}
          </Button>
          <Button
            variant='outlined'
            color='blue'
            onClick={handleClose}
            disabled={isLoading} 
            className='w-full mt-2'
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
};

export default PaymentConfirmationModal;