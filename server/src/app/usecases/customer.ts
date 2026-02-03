import { CustomersDbInterface } from '../repositories/customerDbRepository';
import AppError from '../../utils/appError';
import HttpStatusCodes from '../../constants/HttpStatusCodes';
import { AuthServiceInterface } from '../services/authServicesInterface';
import { CloudServiceInterface } from '../services/cloudServiceInterface';
import {
  CustomerInterface,
  CustomerUpdateInfo
} from '../../types/customerInterface';

export const changePasswordU = async (
  id: string | undefined,
  password: { currentPassword: string; newPassword: string },
  authService: ReturnType<AuthServiceInterface>,
  customerDbRepository: ReturnType<CustomersDbInterface>
) => {
  if (!id) {
    throw new AppError('Invalid customer', HttpStatusCodes.BAD_REQUEST);
  }
  if (!password.currentPassword) {
    throw new AppError(
      'Please provide current password',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const customer: CustomerInterface | null = await customerDbRepository.getCustomer(
    id
  );
  if (!customer) {
    throw new AppError('Unauthorized user', HttpStatusCodes.NOT_FOUND);
  }
  const isPasswordCorrect = await authService.comparePassword(
    password.currentPassword,
    customer?.password
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
  await customerDbRepository.changePassword(id, hashedPassword);
};

export const updateProfileU = async (
  id: string | undefined,
  customerInfo: CustomerUpdateInfo,
  profilePic: Express.Multer.File,
  cloudService: ReturnType<CloudServiceInterface>,
  customerDbRepository: ReturnType<CustomersDbInterface>
) => {
  if (!id) {
    throw new AppError('Invalid customer', HttpStatusCodes.BAD_REQUEST);
  }
  if (Object.keys(customerInfo).length === 0) {
    throw new AppError(
      'At least update a single field',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (profilePic) {
    const response = await cloudService.uploadFile(profilePic);
    customerInfo.profilePic = response;
  }
  await customerDbRepository.updateProfile(id, customerInfo);
};

export const getCustomerDetailsU = async (
  id: string | undefined,
  cloudService: ReturnType<CloudServiceInterface>,
  customerDbRepository: ReturnType<CustomersDbInterface>
) => {
  if (!id) {
    throw new AppError(
      'Please provide a valid customer id',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const customerDetails: CustomerInterface | null =
    await customerDbRepository.getCustomer(id);
  if (customerDetails?.profilePic?.key) {
    customerDetails.profilePic.url = await cloudService.getFile(
      customerDetails.profilePic.key
    );
  }
  if (customerDetails) {
    customerDetails.password = 'no password';
  }
  return customerDetails;
};
