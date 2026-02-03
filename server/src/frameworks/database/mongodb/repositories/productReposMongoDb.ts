import Product from '../models/product';
import mongoose, { FilterQuery } from 'mongoose';
import Customers from '../models/customer';
import {
  AddProductInfoInterface,
  EditProductInfo,
  ProductInterface
} from '@src/types/productInterface';

export const productRepositoryMongodb = () => {
  const addProduct = async (productInfo: AddProductInfoInterface) => {
    const newProduct = new Product(productInfo);
    newProduct.price ? (newProduct.isPaid = true) : (newProduct.isPaid = false);
    const { _id: productId } = await newProduct.save();
    return productId;
  };

  const editProduct = async (productId: string, editInfo: EditProductInfo) => {
    const response = await Product.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(productId) },
      { ...editInfo }
    );
    return response;
  };

  const getAllProduct = async () => {
    const products: ProductInterface[] | null = await Product.find({});
    return products;
  };

  const getProductById = async (productId: string) => {
    // Validate productId before creating ObjectId
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      console.error('❌ Invalid productId provided to getProductById:', productId);
      return null;
    }
    
    // Check if productId is a valid ObjectId format (24 hex characters)
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error('❌ productId is not a valid ObjectId format:', productId);
      return null;
    }
    
    try {
      const product: ProductInterface | null = await Product.findOne({
        _id: new mongoose.Types.ObjectId(productId)
      }).lean();
      return product;
    } catch (error) {
      console.error('❌ Error in getProductById:', error);
      return null;
    }
  };

  const getProductBySellerId = async (sellerId: string) => {
    if (!sellerId || typeof sellerId !== 'string' || sellerId.trim() === '') {
      console.error('❌ Invalid sellerId provided to getProductBySellerId:', sellerId);
      return [];
    }
    
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      console.error('❌ sellerId is not a valid ObjectId format:', sellerId);
      return [];
    }
    
    try {
      const products = await Product.find({
        sellerId: new mongoose.Types.ObjectId(sellerId)
      });
      return products;
    } catch (error) {
      console.error('❌ Error in getProductBySellerId:', error);
      return [];
    }
  };

  const getAmountByProductId = async (productId: string) => {
    try {
      const product = await Product.findOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        { price: 1, title: 1, isPaid: 1 } // Thêm title để không bị lỗi
      ).lean();
      return product;
    } catch (error) {
      console.error('getAmountByProductId error:', error);
      return null;
    }
  };

  const purchaseProduct = async (productId: string, customerId: string) => {
    const response = await Product.updateOne(
      { _id: new mongoose.Types.ObjectId(productId) },
      { $push: { productsPurchased: customerId } }
    );
    return response;
  };

  const getRecommendedProductByCustomerInterest = async (customerId: string) => {
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(customerId) } },
      { $unwind: '$interests' },
      {
        $lookup: {
          from: 'categories',
          localField: 'interests',
          foreignField: 'name',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $lookup: {
          from: 'product',
          localField: 'category.name',
          foreignField: 'category',
          as: 'products'
        }
      },
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'seller',
          localField: 'products.sellerId',
          foreignField: '_id',
          as: 'seller'
        }
      },
      {
        $addFields: {
          seller: { $arrayElemAt: ['$seller', 0] }
        }
      },
      {
        $project: {
          product: {
            _id: '$products._id',
            name: '$products.title',
            thumbnailKey: '$products.thumbnail.key'
          },
          seller: {
            _id: '$seller._id',
            firstName: '$seller.firstName',
            lastName: '$seller.lastName',
            email: '$seller.email',
            profileKey: '$seller.profilePic.key'
          }
        }
      }
    ];
    const products = await Customers.aggregate(pipeline);
    return products;
  };

  const getTrendingProducts = async () => {
    try {
      const products = await Product.aggregate([
        {
          $match: {
            sellerId: { $exists: true, $ne: null },
            $expr: { $ifNull: ['$sellerId', false] }
          }
        },
        {
          $sort: { purchaseCount: -1 }
        },
        {
          $limit: 10
        },
        {
          $lookup: {
            from: 'seller',
            localField: 'sellerId',
            foreignField: '_id',
            as: 'seller'
          }
        },
        {
          $project: {
            _id: 1,
            title: '$title',
            productsPurchased: '$productsPurchased',
            thumbnail: '$thumbnail',
            sellerFirstName: { $arrayElemAt: ['$seller.firstName', 0] },
            sellerLastName: { $arrayElemAt: ['$seller.lastName', 0] },
            sellerProfile: { $arrayElemAt: ['$seller.profilePic', 0] },
            profileUrl: ''
          }
        }
      ]);
      return products;
    } catch (error) {
      console.error('❌ Error in getTrendingProducts:', error);
      return [];
    }
  };

  const getProductByCustomer = async (id: string) => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('❌ Invalid customer id provided to getProductByCustomer:', id);
      return [];
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('❌ customer id is not a valid ObjectId format:', id);
      return [];
    }
    
    try {
      const products: ProductInterface[] | null = await Product.find({
        productsPurchased: {
          $in: [new mongoose.Types.ObjectId(id)]
        }
      });
      return products || [];
    } catch (error) {
      console.error('❌ Error in getProductByCustomer:', error);
      return [];
    }
  };

  const getTotalNumberOfProducts = async () => {
    const totalProducts = await Product.find().count();
    return totalProducts;
  };

  const getNumberOfProductsAddedInEachMonth = async () => {
    const productCountsByMonth = await Product.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: {
          month: 1
        }
      }
    ]);
    return productCountsByMonth;
  };

  const getCustomersByProductForSeller = async (sellerId: string) => {
    const customers = await Product.aggregate([
      {
        $match: { sellerId: new mongoose.Types.ObjectId(sellerId) }
      },
      {
        $unwind: '$productsPurchased'
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'productsPurchased',
          foreignField: '_id',
          as: 'customerDetails'
        }
      },
      {
        $project: {
          customer: { $arrayElemAt: ['$customerDetails', 0] },
          productName: '$title'
        }
      },
      {
        $group: {
          _id: '$customer._id',
          product: { $first: '$productName' },
          firstName: { $first: '$customer.firstName' },
          lastName: { $first: '$customer.lastName' },
          email: { $first: '$customer.email' },
          mobile: { $first: '$customer.mobile' },
          dateJoined: { $first: '$customer.dateJoined' },
          isBlocked: { $first: '$customer.isBlocked' },
          profilePic: { $first: '$customer.profilePic' },
          isGoogleUser: { $first: '$customer.isGoogleUser' }
        }
      }
    ]);
    return customers;
  };

  // Thay thế hàm searchCourse trong file:
