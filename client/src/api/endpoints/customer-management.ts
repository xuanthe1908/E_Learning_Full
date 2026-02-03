import {
  getAllcustomersService,
  blockcustomerservice,
  unblockcustomerservice,
  getAllBlockedcustomersService,
} from "../services/customer-manage-service";
import END_POINTS from "../../constants/endpoints";

export const getAllcustomers = () => {
  return getAllcustomersService(END_POINTS.GET_ALL_CUSTOMERS);
};

export const blockcustomers = (customerId:string,reason: string) => {
  return blockcustomerservice(END_POINTS.BLOCK_CUSTOMER,customerId, reason);
};

export const unblockStudent = (customerId:string) => {
  return unblockcustomerservice(END_POINTS.UNBLOCK_CUSTOMER,customerId);
};

export const getAllBlockedcustomers = ()=>{
    return getAllBlockedcustomersService(END_POINTS.GET_BLOCKED_CUSTOMERS)
}























