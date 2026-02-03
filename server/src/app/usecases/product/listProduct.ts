import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { ProductDbRepositoryInterface } from '../../repositories/productDbRepository';
import { ProductInterface } from '@src/types/productInterface';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const getAllProductU = async (
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  const products: ProductInterface[] | null =
    await productDbRepository.getAllProduct();

  await Promise.all(
    products.map(async (product) => {
      if (product.thumbnail) {
        product.thumbnailUrl = await cloudService.getFile(product.thumbnail.key);
      }
    })
  );
  return products;
};

export const getProductByIdU = async (
  productId: string,
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  if (!productId) {
    throw new AppError(
      'Please provide a product id',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const product: ProductInterface | null = await productDbRepository.getProductById(
    productId
  );
  if (product) {
    if (product.thumbnail) {
      const thumbnail = await cloudService.getFile(product.thumbnail.key);
      product.thumbnailUrl = thumbnail;
    }
    if (product.guidelines) {
      const guidelines = await cloudService.getFile(product.guidelines.key);
      product.guidelinesUrl = guidelines;
    }
  }
  return product;
};

export const getProductByCustomerU = async (
  customerId: string | undefined,
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  if (!customerId) {
    throw new AppError('Invalid customer id ', HttpStatusCodes.BAD_REQUEST);
  }
  const products = await productDbRepository.getProductByCustomer(customerId);

  await Promise.all(
    products.map(async (product) => {
      if (product.thumbnail) {
        product.thumbnailUrl = await cloudService.getFile(product.thumbnail.key);
      }
    })
  );
  return products;
};
