import AppError from '../../../utils/appError';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import { ItemDbRepositoryInterface } from '@src/app/repositories/itemDbRepository';

export const getItemByIdU = async (
  itemId: string,
  itemDbRepository: ReturnType<ItemDbRepositoryInterface>
) => {
  if (!itemId) {
    throw new AppError(
      'Please provide an item id',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const item = await itemDbRepository.getItemById(itemId);
  return item;
};
