import {
  changePasswordService,
  updateProfileService,
  getCustomerDetailsService,
} from "../services/customer";
import { PasswordInfo } from "../types/customer/customer";
import END_POINTS from "../../constants/endpoints";

export const changePassword = (passwordInfo: PasswordInfo) => {
  return changePasswordService(END_POINTS.CHANGE_PASSWORD, passwordInfo);
};

export const updateProfile = (profileInfo: FormData) => {
  return updateProfileService(END_POINTS.UPDATE_PROFILE, profileInfo);
};

export const getCustomerDetails = () => {
  return getCustomerDetailsService(END_POINTS.GET_CUSTOMER_DETAILS);
};

























