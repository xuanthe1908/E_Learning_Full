import api from "../../middlewares/protected-interceptor";
import CONFIG_KEYS from "../../../config";

export const createVNPayQRPaymentService = async (
  endpoint: string,
  courseId: string
) => {
  const response = await api.post(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    { courseId }
  );
  return response;
};

export const createVNPayPaymentUrlService = async (
  endpoint: string,
  courseId: string
) => {
  const response = await api.post(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    { courseId }
  );
  return response;
};

export const checkVNPayStatusService = async (
  endpoint: string,
  orderId: string
) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${orderId}`
  );
  return response;
};