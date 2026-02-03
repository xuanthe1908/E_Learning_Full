import express from 'express';
import customerController from '../../../adapters/controllers/customerController';
import { customerDbRepository } from '../../../app/repositories/customerDbRepository';
import { customerRepositoryMongoDB } from '../../../frameworks/database/mongodb/repositories/customersRepoMongoDb';
import { authService } from '../../../frameworks/services/authService';
import { authServiceInterface } from '../../../app/services/authServicesInterface';
import { cloudServiceInterface } from '../../../app/services/cloudServiceInterface';
import { s3Service } from '../../../frameworks/services/s3CloudService';
import upload from '../middlewares/multer';
import { RedisClient } from '@src/app';
import { cachingMiddleware } from '../middlewares/redisCaching';
import { redisCacheRepository } from '../../../frameworks/database/redis/redisCacheRepository';
import { cacheRepositoryInterface } from '../../../app/repositories/cachedRepoInterface';
import jwtAuthMiddleware from '../middlewares/userAuth';
import { contactDbInterface } from '../../../app/repositories/contactDbRepository';
import { contactRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/contactsRepoMongoDb';
import roleCheckMiddleware from '../middlewares/roleCheckMiddleware';

const customerRouter = (redisClient: RedisClient) => {
  const router = express.Router();
  const controller = customerController(
    authServiceInterface,
    authService,
    customerDbRepository,
    customerRepositoryMongoDB,
    contactDbInterface,
    contactRepositoryMongodb,
    cloudServiceInterface,
    s3Service,
    cacheRepositoryInterface,
    redisCacheRepository,
    redisClient
  );
  router.patch(
    '/change-password',
    jwtAuthMiddleware,
    controller.changePassword
  );

  router.put(
    '/update-profile',
    jwtAuthMiddleware,
    upload.single('image'),
    controller.updateProfile
  );

  router.get(
    '/get-customer-details',
    jwtAuthMiddleware,
    cachingMiddleware(redisClient),
    controller.getCustomerDetails
  );

  router.get('/get-all-customers', jwtAuthMiddleware, controller.getAllCustomers);

  router.patch(
    '/block-customer/:customerId',
    jwtAuthMiddleware,
    roleCheckMiddleware('admin'),
    controller.blockCustomer
  );

  router.patch(
    '/unblock-customer/:customerId',
    jwtAuthMiddleware,
    roleCheckMiddleware('admin'),
    controller.unblockCustomer
  );

  router.get(
    '/get-all-blocked-customers',
    jwtAuthMiddleware,
    roleCheckMiddleware('admin'),
    controller.getAllBlockedCustomers
  );

  router.post('/contact-us', controller.addContact);

  return router;
};
export default customerRouter;
