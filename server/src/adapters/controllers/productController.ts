import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { ProductRepositoryMongoDbInterface } from '../../frameworks/database/mongodb/repositories/productReposMongoDb';
import { ProductDbRepositoryInterface } from '../../app/repositories/productDbRepository';
import { addProducts } from '../../app/usecases/product/addProduct';
import {
  AddProductInfoInterface,
  EditProductInfo
} from '../../types/productInterface';
import { CustomRequest } from '../../types/customRequest';
import {
  getAllProductU,
  getProductByIdU,
  getProductByCustomerU
} from '../../app/usecases/product/listProduct';
import { getProductBySellerU } from '../../app/usecases/product/viewProduct';
import { addItemsU } from '../../app/usecases/items/addItem';
import { getItemsByProductIdU } from '../../app/usecases/items/viewItems';
import { CloudServiceInterface } from '../../app/services/cloudServiceInterface';
import { CloudServiceImpl } from '../../frameworks/services/s3CloudService';
import { getQuizzesItemU } from '../../app/usecases/quiz/getQuiz';
import { getItemByIdU } from '../../app/usecases/items/getItem';
import { QuizDbInterface } from '../../app/repositories/quizDbRepository';
import { QuizRepositoryMongoDbInterface } from '../../frameworks/database/mongodb/repositories/quizzDbRepository';
import { ItemDbRepositoryInterface } from '../../app/repositories/itemDbRepository';
import { ItemRepositoryMongoDbInterface } from '../../frameworks/database/mongodb/repositories/itemRepoMongodb';
import { AddDiscussionInterface } from '../../types/discussion';
import { DiscussionRepoMongodbInterface } from '../../frameworks/database/mongodb/repositories/discussionsRepoMongodb';
import { DiscussionDbInterface } from '../../app/repositories/discussionDbRepository';
import {
  addDiscussionU,
  getDiscussionsByLessonU,
  editDiscussionU,
  deleteDiscussionByIdU,
  replyDiscussionU,
  getRepliesByDiscussionIdU
} from '../../app/usecases/items/discussions';
import { purchaseProductU } from '../../app/usecases/product/purchase';
import { PaymentInfo } from '../../types/payment';
import { PaymentInterface } from '../../app/repositories/paymentDbRepository';
import { PaymentImplInterface } from '../../frameworks/database/mongodb/repositories/paymentRepoMongodb';
import {
  getRecommendedProductByCustomerU,
  getTrendingProductU
} from '../../app/usecases/product/recommendation';
import { editProductU } from '../../app/usecases/product/editProduct';
import { editItemsU } from '../../app/usecases/items/editItem';
import { searchProductU } from '../../app/usecases/product/search';
import { CacheRepositoryInterface } from '@src/app/repositories/cachedRepoInterface';
import { RedisRepositoryImpl } from '@src/frameworks/database/redis/redisCacheRepository';
import { RedisClient } from '@src/app';

