import { CustomersDbInterface } from '../../app/repositories/customerDbRepository';
import { CustomerRepositoryMongoDB } from '../../frameworks/database/mongodb/repositories/customersRepoMongoDb';
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../app/services/authServicesInterface';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { CustomRequest } from '../../types/customRequest';
import {
  changePasswordU,
  getCustomerDetailsU,
  updateProfileU
} from '../../app/usecases/customer';
import { CustomerUpdateInfo } from '../../types/customerInterface';
import { CloudServiceInterface } from '../../app/services/cloudServiceInterface';
import { CloudServiceImpl } from '../../frameworks/services/s3CloudService';
import {
  blockCustomerU,
  getAllBlockedCustomersU,
  getAllCustomersU,
  unblockCustomerU
} from '../../app/usecases/management/customerManagement';
import { RedisClient } from '../../app';
import { CacheRepositoryInterface } from '../../app/repositories/cachedRepoInterface';
import { RedisRepositoryImpl } from '../../frameworks/database/redis/redisCacheRepository';
import { addContactU } from '../../app/usecases/contact';
import { ContactInterface } from '../../types/contact';
import { ContactDbInterface } from '../../app/repositories/contactDbRepository';
import { ContactRepoImpl } from '../../frameworks/database/mongodb/repositories/contactsRepoMongoDb';

const customerController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  customerDbRepository: CustomersDbInterface,
  customerDbRepositoryImpl: CustomerRepositoryMongoDB,
  contactDbRepository: ContactDbInterface,
  contactDbRepositoryImpl: ContactRepoImpl,
  cloudServiceInterface: CloudServiceInterface,
  cloudServiceImpl: CloudServiceImpl,
  cacheDbRepository: CacheRepositoryInterface,
  cacheDbRepositoryImpl: RedisRepositoryImpl,
  cacheClient: RedisClient
) => {
  const dbRepositoryCustomer = customerDbRepository(customerDbRepositoryImpl());
  const dbRepositoryCache = cacheDbRepository(
    cacheDbRepositoryImpl(cacheClient)
  );
  const dbRepositoryContact = contactDbRepository(contactDbRepositoryImpl());

  const authService = authServiceInterface(authServiceImpl());
  const cloudService = cloudServiceInterface(cloudServiceImpl());
  const changePassword = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const passwordInfo: { currentPassword: string; newPassword: string } =
        req.body;
      const customerId: string | undefined = req.user?.Id;
      await changePasswordU(
        customerId,
        passwordInfo,
        authService,
        dbRepositoryCustomer
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully reset password',
        data: null
      });
    }
  );

  const updateProfile = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const customerInfo: CustomerUpdateInfo = req.body;
      const customerId: string | undefined = req.user?.Id;
      const profilePic: Express.Multer.File = req.file as Express.Multer.File;
      await updateProfileU(
        customerId,
        customerInfo,
        profilePic,
        cloudService,
        dbRepositoryCustomer
      );
      await dbRepositoryCache.clearCache(customerId ?? '');
      res.status(200).json({
        status: 'success',
        message: 'Successfully updated your profile',
        data: null
      });
    }
  );

  const getCustomerDetails = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const customerId: string | undefined = req.user?.Id;
      const customerDetails = await getCustomerDetailsU(
        customerId,
        cloudService,
        dbRepositoryCustomer
      );
      const cacheOptions = {
        key: `${customerId}`,
        expireTimeSec: 600,
        data: JSON.stringify(customerDetails)
      };
      await dbRepositoryCache.setCache(cacheOptions);
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved customer details',
        data: customerDetails
      });
    }
  );

  const getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
    const customers = await getAllCustomersU(cloudService, dbRepositoryCustomer);
    res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved all customer details',
      data: customers
    });
  });

  const blockCustomer = asyncHandler(async (req: Request, res: Response) => {
    const customerId: string = req.params.customerId;
    const reason: string = req.body.reason;
    await blockCustomerU(customerId, reason, dbRepositoryCustomer);
    res.status(200).json({
      status: 'success',
      message: 'Successfully blocked customer ',
      data: null
    });
  });

  const unblockCustomer = asyncHandler(async (req: Request, res: Response) => {
    const customerId: string = req.params.customerId;
    await unblockCustomerU(customerId, dbRepositoryCustomer);
    res.status(200).json({
      status: 'success',
      message: 'Successfully unblocked customer ',
      data: null
    });
  });

  const getAllBlockedCustomers = asyncHandler(
    async (req: Request, res: Response) => {
      const customers = await getAllBlockedCustomersU(
        cloudService,
        dbRepositoryCustomer
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully unblocked customer ',
        data: customers
      });
    }
  );

  const addContact = asyncHandler(async (req: Request, res: Response) => {
    const contactInfo: ContactInterface = req.body;
    await addContactU(contactInfo, dbRepositoryContact);
    res.status(200).json({
      status: 'success',
      message: 'Successfully Submitted your response ',
      data: null
    });
  });

  return {
    changePassword,
    updateProfile,
    getCustomerDetails,
    blockCustomer,
    unblockCustomer,
    getAllCustomers,
    getAllBlockedCustomers,
    addContact
  };
};

export default customerController;
