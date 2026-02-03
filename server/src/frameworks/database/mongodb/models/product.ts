import mongoose, { Schema, model } from 'mongoose';
import { AddProductInfoInterface } from '@src/types/productInterface';

const FileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
});
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: function (this: AddProductInfoInterface) {
      return this.isPaid;
    },
    min: 0,
  },
  isPaid: {
    type: Boolean,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 10
  },
  syllabus: {
    type: [String],
    required: true
  },
  requirements: {
    type: [String]
  },
  thumbnail: {
    type: FileSchema,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  guidelines: {
    type: FileSchema,
    required: true
  },
  guidelinesUrl: {
    type: String,
    default: ''
  },
  introduction: {
    type: FileSchema,
    required: true
  },
  productsPurchased: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customers'
    }
  ],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completionStatus: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
});

// courseSchema.index(
//   {
//     title: 'text',
//     category: 'text',
//     level: 'text',
//     price: 'text'
//   },
//   {
//     weights: {
//       title: 4,
//       category: 3,
//       level: 2,
//       price: 1
//     }
//   }
// );

const Product = model('Product', productSchema, 'product');
export default Product;
