import React, { useState, useEffect, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { formatToINR, formatTime } from "../../../utils/helpers";
import { useEnrollInCourseMutation } from "../../../redux/api/baseApi";
import { createVNPayQRPayment } from "../../../api/endpoints/payment/vnpay";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../../redux/reducers/authSlice";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { getApiErrorMessage } from "../../../utils/CustomApiError";

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
  const cancelButtonRef = useRef(null);
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const offerExpiration = "2023-08-13T22:59:59.000Z";

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [enrollInCourse] = useEnrollInCourseMutation();

  const isFreeCourse =
    courseDetails?.isPaid === false || courseDetails?.price === 0;

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!courseId) {
      toast.error("Course not found", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (!isValidObjectId(courseId)) {
      toast.error("Invalid course ID", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await enrollInCourse(courseId).unwrap();
      setUpdated();
      setOpen(false);
      toast.success(response?.message || "Successfully enrolled in the course!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Unable to enroll. Please try again."),
        { position: toast.POSITION.BOTTOM_RIGHT }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVNPayPayment = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to complete payment", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (!courseId || !isValidObjectId(courseId)) {
      toast.error("Invalid course ID", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    const tokenString = localStorage.getItem("accessToken");
    if (!tokenString) {
      toast.error("Your session has expired. Please log in again", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await createVNPayQRPayment(courseId);

      if (response?.status === 200 && response?.data?.status === "success") {
        const { qrCode } = response.data.data;

        if (!qrCode) {
          throw new Error("Payment URL was not received from the server");
        }

        setOpen(false);
        window.location.href = qrCode;
      } else {
        const errorMessage =
          response?.data?.message || "Unable to create VNPay payment";
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Payment failed. Please try again."), {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseEnroll = () => {
    if (!courseId || !isValidObjectId(courseId)) {
      toast.error("Invalid course ID", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (!courseDetails) {
      toast.error("Course details not found", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (isFreeCourse) {
      handleConfirmPayment();
    } else {
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
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-[9999]'
        initialFocus={cancelButtonRef}
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/60 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-[10000] overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all'>
                <div className='border-b border-gray-200 px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <ExclamationCircleIcon className='h-8 w-8 shrink-0 text-yellow-500' />
                    <Dialog.Title className='text-lg font-semibold text-gray-900'>
                      {isFreeCourse
                        ? "Free Course Enrollment"
                        : "Payment Confirmation"}
                    </Dialog.Title>
                  </div>
                </div>

                <div className='space-y-4 px-6 py-5'>
                  <p className='text-sm font-medium text-gray-700'>
                    Please review the details before proceeding:
                  </p>

                  {isFreeCourse ? (
                    <p className='text-sm font-semibold text-green-600'>
                      This course is free!
                    </p>
                  ) : (
                    <div className='rounded-lg bg-gray-100 p-3 text-sm'>
                      <p className='mb-2 text-base font-semibold'>
                        Limited Time Offer
                      </p>
                      <p className='mb-2 text-lg font-bold'>
                        Price:{" "}
                        <span className='text-green-600'>
                          {formatToINR(courseDetails?.price)}
                        </span>{" "}
                        <span className='text-gray-500 line-through'>
                          {formatToINR(courseDetails?.price + 100)}
                        </span>
                      </p>
                      <p>
                        Offer expires in:{" "}
                        <span className='font-semibold text-gray-700'>
                          {formatTime(timeLeft)}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className='text-sm text-gray-600'>
                    <span className='font-semibold text-gray-800'>
                      Course Overview:
                    </span>
                    <p className='mt-1 leading-relaxed'>{courseDetails?.overview}</p>
                  </div>
                </div>

                <div className='flex flex-col gap-2 border-t border-gray-200 px-6 py-4'>
                  <button
                    type='button'
                    onClick={handleCourseEnroll}
                    disabled={isLoading}
                    className='w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {isLoading ? (
                      <span className='flex items-center justify-center gap-2'>
                        <span>Processing...</span>
                        <FaSpinner className='animate-spin' size={18} />
                      </span>
                    ) : (
                      <span>
                        {isFreeCourse ? "Confirm Enrollment" : "Confirm Payment"}
                      </span>
                    )}
                  </button>
                  <button
                    type='button'
                    ref={cancelButtonRef}
                    onClick={handleClose}
                    disabled={isLoading}
                    className='w-full rounded-lg border border-blue-500 px-4 py-3 text-sm font-semibold text-blue-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PaymentConfirmationModal;
