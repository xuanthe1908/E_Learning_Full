import dotenv from 'dotenv';
dotenv.config();

const configKeys = {
  // Database - UPDATED
  MONGO_DB_URL: process.env.DATABASE as string,
  DB_CLUSTER_URL: process.env.DB_CLUSTER_URL || process.env.DATABASE as string,
  DB_NAME: process.env.DB_NAME || 'TutorTrek',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // Server
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ORIGIN_PORT: process.env.ORIGIN_PORT || 'http://localhost:3000',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,

  // Google Auth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,

  // Email
  EMAIL_NODE_MAILER: process.env.EMAIL_USERNAME as string,
  PASSWORD_NODE_MAILER: process.env.EMAIL_PASSWORD as string,
  FROM_EMAIL_NODE_MAILER: process.env.FROM_EMAIL as string,

  // AWS S3
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY as string,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY as string,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION as string,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME as string,
  CLOUDFRONT_DISTRIBUTION_ID: process.env.CLOUDFRONT_DISTRIBUTION_ID as string,
  CLOUDFRONT_DOMAIN_NAME: process.env.CLOUDFRONT_DOMAIN_NAME as string,

  // VNPay - UPDATED
  VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE || '',
  VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET || '',
  VNPAY_URL: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/return',
};

export default configKeys;