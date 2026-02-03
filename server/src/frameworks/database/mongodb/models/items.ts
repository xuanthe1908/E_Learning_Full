import { Schema, model } from 'mongoose';

const MediaSchema = new Schema({
  key: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
});


const ItemSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  contents: {
    type: Array<string>,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'seller',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  about:{
   type:String,
   required:true
  },
  media: {
    type: [MediaSchema]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Items = model('Item', ItemSchema, 'items');
export default Items;
