import { ProductDbRepositoryInterface } from '../../repositories/productDbRepository';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const getProductBySellerU = async (
  sellerId: string | undefined,
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  if (!sellerId && sellerId !== '') {
    throw new AppError(
      'Please provide a seller id',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const products = await productDbRepository.getProductBySellerId(
    sellerId
  );
  await Promise.all(
    products.map(async (product) => {
      if (product.thumbnail) {
        product.thumbnailUrl = await cloudService.getFile(product.thumbnail.key);
      }
    })
  );

  return products;
};
