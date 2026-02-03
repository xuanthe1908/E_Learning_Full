import express from 'express';
import adminController from '../../../adapters/controllers/adminController';
import { adminRepoMongoDb } from '../../../frameworks/database/mongodb/repositories/adminRepoMongoDb';
import { adminDbRepository } from '../../../app/repositories/adminDbRepository';
import { productRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/productReposMongoDb';
import { productDbRepository } from '../../../app/repositories/productDbRepository';
import { sellerDbRepository } from '../../../app/repositories/sellerDbRepository';
import { sellerRepoMongoDb } from '../../../frameworks/database/mongodb/repositories/sellerRepoMongoDb';
import { customerDbRepository } from '../../../app/repositories/customerDbRepository';
import { customerRepositoryMongoDB } from '../../../frameworks/database/mongodb/repositories/customersRepoMongoDb';
import { paymentInterface } from '../../../app/repositories/paymentDbRepository';
import { paymentRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/paymentRepoMongodb';
import {  categoryDbInterface } from '../../../app/repositories/categoryDbRepository';
import { categoryRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/categoryRepoMongoDb';

const adminRouter = () => {
  const router = express.Router();
  const controller = adminController(
    adminDbRepository,
    adminRepoMongoDb,
    productDbRepository,
    productRepositoryMongodb,
    sellerDbRepository,
    sellerRepoMongoDb,
    customerDbRepository,
    customerRepositoryMongoDB ,
    paymentInterface,
    paymentRepositoryMongodb,
    categoryDbInterface,
    categoryRepositoryMongodb
  );

  router.get("/dashboard-details",controller.getDashBoardDetails)
 
  router.get('/graph-data',controller.getGraphDetails)

  return router;
};

export default adminRouter;
