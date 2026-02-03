import express from 'express';
import { sellerRepoMongoDb } from '../../../frameworks/database/mongodb/repositories/sellerRepoMongoDb';
import { sendEmailServiceInterface } from '../../../app/services/sendEmailServiceInterface';
import { sendEmailService } from '../../../frameworks/services/sendEmailService';
import { sellerDbRepository } from '../../../app/repositories/sellerDbRepository';
import sellerController from '../../../adapters/controllers/sellerController';
import { authService } from '../../../frameworks/services/authService';
import { authServiceInterface } from '../../../app/services/authServicesInterface';
import { cloudServiceInterface } from '../../../app/services/cloudServiceInterface';
import { s3Service } from '../../../frameworks/services/s3CloudService';
import roleCheckMiddleware from '../middlewares/roleCheckMiddleware';
import jwtAuthMiddleware from '../middlewares/userAuth';
import upload from '../middlewares/multer';
import { productDbRepository } from '../../../app/repositories/productDbRepository';
import { productRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/productReposMongoDb';

const sellerRouter = () => {
  const router = express.Router();
  const controller = sellerController(
    authServiceInterface,
    authService,
    sellerDbRepository,
    sellerRepoMongoDb,
    productDbRepository,
    productRepositoryMongodb,
    sendEmailServiceInterface,
    sendEmailService,
    cloudServiceInterface,
    s3Service
  );
  //* Seller management
  router.get('/view-seller-requests', controller.getSellerRequests);

  router.patch(
    '/accept-seller-request/:sellerId',
    controller.verifySeller
  );

  router.put('/reject-seller-request', controller.rejectRequest);

  router.get('/get-all-sellers', controller.getAllSeller);

  router.patch(
    '/get-all-sellers/block-sellers',
    controller.blockSeller
  );

  router.patch(
    '/get-all-sellers/unblock-sellers/:sellerId',
    controller.unblockSeller
  );

  router.get('/get-blocked-sellers', controller.getBlockedSeller);

  router.get('/view-seller/:sellerId', controller.getSellerById);

  router.get(
    '/get-seller-details',
    jwtAuthMiddleware,
    roleCheckMiddleware('seller'),
    controller.getSellerDetails
  );

  router.put(
    '/update-profile',
    jwtAuthMiddleware,
    upload.single('image'),
    roleCheckMiddleware('seller'),
    controller.updateProfile
  );

  router.patch(
    '/change-password',
    jwtAuthMiddleware,
    roleCheckMiddleware('seller'),
    controller.changePassword
  );

  router.get(
    '/get-customers-by-seller',
    jwtAuthMiddleware,
    controller.getCustomersForSellers
  );

  return router;
};

export default sellerRouter;
