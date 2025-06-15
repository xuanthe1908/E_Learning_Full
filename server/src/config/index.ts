import dotenv from 'dotenv';
dotenv.config();

const configKeys = {
  // Database
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  REDIS_URL: process.env.REDIS_URL,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  
  // AWS S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  
  // VNPay Configuration (thay thế Stripe)
  VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE,
  VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET,
  VNPAY_URL: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/return',
  
  // Server
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV
};

export default configKeys;

