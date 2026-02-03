import { ProductRepositoryMongoDbInterface } from '@src/frameworks/database/mongodb/repositories/productReposMongoDb';
import {
  AddProductInfoInterface,
  EditProductInfo
} from '@src/types/productInterface';

export const productDbRepository = (
  repository: ReturnType<ProductRepositoryMongoDbInterface>
) => {
  const addProduct = async (productInfo: AddProductInfoInterface) =>
    await repository.addProduct(productInfo);

  const editProduct = async (productId: string, editInfo: EditProductInfo) =>
    await repository.editProduct(productId, editInfo);

  const getAllProduct = async () => await repository.getAllProduct();

  const getProductById = async (productId: string) =>
    await repository.getProductById(productId);

  const getProductBySellerId = async (sellerId: string) =>
    await repository.getProductBySellerId(sellerId);

  const getAmountByProductId = async (productId: string) =>
    await repository.getAmountByProductId(productId);

  const purchaseProduct = async (productId: string, customerId: string) =>
    await repository.purchaseProduct(productId, customerId);

  const getRecommendedProductByCustomerInterest = async (customerId: string) =>
    await repository.getRecommendedProductByCustomerInterest(customerId);

  const getTrendingProduct = async () => await repository.getTrendingProducts();

  const getProductByCustomer = async (customerId: string) =>
    await repository.getProductByCustomer(customerId);

  const getTotalNumberOfProducts = async () =>
    await repository.getTotalNumberOfProducts();

  const getNumberOfProductsAddedInEachMonth = async () =>
    await repository.getNumberOfProductsAddedInEachMonth();

  const getCustomersByProductForSeller = async (sellerId: string) =>
    await repository.getCustomersByProductForSeller(sellerId);

  const searchProduct = async (isFree: boolean, searchQuery: string,filterQuery:string) =>
    await repository.searchProduct(isFree, searchQuery,filterQuery);

  return {
    addProduct,
    editProduct,
    getAllProduct,
    getProductById,
    getProductBySellerId,
    getAmountByProductId,
    purchaseProduct,
    getRecommendedProductByCustomerInterest,
    getTrendingProduct,
    getProductByCustomer,
    getTotalNumberOfProducts,
    getNumberOfProductsAddedInEachMonth,
    getCustomersByProductForSeller,
    searchProduct
  };
};
export type ProductDbRepositoryInterface = typeof productDbRepository;
