import authInstanceAxios from "../../middlewares/interceptor";
import CONFIG_KEYS from "../../../config";
import {
  SellerLoginInfo,
} from "../../types/seller/auth-interface";

export const register = async (
  endpoint: string,
  instructorData: FormData
) => {
  const response = await authInstanceAxios.post(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    instructorData
  );
  return response;
};

export const login = async (
  endpoint: string,
  loginInfo: SellerLoginInfo
) => {
  const response = await authInstanceAxios.post(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    loginInfo
  );
  return response;
};























