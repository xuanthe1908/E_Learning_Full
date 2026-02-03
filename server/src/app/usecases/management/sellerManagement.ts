import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { SendEmailService } from '@src/frameworks/services/sendEmailService';
import { SellerDbInterface } from '@src/app/repositories/sellerDbRepository';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';
export const getAllSellerRequests = async (
  sellerRepository: ReturnType<SellerDbInterface>
) => {
  const allRequests = await sellerRepository.getSellerRequests();
  if (allRequests.length === 0) {
    return null;
  }
  return allRequests;
};

export const acceptSellerRequest = async (
  sellerId: string,
  sellerRepository: ReturnType<SellerDbInterface>,
  emailService: ReturnType<SendEmailService>
) => {
  if (!sellerId) {
    throw new AppError('Invalid seller id', HttpStatusCodes.BAD_REQUEST);
  }
  const response = await sellerRepository.acceptSellerRequest(
    sellerId
  );
  if (response) {
    emailService.sendEmail(
      response.email,
      'Successfully verified your profile',
      'You are verified'
    );
  }
  return response;
};

export const rejectSellerRequest = async (
  sellerId: string,
  reason: string,
  sellerRepository: ReturnType<SellerDbInterface>,
  emailService: ReturnType<SendEmailService>
) => {
  if (!sellerId || !reason) {
    throw new AppError(
      'SellerId or reason cannot be empty',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const rejected = await sellerRepository.checkRejected(sellerId);
  if (rejected) {
    throw new AppError(
      'Already rejected this request',
      HttpStatusCodes.CONFLICT
    );
  }
  const response = await sellerRepository.rejectSellerRequest(
    sellerId,
    reason
  );
  if (response) {
    emailService.sendEmail(
      response.email,
      'Sorry your request is rejected',
      reason
    );
  }
  return response;
};

export const getAllSellers = async (
  cloudService: ReturnType<CloudServiceInterface>,
  sellerRepository: ReturnType<SellerDbInterface>
) => {
  const sellers = await sellerRepository.getAllSellers();
  await Promise.all(
    sellers.map(async (seller) => {
      if (seller.profilePic) {
        seller.profileUrl = await cloudService.getFile(
          seller.profilePic.key ?? ''
        );
      }
    })
  );
  return sellers;
};

export const blockSellers = async (
  sellerId: string,
  reason: string,
  sellerRepository: ReturnType<SellerDbInterface>
) => {
  if (!sellerId || !reason) {
    throw new AppError(
      'Please provide seller id and reason',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const response = await sellerRepository.blockSellers(
    sellerId,
    reason
  );
  return response;
};

export const unblockSellers = async (
  sellerId: string,
  sellerRepository: ReturnType<SellerDbInterface>
) => {
  if (!sellerId) {
    throw new AppError('Invalid seller id', HttpStatusCodes.BAD_REQUEST);
  }
  const response = await sellerRepository.unblockSellers(sellerId);
  return response;
};

export const getBlockedSellers = async (
  cloudService: ReturnType<CloudServiceInterface>,
  sellerRepository: ReturnType<SellerDbInterface>
) => {
  const blockedSellers = await sellerRepository.getBlockedSellers();
  await Promise.all(
    blockedSellers.map(async (seller) => {
      if (seller.profilePic) {
        seller.profileUrl = await cloudService.getFile(
          seller.profilePic.key ?? ''
        );
      }
    })
  );
  return blockedSellers;
};

export const getSellerByIdUseCase = async (
  sellerId: string,
  cloudService: ReturnType<CloudServiceInterface>,
  sellerRepository: ReturnType<SellerDbInterface>
) => {
  if (!sellerId) {
    throw new AppError('Invalid seller id', HttpStatusCodes.BAD_REQUEST);
  }
  const seller = await sellerRepository.getSellerById(sellerId);
  if (seller?.profilePic.key) {
    const profilePic = await cloudService.getFile(seller?.profilePic.key);
    seller.profileUrl = profilePic;
  }
  if (seller) {
    seller.password = 'no password';
  }
  return seller;
};
