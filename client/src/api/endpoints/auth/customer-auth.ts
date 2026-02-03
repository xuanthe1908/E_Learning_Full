import { login,register,googleLoginCustomer } from "../../services/auth/customer-auth-services";
import END_POINTS from "../../../constants/endpoints";

export const loginCustomer = (customerData: any) => {
  return login(END_POINTS.LOGIN_CUSTOMER, customerData);
};

export const registerCustomer = (customerData:any)=>{
  return register(END_POINTS.REGISTER_CUSTOMER,customerData)
}

export const googleLogin = (credential:string) =>{
  return googleLoginCustomer(END_POINTS.GOOGLE_LOGIN_CUSTOMER,credential)

}























