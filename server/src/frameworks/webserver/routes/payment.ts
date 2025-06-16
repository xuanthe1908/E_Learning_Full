import express from 'express';
import { vnpayService } from '../../../frameworks/services/vnpayService';
import { vnpayServiceInterface } from '../../../app/services/vnpayServiceInterface';
import vnpayController from '../../../adapters/controllers/vnpayController';
import { courseDbRepository } from '../../../app/repositories/courseDbRepository';
import { courseRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/courseReposMongoDb';

// Import payment repositories
import { paymentInterface } from '../../../app/repositories/paymentDbRepository';
import { paymentRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/paymentRepoMongodb';

const paymentRouter = () => {
  const router = express.Router();
  
  // Create controller with all 6 required arguments
  const controller = vnpayController(
    vnpayServiceInterface,    // Argument 1: vnpayServiceInterface
    vnpayService,            // Argument 2: vnpayServiceImpl  
    courseDbRepository,      // Argument 3: courseDbInterface
    courseRepositoryMongodb, // Argument 4: courseDbImpl
    paymentInterface,        // Argument 5: paymentDbInterface ← Missing này
    paymentRepositoryMongodb // Argument 6: paymentDbImpl ← Missing này
  );

  // Routes
  router.post('/vnpay/create-payment-url', controller.createPaymentUrl);
  router.post('/vnpay/create-qr-payment', controller.createQRPayment);
  router.get('/vnpay/return', controller.handleReturn);
  router.get('/vnpay/status/:orderId', controller.checkPaymentStatus);

  return router;
};

export default paymentRouter;