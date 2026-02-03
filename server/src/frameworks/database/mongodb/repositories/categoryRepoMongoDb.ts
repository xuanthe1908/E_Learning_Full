import Category from '../models/category';
import { CategoryInterface } from '@src/types/category';
import { Types } from 'mongoose';
const { ObjectId } = Types;

export const categoryRepositoryMongodb = () => {
  const addCategory = async (category: CategoryInterface) => {
    const newCategory = new Category(category);
    await newCategory.save();
  };

  const getCategoryById = async (categoryId: string) => {
    const category: CategoryInterface | null = await Category.findOne({
      _id: new ObjectId(categoryId)
    });
    return category;
  };

  const getAllCategory = async () => {
    const categories: CategoryInterface[] | null = await Category.find({});
    return categories;
  };

  const editCategory = async (
    categoryId: string,
    categoryInfo: { name: string; description: string }
  ) => {
    const { name, description } = categoryInfo;
    await Category.updateOne(
      { _id: new ObjectId(categoryId) },
      {
        $set: {
          name,
          description
        }
      }
    );
  };

  const getProductCountByCategory = async () => {
    const products = await Category.aggregate( [
      {
        $lookup:{
          from:'product',
          localField:'name',
          foreignField:'category',
          as:'productDetails'
        }
      },
      {
        $project: {
          name: 1, 
          courseCount: { $size: '$productDetails' } 
        }
      }
    ]);
    return products
  };

  return {
    addCategory,
    getCategoryById,
    getAllCategory,
    editCategory,
    getProductCountByCategory
  };
};

export type CategoryRepoMongodbInterface = typeof categoryRepositoryMongodb;
