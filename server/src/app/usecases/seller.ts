import { SellerDbInterface } from '../repositories/sellerDbRepository';
import AppError from '../../utils/appError';
import HttpStatusCodes from '../../constants/HttpStatusCodes';
import { AuthServiceInterface } from '../services/authServicesInterface';
import { SavedSellerInterface } from '@src/types/sellerInterface';
import { CloudServiceInterface } from '../services/cloudServiceInterface';
import { ProductDbRepositoryInterface } from '../repositories/productDbRepository';

export const changePasswordU = async (
  id: string | undefined,
  password: { currentPassword: string; newPassword: string },
  authService: ReturnType<AuthServiceInterface>,
  sellerDbRepository: ReturnType<SellerDbInterface>
) => {
  if (!id) {
    throw new AppError('Invalid Seller', HttpStatusCodes.BAD_REQUEST);
  }
  if (!password.currentPassword) {
    throw new AppError(
      'Please provide current password',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const seller: SavedSellerInterface | null =
    await sellerDbRepository.getSellerById(id);
  if (!seller) {
    throw new AppError('Unauthorized user', HttpStatusCodes.NOT_FOUND);
  }
  const isPasswordCorrect = await authService.comparePassword(
    password.currentPassword,
    seller?.password
  );
  if (!isPasswordCorrect) {
    throw new AppError(
      'Sorry, your current password is incorrect.',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (!password.newPassword) {
    throw new AppError(
      'new password cannot be empty',
      HttpStatusCodes.UNAUTHORIZED
    );
  }
  const hashedPassword = await authService.hashPassword(password.newPassword);
  await sellerDbRepository.changePassword(id, hashedPassword);
};

export const updateProfileU = async (
  id: string | undefined,
  sellerInfo: SavedSellerInterface,
  profilePic: Express.Multer.File,
  cloudService: ReturnType<CloudServiceInterface>,
  sellerDbRepository: ReturnType<SellerDbInterface>
) => {
  if (!id) {
    throw new AppError('Invalid seller', HttpStatusCodes.BAD_REQUEST);
  }
  if (Object.keys(sellerInfo).length === 0) {
    throw new AppError(
      'At least update a single field',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (profilePic) {
    const response = await cloudService.uploadFile(profilePic);
    sellerInfo.profilePic = response;
  }
  await sellerDbRepository.updateProfile(id, sellerInfo);
};

export const getCustomersForSellersU = async (
  sellerId: string|undefined,
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  if (!sellerId) {
    throw new AppError(
      'Please give a seller id',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const customers = await productDbRepository.getCustomersByProductForSeller(
    sellerId
  );
  await Promise.all(
    customers.map(async (customer) => {
      if (customer.profilePic.key) {
        customer.profileUrl = ""
        customer.profileUrl = await cloudService.getFile(customer.profilePic.key);
      }
    })
  );
  return customers;
};
