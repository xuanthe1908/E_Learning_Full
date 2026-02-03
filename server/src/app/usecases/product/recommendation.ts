import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { ProductDbRepositoryInterface } from '../../repositories/productDbRepository';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const getRecommendedProductByCustomerU = async (
  customerId: string,
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  if (!customerId) {
    throw new AppError(
      'Please provide a valid customer id ',
      HttpStatusCodes.BAD_REQUEST
    );
  }

  const products =
    await productDbRepository.getRecommendedProductByCustomerInterest(customerId);
  await Promise.all(
    products.map(async (product) => {
      product.media={thumbnailUrl:"",profileUrl:""}
      if (product.product) {
        product.media.thumbnailUrl = await cloudService.getFile(product.product.thumbnailKey);
      }
      if (product.seller) {
        product.media.profileUrl = await cloudService.getFile(product.seller.profileKey);
      }
    })
  );

  return products;
};

export const getTrendingProductU = async (
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  const products = await productDbRepository.getTrendingProduct();
  await Promise.all(
    products.map(async (product) => {
      if (product.thumbnail) {
        product.thumbnailUrl = await cloudService.getFile(product.thumbnail.key);
      }
      if (product.sellerProfile) {
        product.profileUrl = await cloudService.getFile(product.sellerProfile.key);
      }
    })
  );
  return products;
};
