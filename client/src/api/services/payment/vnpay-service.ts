import api from "../../middlewares/protected-interceptor";

export const createVNPayQRPaymentService = async (url: string, courseId: string) => {
  try {
    const response = await api.post(url, { courseId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createVNPayPaymentUrlService = async (url: string, courseId: string) => {
  try {
    const response = await api.post(url, { courseId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkVNPayStatusService = async (url: string, orderId: string) => {
  try {
    const response = await api.get(`${url}/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};