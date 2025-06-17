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
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const offerExpiration = "2023-08-13T22:59:59.000Z";
  
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const handleConfirmPayment = async () => {
    try {
      setIsLoading(true);
      const response = await enrollStudent(courseId ?? "");
      setTimeout(() => {
        setUpdated();
        setIsLoading(false);
        setOpen(false);
        toast.success(response?.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong ", {
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

    const tokenString = localStorage.getItem("accessToken");
    if (!tokenString) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Creating VNPay payment for courseId:', courseId);
      console.log('User logged in:', isLoggedIn);
      console.log('Access token exists:', !!tokenString);
      
      // Gọi API tạo QR payment
      const response = await createVNPayQRPayment(courseId!);
      
      console.log('VNPay payment response:', response);
      
      if (response?.status === 200 && response?.data?.status === 'success') {
        const { qrCode } = response.data.data;
        
        // Đóng modal
        setOpen(false);
        
        // Chuyển hướng trực tiếp đến VNPay
        console.log('Redirecting to VNPay:', qrCode);
        window.location.href = qrCode;
        
      } else {
        throw new Error(response?.data?.message || 'Không thể tạo thanh toán VNPay');
      }
    } catch (error: any) {
      console.error('VNPay payment error:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo thanh toán';
      
      if (error?.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
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

  // ✅ SỬA: Function xử lý enroll course
  const handleCourseEnroll = () => {
    if (courseDetails.isPaid) {
      // ✅ Gọi function thanh toán VNPay
      handleVNPayPayment();
    } else {
      // Khóa học miễn phí - gọi enroll trực tiếp
      handleConfirmPayment();
    }
  };

  const isFreeCourse = courseDetails?.isPaid === false;

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