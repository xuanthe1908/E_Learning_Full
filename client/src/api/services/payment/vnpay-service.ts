import api from "../../middlewares/protected-interceptor"; 

export const createVNPayQRPaymentService = (endpoint: string, productId: string) => {
  return api.post(endpoint, {
    productId
  });
};

export const createVNPayPaymentUrlService = (endpoint: string, productId: string) => {
  return api.post(endpoint, {
    productId
  });
};

export const checkVNPayStatusService = (endpoint: string, orderId: string) => {
  return api.get(`${endpoint}/${orderId}`);
};