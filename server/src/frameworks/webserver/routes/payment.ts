import express from 'express';
import { vnpayService } from '../../../frameworks/services/vnpayService';
import { vnpayServiceInterface } from '../../../app/services/vnpayServiceInterface';
import vnpayController from '../../../adapters/controllers/vnpayController';
import { courseDbRepository } from '../../../app/repositories/courseDbRepository';
import { courseRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/courseReposMongoDb';

const paymentRouter = () => {
  const router = express.Router();
  const controller = vnpayController(
      vnpayService,
      vnpayService,
      courseDbRepository,
      courseRepositoryMongodb
    );

  router.post('/vnpay/create-payment-url', controller.createPaymentUrl);
  router.post('/vnpay/create-qr-payment', controller.createQRPayment);
  router.get('/vnpay/return', controller.handleReturn);


  return router;
};

export default paymentRouter;