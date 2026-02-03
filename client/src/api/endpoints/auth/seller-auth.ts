import END_POINTS from "../../../constants/endpoints";
import { register,login } from "../../services/auth/seller-auth-services";
import { SellerLoginInfo, SellerRegisterDataInterface } from "../../types/seller/auth-interface";

export const registerSeller = (sellerData:FormData)=>{
  return register(END_POINTS.REGISTER_SELLER,sellerData)
}

export const loginSeller = (sellerData:SellerLoginInfo)=>{
  return login(END_POINTS.LOGIN_SELLER,sellerData)
}























