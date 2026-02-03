import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { ItemDbRepositoryInterface } from '@src/app/repositories/itemDbRepository';

export const getItemsByProductIdU = async (
  productId: string,
  itemDbRepository: ReturnType<ItemDbRepositoryInterface>
) => {
  if (!productId) {
    throw new AppError(
      'Please provide a valid product id',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const items = await itemDbRepository.getItemsByProductId(productId);
  return items;
};
