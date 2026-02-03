import api from "../middlewares/protected-interceptor";
import axiosInstance from "../middlewares/interceptor";
import CONFIG_KEYS from "../../config";
export const getsellers = async (endpoint: string) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response;
};

export const acceptRequest = async (endpoint: string, sellerId: string) => {
  const response = await api.patch(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${sellerId}`
  );
  return response;
};

export const rejectRequest = async (
  endpoint: string,
  sellerId: string,
  reason: string
) => {
  const response = await api.put(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    {
      sellerId,
      reason,
    }
  );
  return response;
};

export const getAllSeller = async (endpoint: string) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response;
};

export const blockSeller = async (
  endpoint: string,
  sellerId: string,
  reason: string
) => {
  const response = await api.patch(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    {
      sellerId,
      reason,
    }
  );
  return response;
};

export const unblockSeller = async (
  endpoint: string,
  sellerId: string
) => {
  const response = await api.patch(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${sellerId}`
  );
  return response;
};

export const getBlockedSeller = async (endpoint: string) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response;
};

export const getIndividualSeller = async (endpoint:string,sellerId:string)=>{
  const response = await axiosInstance.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${sellerId}`
  );
  return response;
}