// server/src/frameworks/database/mongodb/repositories/courseReposMongoDb.ts

const searchProduct = async (
  isFree: boolean,
  searchQuery: string,
  filterQuery: string
) => {
  console.log('🔍 Repository search params:', { isFree, searchQuery, filterQuery });
  
  let query: any = {};
  
  try {
    // ✅ Build query without $text operator - using regex instead
    if (searchQuery && searchQuery.trim() !== '' && filterQuery && filterQuery.trim() !== '') {
      // Both search and filter provided
      query = {
        $and: [
          {
            $or: [
              { title: new RegExp(searchQuery, 'i') },
              { description: new RegExp(searchQuery, 'i') },
              { category: new RegExp(searchQuery, 'i') },
              { tags: { $in: [new RegExp(searchQuery, 'i')] } },
              { about: new RegExp(searchQuery, 'i') }
            ]
          },
          { isFree: isFree }
        ]
      };
    } else if (searchQuery && searchQuery.trim() !== '') {
      // Only search query provided
      const searchConditions = {
        $or: [
          { title: new RegExp(searchQuery, 'i') },
          { description: new RegExp(searchQuery, 'i') },
          { category: new RegExp(searchQuery, 'i') },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } },
          { about: new RegExp(searchQuery, 'i') }
        ]
      };

      if (isFree) {
        query = {
          $and: [
            searchConditions,
            { isFree: true }
          ]
        };
      } else {
        query = searchConditions;
      }
    } else if (filterQuery && filterQuery.trim() !== '') {
      // Only filter provided - search by category and other fields
      query = {
        $or: [
          { category: new RegExp(filterQuery, 'i') },
          { title: new RegExp(filterQuery, 'i') },
          { description: new RegExp(filterQuery, 'i') },
          { tags: { $in: [new RegExp(filterQuery, 'i')] } },
          { about: new RegExp(filterQuery, 'i') }
        ]
      };
      
      // Add isFree condition if applicable
      if (isFree) {
        query = {
          $and: [
            query,
            { isFree: true }
          ]
        };
      }
    } else {
      // ✅ Fallback - return all products if no valid search params
      query = {};
    }

    console.log('🔍 MongoDB query (using regex):', JSON.stringify(query, null, 2));

    // ✅ Execute query with regular find (no text scoring needed)
    const products = await Product.find(query);

    console.log('✅ Found products:', products.length);
    return products;
  } catch (error) {
    console.error('❌ Repository search error:', error);
    throw error;
  }
};
  

  return {
    addProduct,
    editProduct,
    getAllProduct,
    getProductById,
    getProductBySellerId,
    getAmountByProductId,
    purchaseProduct,
    getRecommendedProductByCustomerInterest,
    getTrendingProducts,
    getProductByCustomer,
    getTotalNumberOfProducts,
    getNumberOfProductsAddedInEachMonth,
    getCustomersByProductForSeller,
    searchProduct
  };
};

export type ProductRepositoryMongoDbInterface = typeof productRepositoryMongodb;
