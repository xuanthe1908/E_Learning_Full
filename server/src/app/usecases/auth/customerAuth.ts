import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import { CustomerInterface } from '../../../types/customerInterface';
import AppError from '../../../utils/appError';
import { CustomersDbInterface } from '../../repositories/customerDbRepository';
import { AuthServiceInterface } from '../../services/authServicesInterface';
import { CustomerRegisterInterface } from '../../../types/customerRegisterInterface';
import { GoogleAuthServiceInterface } from '../../../app/services/googleAuthServicesInterface';
import { RefreshTokenDbInterface } from '../../../app/repositories/refreshTokenDBRepository';
export const customerRegister = async (
  customer: CustomerRegisterInterface,
  customerRepository: ReturnType<CustomersDbInterface>,
  refreshTokenRepository: ReturnType<RefreshTokenDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  customer.email = customer?.email?.toLowerCase();
  const isEmailAlreadyRegistered = await customerRepository.getCustomerByEmail(
    customer.email
  );
  if (isEmailAlreadyRegistered) {
    throw new AppError(
      'User with same email already exists...!',
      HttpStatusCodes.CONFLICT
    );
  }
  if (customer.password) {
    customer.password = await authService.hashPassword(customer.password);
  }
  if (customer.interests) {
    const interests: Array<string> = [];
    customer.interests.map((interest: any) => interests.push(interest.label));
    customer.interests = interests;
  }

  const { _id: customerId, email } = await customerRepository.addCustomer(customer);
  const payload = {
    Id: customerId,
    email,
    role: 'customer'
  };
  const accessToken = authService.generateToken(payload);
  const refreshToken = authService.generateRefreshToken(payload);
  const expirationDate =
    authService.decodedTokenAndReturnExpireDate(refreshToken);
  await refreshTokenRepository.saveRefreshToken(
    customerId,
    refreshToken,
    expirationDate
  );
  return { accessToken, refreshToken };
};

export const customerLogin = async (
  email: string,
  password: string,
  customerRepository: ReturnType<CustomersDbInterface>,
  refreshTokenRepository: ReturnType<RefreshTokenDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const customer: CustomerInterface | null =
    await customerRepository.getCustomerByEmail(email);
  if (!customer) {
    throw new AppError("this user doesn't exist", HttpStatusCodes.NOT_FOUND);
  }
  const isPasswordCorrect = await authService.comparePassword(
    password,
    customer.password
  );
  if (!isPasswordCorrect) {
    throw new AppError(
      'Sorry, your password is incorrect. Please try again',
      HttpStatusCodes.UNAUTHORIZED
    );
  }
  const payload = {
    Id: customer._id,
    email: customer.email,
    role: 'customer'
  };
  await refreshTokenRepository.deleteRefreshToken(customer._id);
  const accessToken = authService.generateToken(payload);
  const refreshToken = authService.generateRefreshToken(payload);
  const expirationDate =
    authService.decodedTokenAndReturnExpireDate(refreshToken);
  await refreshTokenRepository.saveRefreshToken(
    customer._id,
    refreshToken,
    expirationDate
  );

  return { accessToken, refreshToken };
};

export const signInWithGoogle = async (
  credential: string,
  googleAuthService: ReturnType<GoogleAuthServiceInterface>,
  customerRepository: ReturnType<CustomersDbInterface>,
  refreshTokenRepository: ReturnType<RefreshTokenDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const user = await googleAuthService.verify(credential);
  const isUserExist = await customerRepository.getCustomerByEmail(user.email);
  if (isUserExist) {
    const payload = {
      Id: isUserExist._id,
      email: isUserExist.email,
      role: 'customer'
    };
    await refreshTokenRepository.deleteRefreshToken(isUserExist._id);
    const accessToken = authService.generateToken(payload);
    const refreshToken = authService.generateRefreshToken(payload);
    const expirationDate =
      authService.decodedTokenAndReturnExpireDate(refreshToken);
    await refreshTokenRepository.saveRefreshToken(
      isUserExist._id,
      refreshToken,
      expirationDate
    );
    return { accessToken, refreshToken };
  } else {
    const { _id: userId, email } = await customerRepository.addCustomer(user);
    const payload = { Id: userId, email, role: 'customer' };
    const accessToken = authService.generateToken(payload);
    const refreshToken = authService.generateRefreshToken(payload);
    const expirationDate =
      authService.decodedTokenAndReturnExpireDate(refreshToken);
    await refreshTokenRepository.saveRefreshToken(
      userId,
      refreshToken,
      expirationDate
    );
    return { accessToken, refreshToken };
  }
};
