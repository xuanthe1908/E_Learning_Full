import express from 'express';
import productController from '../../../adapters/controllers/productController';
import { productRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/productReposMongoDb';
import { productDbRepository } from '../../../app/repositories/productDbRepository';
import roleCheckMiddleware from '../middlewares/roleCheckMiddleware';
import { cloudServiceInterface } from '../../../app/services/cloudServiceInterface';
import { s3Service } from '../../../frameworks/services/s3CloudService';
import upload from '../middlewares/multer';
import { quizDbRepository } from '../../../app/repositories/quizDbRepository';
import { quizRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/quizzDbRepository';
import { itemDbRepository } from '../../../app/repositories/itemDbRepository';
import { itemRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/itemRepoMongodb';
import { discussionDbRepository } from '../../../app/repositories/discussionDbRepository';
import { discussionRepositoryMongoDb } from '../../../frameworks/database/mongodb/repositories/discussionsRepoMongodb';
import { paymentRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/paymentRepoMongodb';
import { paymentInterface } from '../../../app/repositories/paymentDbRepository';
import jwtAuthMiddleware from '../middlewares/userAuth';
import { redisCacheRepository } from '../../../frameworks/database/redis/redisCacheRepository';
import { cacheRepositoryInterface } from '../../../app/repositories/cachedRepoInterface';
import { RedisClient } from '../../../app';
import { cachingMiddleware } from '../middlewares/redisCaching';

const productRouter = (redisClient: RedisClient) => {
  const router = express.Router();
  const controller = productController(
    cloudServiceInterface,
    s3Service,
    productDbRepository,
    productRepositoryMongodb,
    quizDbRepository,
    quizRepositoryMongodb,
    itemDbRepository,
    itemRepositoryMongodb,
    discussionDbRepository,
    discussionRepositoryMongoDb,
    paymentInterface,
    paymentRepositoryMongodb,
    cacheRepositoryInterface,
    redisCacheRepository,
    redisClient
  );
  //* Add product (Seller)
  router.post(
    '/sellers/add-product',
    jwtAuthMiddleware,
    roleCheckMiddleware('seller'),
    upload.array('files'),
    controller.addProduct
  );

  router.put(
    '/sellers/edit-product/:productId',
    jwtAuthMiddleware,
    roleCheckMiddleware('seller'),
    upload.array('files'),
    controller.editProduct
  );

  router.get(
    '/list',
    cachingMiddleware(redisClient, 'all-products'), 
    controller.getAllProducts
  );

  // ✅ Đặt các route cụ thể TRƯỚC route động :productId
  router.get('/trending', controller.getTrendingProducts);

  router.get(
    '/recommended',
    jwtAuthMiddleware,
    roleCheckMiddleware('customer'),
    controller.getRecommendedProductByCustomerInterest
  );

  router.get(
    '/sellers/my-products',
    jwtAuthMiddleware,
    roleCheckMiddleware('seller'),
    controller.getProductsBySeller
  );

  router.get(
    '/customers/my-products',
    jwtAuthMiddleware,
    controller.getProductByCustomer
  );

  router.get(
    '/search',
    cachingMiddleware(redisClient),
    controller.searchProduct
  );

  // ✅ Route động :productId phải đặt CUỐI CÙNG
  router.get('/:productId', controller.getIndividualProduct);

  router.post(
    '/sellers/add-item/:productId',
    jwtAuthMiddleware,
    roleCheckMiddleware('seller'),
    upload.array('media'),
    controller.addItem
  );

  router.put(
    '/sellers/edit-item/:itemId',
    jwtAuthMiddleware,
    roleCheckMiddleware('seller'),
    upload.array('media'),
    controller.editItem
  );

  router.get(
    '/sellers/get-items-by-product/:productId',
    controller.getItemsByProduct
  );

  router.get('/items/:itemId', controller.getItemById);

  router.get('/items/:itemId/quizzes', controller.getQuizzesByItem);

  router.post(
    '/items/add-discussion/:itemId',
    jwtAuthMiddleware,
    controller.addDiscussion
  );

  router.get(
    '/items/get-discussions-by-item/:itemId',
    controller.getDiscussionsByItem
  );

  router.patch(
    '/items/edit-discussion/:discussionId',
    jwtAuthMiddleware,
    controller.editDiscussions
  );

  router.delete(
    '/items/delete-discussion/:discussionId',
    jwtAuthMiddleware,
    controller.deleteDiscussion
  );

  router.put(
    '/items/reply-discussion/:discussionId',
    jwtAuthMiddleware,
    controller.replyDiscussion
  );

  router.get(
    '/items/replies-based-on-discussion/:discussionId',
    controller.getRepliesByDiscussion
  );

  router.post(
    '/purchase/:productId',
    jwtAuthMiddleware,
    controller.purchaseProduct
  );


  return router;
};
export default productRouter;
