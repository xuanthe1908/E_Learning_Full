import { SellerRepositoryMongoDb } from '@src/frameworks/database/mongodb/repositories/sellerRepoMongoDb';
import { SellerInterface } from '@src/types/sellerInterface';
import { SavedSellerInterface } from '@src/types/sellerInterface';

export const sellerDbRepository = (
  repository: ReturnType<SellerRepositoryMongoDb>
) => {
  const addSeller = async (seller: SellerInterface) =>
    await repository.addSeller(seller);

  const getSellerByEmail = async (email: string) =>
    await repository.getSellerByEmail(email);

  const getSellerRequests = async () =>
    await repository.getSellerRequests();

  const acceptSellerRequest = async (sellerId: string) =>
    await repository.acceptSellerRequest(sellerId);

  const checkRejected = async (sellerId: string) =>
    await repository.checkRejected(sellerId);

  const rejectSellerRequest = async (
    sellerId: string,
    reason: string
  ) => await repository.rejectSellerRequest(sellerId, reason);

  const getAllSellers = async () => await repository.getAllSellers();

  const blockSellers = async (sellerId: string, reason: string) =>
    await repository.blockSellers(sellerId, reason);

  const unblockSellers = async (sellerId: string) =>
    await repository.unblockSellers(sellerId);

  const getBlockedSellers = async () =>
    await repository.getBlockedSellers();

  const getSellerById = async (sellerId: string) =>
    await repository.getSellerById(sellerId);

  const getTotalNumberOfSellers = async ()=> await repository.getTotalNumberOfSellers()

  const changePassword = async (id:string,password:string)=> await repository.changePassword(id,password)

  const updateProfile = async (id:string,sellerInfo:SavedSellerInterface)=> await repository.updateProfile(id,sellerInfo)

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

export type SellerDbInterface = typeof sellerDbRepository;
