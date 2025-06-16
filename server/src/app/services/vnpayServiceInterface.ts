export const vnpayServiceInterface = (service: any) => {
  const createPaymentUrl = (
    amount: number,
    orderInfo: string,
    orderId: string,
    ipAddr: string
  ) => service.createPaymentUrl(amount, orderInfo, orderId, ipAddr);

  const verifyReturnUrl = (vnp_Params: any) => 
    service.verifyReturnUrl(vnp_Params);

  const createQRPayment = async (
    amount: number,
    orderInfo: string,
    orderId: string
  ) => service.createQRPayment(amount, orderInfo, orderId);

  const checkPaymentStatus = async (orderId: string, transDate: string) =>
    service.checkPaymentStatus(orderId, transDate);

  const refundPayment = async (
    orderId: string,
    amount: number,
    transDate: string,
    reason: string
  ) => service.refundPayment(orderId, amount, transDate, reason);

  return {
    createPaymentUrl,
    verifyReturnUrl,
    createQRPayment,
    checkPaymentStatus,
    refundPayment
  };
};

export type VNPayServiceInterface = typeof vnpayServiceInterface;