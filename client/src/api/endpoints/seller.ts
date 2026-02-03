import {
  updateProfileService,
  changePasswordService,
  getMyCustomersService,
  getSellerDetailsService,
} from "../services/seller";
import { PasswordInfo } from "../types/customer/customer";
import END_POINTS from "../../constants/endpoints";

export const changePassword = (passwordInfo: PasswordInfo) => {
  return changePasswordService(
    END_POINTS.SELLER_CHANGE_PASSWORD,
    passwordInfo
  );
};

export const updateProfile = (profileInfo: FormData) => {
  return updateProfileService(
    END_POINTS.SELLER_UPDATE_PROFILE,
    profileInfo
  );
};

export const getMyCustomers = () => {
  return getMyCustomersService(END_POINTS.GET_MY_CUSTOMERS);
};

export const getSellerDetails = ()=>{
  return getSellerDetailsService(END_POINTS.GET_SELLER_DETAILS)
}























