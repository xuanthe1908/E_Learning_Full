export const vnpayServiceInterface = (service: ReturnType<VNPayServiceInterface>) => ({
  createPaymentUrl: (
    amount: number,
    orderInfo: string,
    orderId: string,
    ipAddr: string
  ) => service.createPaymentUrl(amount, orderInfo, orderId, ipAddr),
  
  verifyReturnUrl: (vnp_Params: any) => service.verifyReturnUrl(vnp_Params),
  
  createQRPayment: (
    amount: number,
    orderInfo: string,
    orderId: string
  ) => service.createQRPayment(amount, orderInfo, orderId)
});

export type VNPayServiceInterface = () => {
  createPaymentUrl: (
    amount: number,
    orderInfo: string,
    orderId: string,
    ipAddr: string
  ) => string;
  verifyReturnUrl: (vnp_Params: any) => boolean;
  createQRPayment: (
    amount: number,
    orderInfo: string,
    orderId: string
  ) => Promise<{
    qrCode: string;
    paymentData: any;
  }>;
};