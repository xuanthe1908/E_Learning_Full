import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../app/services/authServicesInterface';
import { CustomersDbInterface } from '../../app/repositories/customerDbRepository';
import { CustomerRepositoryMongoDB } from '../../frameworks/database/mongodb/repositories/customersRepoMongoDb';
import {
  customerLogin,
  customerRegister,
  signInWithGoogle
} from '../../app/usecases/auth/customerAuth';
import {
  sellerRegister,
  sellerLogin
} from '../../app/usecases/auth/sellerAuth';
import { SellerDbInterface } from '@src/app/repositories/sellerDbRepository';
import { SellerRepositoryMongoDb } from '@src/frameworks/database/mongodb/repositories/sellerRepoMongoDb';
import { CustomerRegisterInterface } from '@src/types/customerRegisterInterface';
import { GoogleAuthServiceInterface } from '@src/app/services/googleAuthServicesInterface';
import { GoogleAuthService } from '@src/frameworks/services/googleAuthService';
import { SellerInterface } from '@src/types/sellerInterface';
import { adminLogin } from '../../app/usecases/auth/adminAuth';
import { AdminDbInterface } from '@src/app/repositories/adminDbRepository';
import { AdminRepositoryMongoDb } from '@src/frameworks/database/mongodb/repositories/adminRepoMongoDb';
import { RefreshTokenDbInterface } from '@src/app/repositories/refreshTokenDBRepository';
import { RefreshTokenRepositoryMongoDb } from '@src/frameworks/database/mongodb/repositories/refreshTokenRepoMongoDb';
import { CloudServiceImpl } from '@src/frameworks/services/s3CloudService';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';
const authController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  cloudServiceInterface:CloudServiceInterface,
  CloudServiceImpl:CloudServiceImpl,
  customerDbRepository: CustomersDbInterface,
  customerDbRepositoryImpl: CustomerRepositoryMongoDB,
  sellerDbRepository: SellerDbInterface,
  sellerDbRepositoryImpl: SellerRepositoryMongoDb,
  googleAuthServiceInterface: GoogleAuthServiceInterface,
  googleAuthServiceImpl: GoogleAuthService,
  adminDbRepository: AdminDbInterface,
  adminDbRepositoryImpl: AdminRepositoryMongoDb,
  refreshTokenDbRepository: RefreshTokenDbInterface,
  refreshTokenDbRepositoryImpl: RefreshTokenRepositoryMongoDb
) => {
  const dbRepositoryCustomer = customerDbRepository(customerDbRepositoryImpl());
  const dbRepositorySeller = sellerDbRepository(
    sellerDbRepositoryImpl()
  );
  const dbRepositoryAdmin = adminDbRepository(adminDbRepositoryImpl());
  const dbRepositoryRefreshToken = refreshTokenDbRepository(
    refreshTokenDbRepositoryImpl()
  );
  const authService = authServiceInterface(authServiceImpl());
  const cloudService = cloudServiceInterface(CloudServiceImpl())
  const googleAuthService = googleAuthServiceInterface(googleAuthServiceImpl());

  //? CUSTOMER
  const registerCustomer = asyncHandler(async (req: Request, res: Response) => {
    const customer: CustomerRegisterInterface = req.body;
    const { accessToken, refreshToken } = await customerRegister(
      customer,
      dbRepositoryCustomer,
      dbRepositoryRefreshToken,
      authService
    );
    res.status(200).json({
      status: 'success',
      message: 'Successfully registered the user',
      accessToken,
      refreshToken
    });
  });

  const loginCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    const { accessToken, refreshToken } = await customerLogin(
      email,
      password,
      dbRepositoryCustomer,
      dbRepositoryRefreshToken,
      authService
    );
    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      accessToken,
      refreshToken
    });
  });

  const loginWithGoogle = asyncHandler(async (req: Request, res: Response) => {
    const { credential }: { credential: string } = req.body;
    const { accessToken, refreshToken } = await signInWithGoogle(
      credential,
      googleAuthService,
      dbRepositoryCustomer,
      dbRepositoryRefreshToken,
      authService
    );
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in with google',
      accessToken,
      refreshToken
    });
  }); 

  //? SELLER
  const registerSeller = asyncHandler(
    async (req: Request, res: Response) => {
      const files: Express.Multer.File[] = req.files as Express.Multer.File[];
      const seller: SellerInterface = req.body;
      await sellerRegister(
        seller,
        files,
        dbRepositorySeller,
        authService,
        cloudService
      );
      res.status(200).json({
        status: 'success',
        message:
          'Your registration is pending verification by the administrators.You will receive an email once your registration is approved'
      });
    }
  );
  const loginSeller = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    const { accessToken, refreshToken } = await sellerLogin(
      email,
      password,
      dbRepositorySeller,
      dbRepositoryRefreshToken,
      authService
    );
    res.status(200).json({
      status: 'success',
      message: 'Seller logged in successfully',
      accessToken,
      refreshToken
    });
  });

  //? ADMIN
  const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    const { accessToken, refreshToken } = await adminLogin(
      email,
      password,
      dbRepositoryAdmin,
      dbRepositoryRefreshToken,
      authService
    );
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in ',
      accessToken,
      refreshToken
    });
  });

  return {
    loginCustomer,
    registerCustomer,
    loginWithGoogle,
    registerSeller,
    loginSeller,
    loginAdmin
  };
};

export default authController;
