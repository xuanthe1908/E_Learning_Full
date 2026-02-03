import END_POINTS from "../../constants/endpoints";
import {
  getsellers,
  acceptRequest,
  rejectRequest,
  getAllSeller,
  blockSeller,
  unblockSeller,
  getBlockedSeller,
  getIndividualSeller
} from "../services/seller-manage-service";

export const getAllSellerRequests = () => {
  return getsellers(END_POINTS.GET_SELLER_REQUESTS);
};

export const acceptSellerRequest = (sellerId: string) => {
  return acceptRequest(END_POINTS.ACCEPT_SELLER_REQUESTS, sellerId);
};

export const rejectSellerRequest = (
  sellerId: string,
  reason: string
) => {
  return rejectRequest(
    END_POINTS.REJECT_SELLER_REQUESTS,
    sellerId,
    reason
  );
};

export const getAllSellers = () => {
  return getAllSeller(END_POINTS.GET_SELLERS);
};

export const blockSellers = (sellerId: string, reason: string) => {
  return blockSeller(
    END_POINTS.BLOCK_SELLERS,
    sellerId,
    reason
  );
};

export const unblockSellers = (sellerId: string) => {
  return unblockSeller(END_POINTS.UNBLOCK_SELLERS, sellerId);
};

export const getBlockedSellers = ()=>{
  return getBlockedSeller(END_POINTS.GET_BLOCKED_SELLERS)
}

export const getIndividualSellers = (sellerId:string) =>{
  return getIndividualSeller(END_POINTS.GET_SELLER,sellerId)
}






















