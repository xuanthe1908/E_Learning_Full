import Seller from '../models/seller';
import mongoose from 'mongoose';
import {
  SellerInterface,
  SavedSellerInterface
} from '@src/types/sellerInterface';
export const sellerRepoMongoDb = () => {
  const addSeller = async (seller: SellerInterface) => {
    return await Seller.create(seller);
  };

  const getSellerByEmail = async (email: string) => {
    const seller: SavedSellerInterface | null =
      await Seller.findOne({ email });
    return seller;
  };

  const getSellerRequests = async () => {
    const sellers: SavedSellerInterface[] | null =
      await Seller.find({ isVerified: false });
    return sellers;
  };

  const acceptSellerRequest = async (sellerId: string) => {
    const response = await Seller.findOneAndUpdate(
      { _id: sellerId },
      { isVerified: true }
    );
    return response;
  };

  const checkRejected = async (sellerId: string) => {
    const result = await Seller.findOne({
      $and: [
        { _id: new mongoose.Types.ObjectId(sellerId) },
        { rejected: true }
      ]
    });
    return result;
  };

  const rejectSellerRequest = async (
    sellerId: string,
    reason: string
  ) => {
    const options = {
      upsert: true,
      new: true
    };

    const update = {
      $set: { rejectedReason: reason, rejected: true }
    };
    const response = await Seller.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(sellerId) },
      update,
      options
    );

    return response;
  };

  const getAllSellers = async () => {
    const sellers: SavedSellerInterface[] | null =
      await Seller.find({});
    return sellers;
  };

  const blockSellers = async (sellerId: string, reason: string) => {
    await Seller.updateOne(
      { _id: new mongoose.Types.ObjectId(sellerId) },
      {
        $set: {
          isBlocked: true,
          blockedReason: reason
        }
      }
    );
    return sellerId;
  };

  const unblockSellers = async (sellerId: string) => {
    await Seller.updateOne(
      { _id: new mongoose.Types.ObjectId(sellerId) },
      {
        $set: {
          isBlocked: false
        }
      }
    );
  };

  const getBlockedSellers = async () => {
    const blockedSellers = await Seller.find({ isBlocked: true });
    return blockedSellers;
  };

  const getSellerById = async (sellerId: string) => {
    const seller:SavedSellerInterface|null = await Seller.findOne({
      _id: new mongoose.Types.ObjectId(sellerId)
    });
    return seller;
  };

  const getTotalNumberOfSellers = async () => {
    const total = await Seller.find().count();
    return total;
  };

  const changePassword = async (id: string, password: string) => {
    await Seller.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { password }
    );
  };

  const updateProfile = async (id: string, sellerInfo: SavedSellerInterface) => {
    await Seller.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { ...sellerInfo }
    );
  };
  return {
    addSeller,
    getSellerByEmail,
    getSellerRequests,
    acceptSellerRequest,
    checkRejected,
    rejectSellerRequest,
    getAllSellers,
    blockSellers,
    unblockSellers,
    getBlockedSellers,
    getSellerById,
    getTotalNumberOfSellers,
    changePassword,
    updateProfile
  };
};

export type SellerRepositoryMongoDb = typeof sellerRepoMongoDb;
