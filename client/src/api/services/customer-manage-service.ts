import CONFIG_KEYS from "../../config";
import api from "../middlewares/protected-interceptor";

export const blockcustomerservice = async (
  endpoint: string,
  customerId: string,
  reason: string
) => {
  const response = await api.patch(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${customerId}`,
    { reason }
  );
  return response.data;
};

export const unblockcustomerservice = async (
  endpoint: string,
  customerId: string
) => {
  const response = await api.patch(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${customerId}`
  );
  return response.data;
};

export const getAllcustomersService = async (endpoint: string) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response.data;
};

export const getAllBlockedcustomersService = async (endpoint: string) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response.data;
};























