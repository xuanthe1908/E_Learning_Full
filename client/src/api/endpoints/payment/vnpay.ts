import {
  createVNPayQRPaymentService,
  createVNPayPaymentUrlService,
  checkVNPayStatusService,
} from "../../services/payment/vnpay-service";
import END_POINTS from "../../../constants/endpoints";

export const createVNPayQRPayment = (productId: string) => {
  return createVNPayQRPaymentService(END_POINTS.PAY_USING_VNPAY_QR, productId);
};

export const createVNPayPaymentUrl = (productId: string) => {
  return createVNPayPaymentUrlService(END_POINTS.PAY_USING_VNPAY_URL, productId);
};

export const checkVNPayStatus = (orderId: string) => {
  return checkVNPayStatusService(END_POINTS.CHECK_VNPAY_STATUS, orderId);
};






















