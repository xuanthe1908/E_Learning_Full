import mongoose, { Schema, model, Document } from 'mongoose';

interface ProfilePic {
  name: string;
  key?: string;
  url?: string;
}
interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  profilePic: ProfilePic;
  mobile?: string;
  password?: string;
  interests: Array<string>;
  productsPurchased: mongoose.Schema.Types.ObjectId[];
  dateJoined: Date;
  isGoogleUser: boolean;
  isBlocked: boolean;
  blockedReason: string;
}

const ProfileSchema = new Schema<ProfilePic>({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String
  },
  url: {
    type: String
  }
});

const customerSchema = new Schema<ICustomer>({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  profilePic: {
    type: ProfileSchema,
    required: false
  },
  mobile: {
  type: String,
  required: function (this: ICustomer) {
    return !this.isGoogleUser; // Required for non-Google users
  },
  trim: true,
  sparse: true, // Allow multiple null values
  match: [/^(0\d{9}|\d{9}|84\d{9})$/, 'Please enter a valid Vietnamese mobile number'] // ✅ Chấp nhận số VN
},
  interests: {
    type: [String],
    required: true,
    default: []
  },
  password: {
    type: String,
    required: function (this: ICustomer) {
      return !this.isGoogleUser;
    },
    minlength: 8
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: {
    type: String,
    default: ''
  }
});


const Customers = model<ICustomer>('customers', customerSchema, 'customers');

export default Customers;