const productController = (
  cloudServiceInterface: CloudServiceInterface,
  cloudServiceImpl: CloudServiceImpl,
  productDbRepository: ProductDbRepositoryInterface,
  productDbRepositoryImpl: ProductRepositoryMongoDbInterface,
  quizDbRepository: QuizDbInterface,
  quizDbRepositoryImpl: QuizRepositoryMongoDbInterface,
  itemDbRepository: ItemDbRepositoryInterface,
  itemDbRepositoryImpl: ItemRepositoryMongoDbInterface,
  discussionDbRepository: DiscussionDbInterface,
  discussionDbRepositoryImpl: DiscussionRepoMongodbInterface,
  paymentDbRepository: PaymentInterface,
  paymentDbRepositoryImpl: PaymentImplInterface,
  cacheDbRepository: CacheRepositoryInterface,
  cacheDbRepositoryImpl: RedisRepositoryImpl,
  cacheClient: RedisClient
) => {
  const dbRepositoryProduct = productDbRepository(productDbRepositoryImpl());
  const cloudService = cloudServiceInterface(cloudServiceImpl());
  const dbRepositoryQuiz = quizDbRepository(quizDbRepositoryImpl());
  const dbRepositoryItem = itemDbRepository(itemDbRepositoryImpl());
  const dbRepositoryDiscussion = discussionDbRepository(
    discussionDbRepositoryImpl()
  );
  const dbRepositoryPayment = paymentDbRepository(paymentDbRepositoryImpl());
  const dbRepositoryCache = cacheDbRepository(
    cacheDbRepositoryImpl(cacheClient)
  );

  const addProduct = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const product: AddProductInfoInterface = req.body;
      const files: Express.Multer.File[] = req.files as Express.Multer.File[];
      const sellerId = req.user?.Id;
      const response = await addProducts(
        sellerId,
        product,
        files,
        cloudService,
        dbRepositoryProduct
      );
      console.log(response)
      res.status(201).json({
        status: 'success',
        message:
          'Successfully added new product, product will be published after verification',
        data: response
      });
    }
  );

  const editProduct = asyncHandler(async (req: CustomRequest, res: Response) => {
    const product: EditProductInfo = req.body;
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    const sellerId = req.user?.Id;
    const productId: string = req.params.productId;
    const response = await editProductU(
      productId,
      sellerId,
      files,
      product,
      cloudService,
      dbRepositoryProduct
    );
    res.status(200).json({
      status: 'success',
      message: 'Successfully updated the product',
      data: response
    });
  });

  const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await getAllProductU(cloudService, dbRepositoryProduct);
    // ✅ Chỉ cache nếu có products (không cache empty array)
    if (products && products.length > 0) {
      const cacheOptions = {
        key: `all-products`,
        expireTimeSec: 600,
        data: JSON.stringify(products)
      };
      await dbRepositoryCache.setCache(cacheOptions);
    }
    res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved all products',
      data: products
    });
  });

  const getIndividualProduct = asyncHandler(
    async (req: Request, res: Response) => {
      const productId: string = req.params.productId;
      const product = await getProductByIdU(
        productId,
        cloudService,
        dbRepositoryProduct
      );
      console.log(product)
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved the product',
        data: product
      });
    }
  );

  const getProductsBySeller = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const sellerId = req.user?.Id;
      const products = await getProductBySellerU(
        sellerId,
        cloudService,
        dbRepositoryProduct
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved your products',
        data: products
      });
    }
  );

  const addItem = asyncHandler(async (req: CustomRequest, res: Response) => {
    const sellerId = req.user?.Id;
    const productId = req.params.productId;
    const item = req.body;
    const medias = req.files as Express.Multer.File[];
    const questions = JSON.parse(item.questions);
    item.questions = questions;
    await addItemsU(
      medias,
      productId,
      sellerId,
      item,
      dbRepositoryItem,
      cloudService,
      dbRepositoryQuiz
    );
    res.status(200).json({
      status: 'success',
      message: 'Successfully added new item',
      data: null
    });
  });

  const editItem = asyncHandler(async (req: CustomRequest, res: Response) => {
    const item = req.body;
    const itemId = req.params.itemId;
    const medias = req.files as Express.Multer.File[];
    const questions = JSON.parse(item.questions);
    item.questions = questions;
    await editItemsU(
      medias,
      itemId,
      item,
      dbRepositoryItem,
      cloudService,
      dbRepositoryQuiz
    );
    res.status(200).json({
      status: 'success',
      message: 'Successfully updated the item',
      data: null
    });
  });

  const getItemsByProduct = asyncHandler(
    async (req: Request, res: Response) => {
      const productId = req.params.productId;
      const items = await getItemsByProductIdU(productId, dbRepositoryItem);
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved items based on the product',
        data: items
      });
    }
  );

  const getItemById = asyncHandler(async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const item = await getItemByIdU(itemId, dbRepositoryItem);
    res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved items based on the product',
      data: item
    });
  });

  const getQuizzesByItem = asyncHandler(
    async (req: Request, res: Response) => {
      const itemId = req.params.itemId;
      const quizzes = await getQuizzesItemU(itemId, dbRepositoryQuiz);
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved quizzes based on the item',
        data: quizzes
      });
    }
  );

  const addDiscussion = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const itemId: string = req.params.itemId;
      const userId = req.user?.Id;
      const discussion: AddDiscussionInterface = req.body;
      await addDiscussionU(
        userId,
        itemId,
        discussion,
        dbRepositoryDiscussion
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully posted your comment',
        data: null
      });
    }
  );

  const getDiscussionsByItem = asyncHandler(
    async (req: Request, res: Response) => {
      const itemId: string = req.params.itemId;
      const discussion = await getDiscussionsByLessonU(
        itemId,
        dbRepositoryDiscussion
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved discussions based on an item',
        data: discussion
      });
    }
  );

  const editDiscussions = asyncHandler(async (req: Request, res: Response) => {
    const discussionId: string = req.params.discussionId;
    const message: string = req.body.message;
    await editDiscussionU(discussionId, message, dbRepositoryDiscussion);
    res.status(200).json({
      status: 'success',
      message: 'Successfully edited your comment',
      data: null
    });
  });

  const deleteDiscussion = asyncHandler(async (req: Request, res: Response) => {
    const discussionId: string = req.params.discussionId;
    await deleteDiscussionByIdU(discussionId, dbRepositoryDiscussion);
    res.status(200).json({
      status: 'success',
      message: 'Successfully deleted your comment',
      data: null
    });
  });

  const replyDiscussion = asyncHandler(async (req: Request, res: Response) => {
    const discussionId: string = req.params.discussionId;
    const reply = req.body.reply;
    await replyDiscussionU(discussionId, reply, dbRepositoryDiscussion);
    res.status(200).json({
      status: 'success',
      message: 'Successfully replied to a comment',
      data: null
    });
  });

  const getRepliesByDiscussion = asyncHandler(
    async (req: Request, res: Response) => {
      const discussionId: string = req.params.discussionId;
      const replies = await getRepliesByDiscussionIdU(
        discussionId,
        dbRepositoryDiscussion
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved replies based on discussion',
        data: replies
      });
    }
  );

  const purchaseProduct = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const paymentInfo: PaymentInfo = req.body;
      const { productId }: { productId?: string } = req.params;
      const { Id }: { Id?: string } = req.user || {};
      const productIdValue: string = productId ?? '';
      const customerId: string = Id ?? '';

      await purchaseProductU(
        productIdValue,
        customerId,
        paymentInfo,
        dbRepositoryProduct,
        dbRepositoryPayment
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully purchased the product',
        data: null
      });
    }
  );

  const getRecommendedProductByCustomerInterest = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const customerId: string = req.user?.Id ?? '';
      const products = await getRecommendedProductByCustomerU(
        customerId,
        cloudService,
        dbRepositoryProduct
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved recommended products',
        data: products
      });
    }
  );

  const getTrendingProducts = asyncHandler(
    async (req: Request, res: Response) => {
      const products = await getTrendingProductU(
        cloudService,
        dbRepositoryProduct
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved trending products',
        data: products
      });
    }
  );

  const getProductByCustomer = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const customerId: string | undefined = req.user?.Id;
      const products = await getProductByCustomerU(
        customerId,
        cloudService,
        dbRepositoryProduct
      );
      res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved products based on customers',
        data: products
      });
    }
  );

  const searchProduct = asyncHandler(async (req: Request, res: Response) => {
    const { search, filter } = req.query as { search: string; filter: string };
    const key = search.trim()===""?search:filter
    const searchResult = await searchProductU(
      search,
      filter,
      cloudService,
      dbRepositoryProduct
    );
    if (searchResult.length) {
      const cacheOptions = {
        key: `${key}`,
        expireTimeSec: 600,
        data: JSON.stringify(searchResult)
      };
      await dbRepositoryCache.setCache(cacheOptions);
    }
    res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved products based on the search query',
      data: searchResult
    });
  });

  return {
    addProduct,
    editProduct,
    getAllProducts,
    getIndividualProduct,
    getProductsBySeller,
    addItem,
    editItem,
    getItemsByProduct,
    getItemById,
    getQuizzesByItem,
    addDiscussion,
    getDiscussionsByItem,
    editDiscussions,
    deleteDiscussion,
    replyDiscussion,
    getRepliesByDiscussion,
    purchaseProduct,
    getRecommendedProductByCustomerInterest,
    getTrendingProducts,
    getProductByCustomer,
    searchProduct
  };
};

export default productController;
