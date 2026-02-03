import { ProductDbRepositoryInterface } from '../../repositories/productDbRepository';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { PaymentInterface } from '@src/app/repositories/paymentDbRepository';
import { PaymentInfo } from '@src/types/payment';

export const purchaseProductU = async (
  productId: string,
  customerId: string,
  paymentInfo: any,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>,
  paymentDbRepository: ReturnType<PaymentInterface>
) => {
  if (!productId) {
    throw new AppError(
      'Please provide product details',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (!customerId) {
    throw new AppError(
      'Please provide valid customer details',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  
  const product = await productDbRepository.getProductById(productId);
  
  if (product?.isPaid) {
    let payment: any;
    
    // Xử lý khác nhau cho Stripe và VNPay
    if (paymentInfo.paymentMethod === 'vnpay') {
      // VNPay payment structure
      payment = {
        paymentId: paymentInfo.orderId,
        productId: productId,
        customerId: customerId,
        amount: paymentInfo.amount,
        currency: 'VND',
        payment_method: 'vnpay',
        status: paymentInfo.status || 'completed'
      };
    } else {
      // Stripe payment structure (legacy)
      payment = {
        paymentId: paymentInfo.id,
        productId: productId,
        customerId: customerId,
        amount: paymentInfo.amount / 100,
        currency: paymentInfo.currency,
        payment_method: paymentInfo.payment_method,
        status: paymentInfo.status
      };
    }
    
    await Promise.all([
      productDbRepository.purchaseProduct(productId, customerId),
      paymentDbRepository.savePayment(payment)
    ]);
  } else {
    // Free product
    await productDbRepository.purchaseProduct(productId, customerId);
  }
};