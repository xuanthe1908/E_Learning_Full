import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { VNPayServiceInterface } from '../../app/services/vnpayServiceInterface';
import { VNPayServiceImpl } from '../../frameworks/services/vnpayService';
import { CourseDbRepositoryInterface } from '../../app/repositories/courseDbRepository';
import { CourseRepositoryMongoDbInterface } from '../../frameworks/database/mongodb/repositories/courseReposMongoDb';
import HttpStatusCodes from '../../constants/HttpStatusCodes';
import AppError from '../../utils/appError';

const vnpayController = (
  vnpayServiceInterface: VNPayServiceInterface,
  vnpayServiceImpl: VNPayServiceImpl,
  courseDbInterface: CourseDbRepositoryInterface,
  courseDbImpl: CourseRepositoryMongoDbInterface
) => {
  const vnpayService = vnpayServiceImpl();
  const dbRepositoryCourse = courseDbImpl();

  const createPaymentUrl = asyncHandler(async (req: Request, res: Response) => {
    const { courseId }: { courseId: string } = req.body;
    const ipAddr = req.headers['x-forwarded-for'] as string || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress || 
                   '127.0.0.1';

    if (!courseId) {
      throw new AppError(
        'Please provide valid course information',
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const course = await dbRepositoryCourse.getAmountByCourseId(courseId);
    if (!course?.price) {
      throw new AppError(
        'Course price not found',
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const orderId = uuidv4().replace(/-/g, '').substring(0, 20);
    const orderInfo = `Thanh toan khoa hoc ${courseId}`;
    
    const paymentUrl = vnpayService.createPaymentUrl(
      course.price,
      orderInfo,
      orderId,
      ipAddr
    );

    res.status(200).json({
      status: 'success',
      message: 'Payment URL created successfully',
      data: {
        paymentUrl,
        orderId
      }
    });
  });

  const createQRPayment = asyncHandler(async (req: Request, res: Response) => {
    const { courseId }: { courseId: string } = req.body;

    if (!courseId) {
      throw new AppError(
        'Please provide valid course information',
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const course = await dbRepositoryCourse.getAmountByCourseId(courseId);
    if (!course?.price) {
      throw new AppError(
        'Course price not found',
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const orderId = uuidv4().replace(/-/g, '').substring(0, 20);
    const orderInfo = `Thanh toan khoa hoc ${courseId}`;
    
    const qrPayment = await vnpayService.createQRPayment(
      course.price,
      orderInfo,
      orderId
    );

    res.status(200).json({
      status: 'success',
      message: 'QR payment created successfully',
      data: {
        qrCode: qrPayment.qrCode,
        orderId,
        amount: course.price,
        courseId
      }
    });
  });

  const handleReturn = asyncHandler(async (req: Request, res: Response) => {
    const vnp_Params = req.query;
    
    const isValid = vnpayService.verifyReturnUrl(vnp_Params);
    
    if (isValid) {
      const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
      
      if (vnp_ResponseCode === '00') {
        // Payment successful
        res.status(200).json({
          status: 'success',
          message: 'Payment completed successfully',
          data: {
            orderId: vnp_Params['vnp_TxnRef'],
            amount: vnp_Params['vnp_Amount'],
            transactionId: vnp_Params['vnp_TransactionNo'],
            payDate: vnp_Params['vnp_PayDate']
          }
        });
      } else {
        // Payment failed
        res.status(400).json({
          status: 'failed',
          message: 'Payment failed',
          data: {
            orderId: vnp_Params['vnp_TxnRef'],
            responseCode: vnp_ResponseCode
          }
        });
      }
    } else {
      throw new AppError(
        'Invalid signature',
        HttpStatusCodes.BAD_REQUEST
      );
    }
  });

  return {
    createPaymentUrl,
    createQRPayment,
    handleReturn
  };
};

export default vnpayController;