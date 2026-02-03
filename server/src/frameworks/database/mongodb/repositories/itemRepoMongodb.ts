import mongoose from 'mongoose';
import Items from '../models/items';
import {
  CreateItemInterface,
  EditItemInterface
} from '../../../../types/item';

export const itemRepositoryMongodb = () => {
  const addItem = async (
    productId: string,
    sellerId: string,
    item: CreateItemInterface
  ) => {
    item.productId = productId;
    item.sellerId = sellerId;
    const newItem = new Items(item);
    const { _id } = await newItem.save();
    return _id;
  };

  const editItem = async (itemId: string, item: EditItemInterface) => {
    const response = await Items.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(itemId) },
      { ...item }
    );
    return response;
  };

  const getItemsByProductId = async (productId: string) => {
    const items = await Items.find({
      productId: new mongoose.Types.ObjectId(productId)
    });
    return items;
  };

  const getItemById = async (itemId: string) => {
    const item = await Items.findOne({
      _id: new mongoose.Types.ObjectId(itemId)
    });
    return item;
  };

  return {
    addItem,
    editItem,
    getItemsByProductId,
    getItemById
  };
};

export type ItemRepositoryMongoDbInterface = typeof itemRepositoryMongodb;
