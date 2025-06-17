import express from 'express';
import { vnpayService } from '../../../frameworks/services/vnpayService';
import { vnpayServiceInterface } from '../../../app/services/vnpayServiceInterface';
import vnpayController from '../../../adapters/controllers/vnpayController';
import { courseDbRepository } from '../../../app/repositories/courseDbRepository';
import { courseRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/courseReposMongoDb';

import { paymentInterface } from '../../../app/repositories/paymentDbRepository';
import { paymentRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/paymentRepoMongodb';

import jwtAuthMiddleware from '../middlewares/userAuth';

const paymentRouter = () => {
  const router = express.Router();
  
  // Create controller with all 6 required arguments
  const controller = vnpayController(
    vnpayServiceInterface,    // Argument 1: vnpayServiceInterface
    vnpayService,            // Argument 2: vnpayServiceImpl  
    courseDbRepository,      // Argument 3: courseDbInterface
    courseRepositoryMongodb, // Argument 4: courseDbImpl
    paymentInterface,        // Argument 5: paymentDbInterface
    paymentRepositoryMongodb // Argument 6: paymentDbImpl
  );

  // ✅ SỬA: Routes với authentication middleware
  router.post('/vnpay/create-payment-url', jwtAuthMiddleware, controller.createPaymentUrl);
  router.post('/vnpay/create-qr-payment', jwtAuthMiddleware, controller.createQRPayment); // ✅ THÊM auth
  router.get('/vnpay/return', controller.handleReturn); // ✅ Không cần auth cho return URL
  router.get('/vnpay/status/:orderId', jwtAuthMiddleware, controller.checkPaymentStatus); // ✅ THÊM auth

  return router;
};

export default paymentRouter;