import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import {
  SavedSellerInterface,
  SellerInterface
} from '@src/types/sellerInterface';
import AppError from '../../../utils/appError';
import { SellerDbInterface } from '../../../app/repositories/sellerDbRepository';
import { AuthServiceInterface } from '../../../app/services/authServicesInterface';
import { RefreshTokenDbInterface } from '../../../app/repositories/refreshTokenDBRepository';
import { UploadedFileInterface } from '@src/types/common';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const sellerRegister = async (
  seller: SellerInterface,
  files: Express.Multer.File[],
  sellerRepository: ReturnType<SellerDbInterface>,
  authService: ReturnType<AuthServiceInterface>,
  cloudService: ReturnType<CloudServiceInterface>
) => {
  console.log(files);
  seller.certificates=[]
  // Use object destructuring and default value
  const { password = '', email = '' }: SellerInterface = seller;
  seller.email = email.toLowerCase();

  // Check if the email is already registered
  const isEmailAlreadyRegistered = await sellerRepository.getSellerByEmail(
    seller.email
  );

  if (isEmailAlreadyRegistered) {
    throw new AppError(
      'Seller with the same email already exists..!',
      HttpStatusCodes.CONFLICT
    );
  }


  for (const file of files) {
    let uploadedFile;

    if (file.originalname === 'profilePic') {
      uploadedFile = await cloudService.uploadFile(file);
      seller.profilePic = uploadedFile;
    } else {
      uploadedFile = await cloudService.uploadFile(file);
      seller.certificates.push(uploadedFile);
    }
  }

  // Hash the password if provided
  if (password) {
    seller.password = await authService.hashPassword(password);
  }
  console.log(seller)

  // Add seller to the repository
  const response = await sellerRepository.addSeller(seller);

  return response
    ? { status: true, message: 'Successfully registered!' }
    : { status: false, message: 'Failed to register!' };
};

export const sellerLogin = async (
  email: string,
  password: string,
  sellerRepository: ReturnType<SellerDbInterface>,
  refreshTokenRepository: ReturnType<RefreshTokenDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const seller: SavedSellerInterface | null =
    await sellerRepository.getSellerByEmail(email);
  if (!seller) {
    throw new AppError(
      "Seller doesn't exist, please register",
      HttpStatusCodes.UNAUTHORIZED
    );
  }
  if (!seller.isVerified) {
    throw new AppError(
      'Your details is under verification please try again later',
      HttpStatusCodes.UNAUTHORIZED
    );
  }
  const isPasswordCorrect = await authService.comparePassword(
    password,
    seller.password
  );
  if (!isPasswordCorrect) {
    throw new AppError(
      'Sorry, your password is incorrect. Please try again',
      HttpStatusCodes.UNAUTHORIZED
    );
  }
  const payload = {
    Id: seller._id,
    email: seller.email,
    role: 'seller'
  };
  await refreshTokenRepository.deleteRefreshToken(seller._id);
  const accessToken = authService.generateToken(payload);
  const refreshToken = authService.generateRefreshToken(payload);
  const expirationDate =
    authService.decodedTokenAndReturnExpireDate(refreshToken);
  await refreshTokenRepository.saveRefreshToken(
    seller._id,
    refreshToken,
    expirationDate
  );
  return {
    accessToken,
    refreshToken
  };
};
