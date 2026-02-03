import { AdminRepositoryMongoDb } from '../../frameworks/database/mongodb/repositories/adminRepoMongoDb';
import { AdminDbInterface } from '../../app/repositories/adminDbRepository';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ProductDbRepositoryInterface } from '../../app/repositories/productDbRepository';
import { ProductRepositoryMongoDbInterface } from '../../frameworks/database/mongodb/repositories/productReposMongoDb';
import { SellerDbInterface } from '../../app/repositories/sellerDbRepository';
import { SellerRepositoryMongoDb } from '../../frameworks/database/mongodb/repositories/sellerRepoMongoDb';
import { CustomersDbInterface } from '../../app/repositories/customerDbRepository';
import { CustomerRepositoryMongoDB } from '../../frameworks/database/mongodb/repositories/customersRepoMongoDb';
import {
  getDashBoardDetailsU,
  getGraphDetailsU
} from '../../app/usecases/admin/dashBoardData';
import { PaymentInterface } from '../../app/repositories/paymentDbRepository';
import { PaymentImplInterface } from '../../frameworks/database/mongodb/repositories/paymentRepoMongodb';
import { CategoryDbInterface } from '../../app/repositories/categoryDbRepository';
import { CategoryRepoMongodbInterface } from '../../frameworks/database/mongodb/repositories/categoryRepoMongoDb';

const adminController = (
  adminDbRepository: AdminDbInterface,
  adminDbRepositoryImpl: AdminRepositoryMongoDb,
  productDbRepository: ProductDbRepositoryInterface,
  productDbRepositoryImpl: ProductRepositoryMongoDbInterface,
  sellerDbRepository: SellerDbInterface,
  sellerDbRepositoryImpl: SellerRepositoryMongoDb,
  customerDbRepository: CustomersDbInterface,
  customerDbRepositoryImpl: CustomerRepositoryMongoDB,
  paymentDbRepository: PaymentInterface,
  paymentDbRepositoryImpl: PaymentImplInterface,
  categoryDbRepository: CategoryDbInterface,
  categoryDbRepositoryImpl: CategoryRepoMongodbInterface
) => {
  const dbRepositoryAdmin = adminDbRepository(adminDbRepositoryImpl());
  const dbRepositoryProduct = productDbRepository(productDbRepositoryImpl());
  const dbRepositorySeller = sellerDbRepository(
    sellerDbRepositoryImpl()
  );
  const dbRepositoryCustomer = customerDbRepository(customerDbRepositoryImpl());
  const dbRepositoryPayment = paymentDbRepository(paymentDbRepositoryImpl());
  const dbRepositoryCategory = categoryDbRepository(categoryDbRepositoryImpl());

  const getDashBoardDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const response = await getDashBoardDetailsU(
        dbRepositoryProduct,
        dbRepositorySeller,
        dbRepositoryCustomer,
        dbRepositoryPayment
      );

      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved dashboard details',
        data: response
      });
    }
  );

  const getGraphDetails = asyncHandler(async (req: Request, res: Response) => {
    const response = await getGraphDetailsU(
      dbRepositoryProduct,
      dbRepositoryCategory,
      dbRepositoryPayment
    );
    res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved graph details',
      data: response
    });
  });

  return {
    getDashBoardDetails,
    getGraphDetails
  };
};

export default adminController;
