import express from "express";
import {customerDbRepository} from '../../../app/repositories/customerDbRepository'
import {customerRepositoryMongoDB} from '../../../frameworks/database/mongodb/repositories/customersRepoMongoDb'
import authController from "../../../adapters/controllers/authController";
import { authServiceInterface } from "../../../app/services/authServicesInterface";
import { authService } from "../../services/authService";
import {googleAuthService} from "../../../frameworks/services/googleAuthService"
import { googleAuthServiceInterface } from "../../../app/services/googleAuthServicesInterface";
import {sellerDbRepository} from "../../../app/repositories/sellerDbRepository"
import {sellerRepoMongoDb} from "../../../frameworks/database/mongodb/repositories/sellerRepoMongoDb"
import { adminDbRepository } from "../../../app/repositories/adminDbRepository";
import { adminRepoMongoDb } from "../../../frameworks/database/mongodb/repositories/adminRepoMongoDb";
import { refreshTokenDbRepository } from "../../../app/repositories/refreshTokenDBRepository";
import { refreshTokenRepositoryMongoDB } from "../../../frameworks/database/mongodb/repositories/refreshTokenRepoMongoDb";
import { s3Service } from "../../../frameworks/services/s3CloudService";
import { cloudServiceInterface } from "../../../app/services/cloudServiceInterface";
import upload from "../middlewares/multer";
const authRouter = () => {     
  const router = express.Router();
  
  const controller = authController(
    authServiceInterface,
    authService,
    cloudServiceInterface,
    s3Service,
    customerDbRepository,
    customerRepositoryMongoDB,  
    sellerDbRepository,  
    sellerRepoMongoDb,
    googleAuthServiceInterface,
    googleAuthService,
    adminDbRepository,
    adminRepoMongoDb,
    refreshTokenDbRepository,
    refreshTokenRepositoryMongoDB
  );
  //* Customer
  router.post("/customer-register",controller.registerCustomer)
  router.post("/customer-login", controller.loginCustomer);
  router.post("/login-with-google",controller.loginWithGoogle)
  
  //* Seller
  router.post("/seller/seller-register",upload.array('images'), controller.registerSeller)
  router.post("/seller/seller-login",controller.loginSeller)

  //* Admin 
  router.post("/admin/admin-login",controller.loginAdmin)

  return router;
};

export default authRouter;
