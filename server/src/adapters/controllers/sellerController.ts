import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  getAllSellerRequests,
  acceptSellerRequest,
  rejectSellerRequest,
  getAllSellers,
  blockSellers,
  unblockSellers,
  getBlockedSellers,
  getSellerByIdUseCase
} from '../../app/usecases/management/sellerManagement';
import { SendEmailService } from '../../frameworks/services/sendEmailService';
import { SendEmailServiceInterface } from '../../app/services/sendEmailServiceInterface';
import { SellerDbInterface } from '../../app/repositories/sellerDbRepository';
import { SellerRepositoryMongoDb } from '../../frameworks/database/mongodb/repositories/sellerRepoMongoDb';
import { CustomRequest } from '../../types/customRequest';
import { CloudServiceInterface } from '../../app/services/cloudServiceInterface';
import { CloudServiceImpl } from '../../frameworks/services/s3CloudService';
import {
  changePasswordU,
  getCustomersForSellersU,
  updateProfileU
} from '../../app/usecases/seller';
import { AuthServiceInterface } from '../../app/services/authServicesInterface';
import { AuthService } from '../../frameworks/services/authService';
import { ProductRepositoryMongoDbInterface } from '@src/frameworks/database/mongodb/repositories/productReposMongoDb';
import { ProductDbRepositoryInterface } from '@src/app/repositories/productDbRepository';
const sellerController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  sellerDbRepository: SellerDbInterface,
  sellerDbRepositoryImpl: SellerRepositoryMongoDb,
  productDbRepository: ProductDbRepositoryInterface,
  productDbRepositoryImpl: ProductRepositoryMongoDbInterface,
  emailServiceInterface: SendEmailServiceInterface,
  emailServiceImpl: SendEmailService,
  cloudServiceInterface: CloudServiceInterface,
  cloudServiceImpl: CloudServiceImpl
) => {
  const authService = authServiceInterface(authServiceImpl());
  const dbRepositorySeller = sellerDbRepository(
    sellerDbRepositoryImpl()
  );
  const dbRepositoryProduct = productDbRepository(productDbRepositoryImpl());
  const emailService = emailServiceInterface(emailServiceImpl());
  const cloudService = cloudServiceInterface(cloudServiceImpl());

  //? SELLER MANAGEMENT
  const getSellerRequests = asyncHandler(
    async (req: Request, res: Response) => {
      const response = await getAllSellerRequests(dbRepositorySeller);
      res.json({
        status: 'success',
        message: 'Successfully retrieved all seller requests',
        data: response
      });
    }
  );

  const verifySeller = asyncHandler(async (req: Request, res: Response) => {
    const sellerId: string = req.params.sellerId;
    const response = await acceptSellerRequest(
      sellerId,
      dbRepositorySeller,
      emailService
    );
    res.json({
      status: 'success',
      message: 'Successfully accepted seller request',
      data: response
    });
  });

  const rejectRequest = asyncHandler(async (req: Request, res: Response) => {
    const { sellerId, reason }: { sellerId: string; reason: string } =
      req.body;
    const response = await rejectSellerRequest(
      sellerId,
      reason,
      dbRepositorySeller,
      emailService
    );
    res.json({
      status: 'success',
      message: 'Successfully rejected seller request',
      data: response
    });
  });

  const getAllSeller = asyncHandler(async (req: Request, res: Response) => {
    const sellers = await getAllSellers(
      cloudService,
      dbRepositorySeller
    );
    res.json({
      status: 'success',
      message: 'Successfully fetched all seller information',
      data: sellers
    });
  });

  const blockSeller = asyncHandler(async (req: Request, res: Response) => {
    const { sellerId, reason }: { sellerId: string; reason: string } =
      req.body;
    const response = await blockSellers(
      sellerId,
      reason,
      dbRepositorySeller
    );
    res.json({
      status: 'success',
      message: 'Successfully blocked the seller',
      data: response
    });
  });

  const unblockSeller = asyncHandler(
    async (req: Request, res: Response) => {
      const sellerId: string = req.params.sellerId;
      const response = await unblockSellers(
        sellerId,
        dbRepositorySeller
      );
      res.json({
        status: 'success',
        message: 'Successfully unblocked the seller',
        data: response
      });
    }
  );

  const getBlockedSeller = asyncHandler(
    async (req: Request, res: Response) => {
      const response = await getBlockedSellers(
        cloudService,
        dbRepositorySeller
      );
      res.json({
        status: 'success',
        message: 'Successfully fetched blocked sellers',
        data: response
      });
    }
  );

  const getSellerById = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      let sellerId = req.params.sellerId;
      const response = await getSellerByIdUseCase(
        sellerId,
        cloudService,
        dbRepositorySeller
      );
      res.json({
        status: 'success',
        message: 'Successfully fetched seller info',
        data: response
      });
    }
  );

  const updateProfile = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const sellerId = req.user?.Id;
      const sellerInfo = req.body;
      const profilePic: Express.Multer.File = req.file as Express.Multer.File;
      await updateProfileU(
        sellerId,
        sellerInfo,
        profilePic,
        cloudService,
        dbRepositorySeller
      );
      res.json({
        status: 'success',
        message: 'Successfully updated profile',
        data: null
      });
    }
  );

  const changePassword = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const passwordInfo: { currentPassword: string; newPassword: string } =
        req.body;
      const sellerId: string | undefined = req.user?.Id;
      await changePasswordU(
        sellerId,
        passwordInfo,
        authService,
        dbRepositorySeller
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully reset password',
        data: null
      });
    }
  );

  const getCustomersForSellers = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const sellerId: string | undefined = req.user?.Id;
      const customers = await getCustomersForSellersU(
        sellerId,
        cloudService,
        dbRepositoryProduct
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved all customers',
        data: customers
      });
    }
  );

  const getSellerDetails = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const sellerId = req.user?.Id;
      const seller = await getSellerByIdUseCase(
        sellerId ?? '',
        cloudService,
        dbRepositorySeller
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved seller details...',
        data: seller
      });
    }
  );

  return {
    getSellerRequests,
    verifySeller,
    rejectRequest,
    getAllSeller,
    blockSeller,
    unblockSeller,
    getBlockedSeller,
    getSellerById,
    updateProfile,
    changePassword,
    getCustomersForSellers,
    getSellerDetails
  };
};

export default sellerController;
