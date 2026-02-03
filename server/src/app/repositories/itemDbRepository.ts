import { CreateItemInterface, EditItemInterface } from '../../types/item';
import { ItemRepositoryMongoDbInterface } from '../../frameworks/database/mongodb/repositories/itemRepoMongodb';
export const itemDbRepository = (
  repository: ReturnType<ItemRepositoryMongoDbInterface>
) => {

  const addItem = async (
    productId: string,
    sellerId: string,
    item: CreateItemInterface
  ) => await repository.addItem(productId, sellerId, item);

  const editItem = async (
    itemId: string,
    itemInfo: EditItemInterface
  ) => await repository.editItem(itemId, itemInfo);

  const getItemsByProductId = async (productId: string) =>
    await repository.getItemsByProductId(productId);

  const getItemById = async (itemId: string) =>
    await repository.getItemById(itemId);

  return {
    addItem,
    editItem,
    getItemById,
    getItemsByProductId
  };
};

export type ItemDbRepositoryInterface = typeof itemDbRepository;
