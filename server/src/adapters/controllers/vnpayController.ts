import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from 'joi';
import { VNPayServiceInterface } from '../../app/services/vnpayServiceInterface';
import { VNPayServiceImpl } from '../../frameworks/services/vnpayService';
import { ProductDbRepositoryInterface } from '../../app/repositories/productDbRepository';
import { ProductRepositoryMongoDbInterface } from '../../frameworks/database/mongodb/repositories/productReposMongoDb';
import { PaymentInterface } from '../../app/repositories/paymentDbRepository';
import { PaymentImplInterface  } from '../../frameworks/database/mongodb/repositories/paymentRepoMongodb';
import HttpStatusCodes from '../../constants/HttpStatusCodes';
import AppError from '../../utils/appError';

// Validation schemas
const createPaymentSchema = Joi.object({
  productId: Joi.string().required().trim(),
});

const vnpayController = (
  vnpayServiceInterface: VNPayServiceInterface,
  vnpayServiceImpl: VNPayServiceImpl,
  productDbInterface: ProductDbRepositoryInterface,
  productDbImpl: ProductRepositoryMongoDbInterface,
  paymentDbInterface: PaymentInterface,
  paymentDbImpl: PaymentImplInterface
) => {
  const vnpayService = vnpayServiceImpl();
  const dbRepositoryProduct = productDbImpl();
  const dbRepositoryPayment = paymentDbImpl();

  const createPaymentUrl = asyncHandler(async (req: Request, res: Response) => {
    // Validate input
    const { error, value } = createPaymentSchema.validate(req.body);
    if (error) {
      throw new AppError(
        `Validation error: ${error.details[0].message}`,
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const { productId } = value;
    const ipAddr = (req.headers['x-forwarded-for'] as string) || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress || 
                   '127.0.0.1';

    try {
      // Get product details
      const product = await dbRepositoryProduct.getAmountByProductId(productId);
      if (!product) {
        throw new AppError(
          'Product not found',
          HttpStatusCodes.NOT_FOUND
        );
      }

      if (!product.price || product.price <= 0) {
        throw new AppError(
          'Invalid product price',
          HttpStatusCodes.BAD_REQUEST
        );
      }

      // Generate unique order ID
      const orderId = generateOrderId();
      const orderInfo = `Thanh toan san pham ${product.title || productId}`;
      
      // Create payment record in database
      const paymentRecord = {
        orderId,
        productId,
        amount: product.price,
        currency: 'VND',
        status: 'pending',
        paymentMethod: 'vnpay',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      };

      await dbRepositoryPayment.createPendingPayment(paymentRecord);
      
      // Create VNPay payment URL
      const paymentUrl = vnpayService.createPaymentUrl(
        product.price,
        orderInfo,
        orderId,
        ipAddr
      );

      res.status(200).json({
        status: 'success',
        message: 'Payment URL created successfully',
        data: {
          paymentUrl,
          orderId,
          amount: product.price,
          expiresAt: paymentRecord.expiresAt
        }
      });
    } catch (error) {
      console.error('Create payment URL error:', error);
      throw new AppError(
        'Failed to create payment URL',
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  });

const createQRPayment = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.user?.id || req.user?.payload?.Id;
  console.log('[VNPay] Customer ID:', customerId ? 'Present' : 'Missing');
  console.log('[VNPay] User object:', req.user ? 'Present' : 'Missing');
  
  const { error, value } = createPaymentSchema.validate(req.body);
  if (error) {
    console.log('[Validation Error]', error.details[0].message);
    throw new AppError(`Validation error: ${error.details[0].message}`, HttpStatusCodes.BAD_REQUEST);
  }

  const { productId } = value;
  console.log('[Step 1] productId:', productId);

  try {
    // Validate VNPay config first
    console.log('[Step 1.5] Validating VNPay configuration...');
    
    const product = await dbRepositoryProduct.getAmountByProductId(productId);
    if (!product) {
      console.log('[Step 2] Product not found in DB');
      throw new AppError('Product not found', HttpStatusCodes.NOT_FOUND);
    }

    console.log('[Step 3] Product:', {
      id: product._id,
      title: product.title,
      price: product.price
    });

    if (!product.price || product.price <= 0) {
      console.log('[Step 4] Invalid price:', product.price);
      throw new AppError('Invalid product price', HttpStatusCodes.BAD_REQUEST);
    }

    const orderId = generateOrderId();
    const orderInfo = `Thanh toan san pham ${product.title || productId}`;
    const paymentRecord: any = {
      orderId,
      productId,
      amount: product.price,
      currency: 'VND',
      status: 'pending',
      paymentMethod: 'vnpay_qr',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    };

    // Only add customerId if it exists
    if (customerId) {
      paymentRecord.customerId = customerId;
    }

    console.log('[Step 5] Saving payment record:', {
      orderId,
      productId,
      customerId: customerId || 'Not provided',
      amount: paymentRecord.amount
    });
    
    await dbRepositoryPayment.createPendingPayment(paymentRecord);

    console.log('[Step 6] Creating QR payment with VNPay...');
    const qrPayment = await vnpayService.createQRPayment(
      product.price,
      orderInfo,
      orderId
    );

    console.log('[Step 7] QR Payment created successfully:', {
      orderId,
      hasQrCode: !!qrPayment.qrCode
    });

    res.status(200).json({
      status: 'success',
      message: 'QR payment created successfully',
      data: {
        qrCode: qrPayment.qrCode,
        orderId,
        amount: product.price,
        productId,
        expiresAt: paymentRecord.expiresAt
      }
    });
  } catch (error: any) {
    console.error('[Step ERROR]', error.message);
    console.error('[💥 QR Payment Error]', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Return more specific error message
    const errorMessage = error.message || 'Failed to create QR payment';
    throw new AppError(
      errorMessage,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

  const checkPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    
    if (!orderId) {
      throw new AppError(
        'Order ID is required',
        HttpStatusCodes.BAD_REQUEST
      );
    }

    try {
      // Get payment record from database
      const paymentRecord = await dbRepositoryPayment.getPaymentByOrderId(orderId);
      if (!paymentRecord) {
        throw new AppError(
          'Payment record not found',
          HttpStatusCodes.NOT_FOUND
        );
      }

      // Check if payment is expired
      if (!paymentRecord.expiresAt || new Date() > paymentRecord.expiresAt) {
        await dbRepositoryPayment.updatePaymentStatus(orderId, 'expired');
        
        res.status(200).json({
          status: 'success',
          message: 'Payment status retrieved',
          data: {
            orderId,
            status: 'expired',
            message: 'Payment has expired'
          }
        });
        return;
      }

      // If already completed or failed, return cached status
      if (['completed', 'failed', 'cancelled'].includes(paymentRecord.status)) {
        res.status(200).json({
          status: 'success',
          message: 'Payment status retrieved',
          data: {
            orderId,
            status: paymentRecord.status,
            amount: paymentRecord.amount,
            transactionId: paymentRecord.transactionId
          }
        });
        return;
      }

      // Query VNPay for current status
      const transDate = formatDateForQuery(paymentRecord.createdAt);
      const vnpayStatus = await vnpayService.checkPaymentStatus(orderId, transDate);
      
      let newStatus = 'pending';
      if (vnpayStatus.vnp_ResponseCode === '00') {
        newStatus = 'completed';
      } else if (vnpayStatus.vnp_ResponseCode && vnpayStatus.vnp_ResponseCode !== '99') {
        newStatus = 'failed';
      }

      // Update payment status if changed
      if (newStatus !== paymentRecord.status) {
        await dbRepositoryPayment.updatePaymentStatus(orderId, newStatus, {
          transactionId: vnpayStatus.vnp_TransactionNo,
          responseCode: vnpayStatus.vnp_ResponseCode
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Payment status retrieved',
        data: {
          orderId,
          status: newStatus,
          amount: paymentRecord.amount,
          transactionId: vnpayStatus.vnp_TransactionNo,
          responseCode: vnpayStatus.vnp_ResponseCode
        }
      });
    } catch (error) {
      console.error('Check payment status error:', error);
      throw new AppError(
        'Failed to check payment status',
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  });

  const handleReturn = asyncHandler(async (req: Request, res: Response) => {
    const vnp_Params = req.query;
    
    // Validate required parameters
    const requiredParams = ['vnp_TxnRef', 'vnp_ResponseCode', 'vnp_SecureHash'];
    for (const param of requiredParams) {
      if (!vnp_Params[param]) {
        throw new AppError(
          `Missing required parameter: ${param}`,
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    const orderId = vnp_Params['vnp_TxnRef'] as string;
    const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'] as string;

    try {
      // Verify signature
      const isValid = vnpayService.verifyReturnUrl(vnp_Params);
      if (!isValid) {
        throw new AppError(
          'Invalid payment signature',
          HttpStatusCodes.BAD_REQUEST
        );
      }

      // Get payment record
      const paymentRecord = await dbRepositoryPayment.getPaymentByOrderId(orderId);
      if (!paymentRecord) {
        throw new AppError(
          'Payment record not found',
          HttpStatusCodes.NOT_FOUND
        );
      }

      const updateData = {
        transactionId: vnp_Params['vnp_TransactionNo'] as string,
        responseCode: vnp_ResponseCode,
        payDate: vnp_Params['vnp_PayDate'] as string,
        updatedAt: new Date()
      };

      if (vnp_ResponseCode === '00') {
        // Payment successful
        await Promise.all([
          dbRepositoryPayment.updatePaymentStatus(orderId, 'completed', updateData),
          dbRepositoryProduct.purchaseProduct(paymentRecord.productId, paymentRecord.customerId)
        ]);

        res.status(200).json({
          status: 'success',
          message: 'Payment completed successfully',
          data: {
            orderId,
            amount: vnp_Params['vnp_Amount'],
            transactionId: vnp_Params['vnp_TransactionNo'],
            payDate: vnp_Params['vnp_PayDate']
          }
        });
      } else {
        // Payment failed
        await dbRepositoryPayment.updatePaymentStatus(orderId, 'failed', updateData);
        
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
          '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.'
        };

        res.status(400).json({
          status: 'failed',
          message: errorMessages[vnp_ResponseCode] || 'Payment failed',
          data: {
            orderId,
            responseCode: vnp_ResponseCode,
            errorMessage: errorMessages[vnp_ResponseCode] || 'Unknown error'
          }
        });
      }
    } catch (error) {
      console.error('Handle return error:', error);
      throw new AppError(
        'Failed to process payment return',
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  });

  const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const vnp_Params = req.body;
    
    try {
      // Verify webhook signature
      const isValid = vnpayService.verifyReturnUrl(vnp_Params);
      if (!isValid) {
        res.status(400).json({ RspCode: '97', Message: 'Invalid signature' });
        return;
      }

      const orderId = vnp_Params['vnp_TxnRef'];
      const responseCode = vnp_Params['vnp_ResponseCode'];

      // Process the webhook
      if (responseCode === '00') {
        await dbRepositoryPayment.updatePaymentStatus(orderId, 'completed', {
          transactionId: vnp_Params['vnp_TransactionNo'],
          responseCode: responseCode,
          payDate: vnp_Params['vnp_PayDate']
        });
      } else {
        await dbRepositoryPayment.updatePaymentStatus(orderId, 'failed', {
          responseCode: responseCode
        });
      }

      // Return success response to VNPay
      res.status(200).json({ RspCode: '00', Message: 'success' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(200).json({ RspCode: '99', Message: 'unknown error' });
    }
  });

  const cancelPayment = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    
    if (!orderId) {
      throw new AppError(
        'Order ID is required',
        HttpStatusCodes.BAD_REQUEST
      );
    }

    try {
      const paymentRecord = await dbRepositoryPayment.getPaymentByOrderId(orderId);
      if (!paymentRecord) {
        throw new AppError(
          'Payment record not found',
          HttpStatusCodes.NOT_FOUND
        );
      }

      if (paymentRecord.status !== 'pending') {
        throw new AppError(
          'Cannot cancel payment that is not pending',
          HttpStatusCodes.BAD_REQUEST
        );
      }

      await dbRepositoryPayment.updatePaymentStatus(orderId, 'cancelled');

      res.status(200).json({
        status: 'success',
        message: 'Payment cancelled successfully',
        data: { orderId }
      });
    } catch (error) {
      console.error('Cancel payment error:', error);
      throw new AppError(
        'Failed to cancel payment',
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  });

  return {
    createPaymentUrl,
    createQRPayment,
    checkPaymentStatus,
    handleReturn,
    handleWebhook,
    cancelPayment
  };
};

// Helper functions
function generateOrderId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5);
  return `${timestamp}${random}`.substring(0, 20); // VNPay limit
}

function formatDateForQuery(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export default vnpayController; 