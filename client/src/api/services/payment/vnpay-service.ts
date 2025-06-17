import api from "../../middlewares/protected-interceptor"; 

export const createVNPayQRPaymentService = (endpoint: string, courseId: string) => {
  return api.post(endpoint, {
    courseId
  });
};

export const createVNPayPaymentUrlService = (endpoint: string, courseId: string) => {
  return api.post(endpoint, {
    courseId
  });
};

export const checkVNPayStatusService = (endpoint: string, orderId: string) => {
  return api.get(`${endpoint}/${orderId}`);
};