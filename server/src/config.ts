import dotenv from 'dotenv';
dotenv.config();

const validateConfig = () => {
  const errors: string[] = [];

  // Required variables
  const required = {
    DATABASE: process.env.DATABASE,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  };

  Object.entries(required).forEach(([key, value]) => {
    if (!value || value === 'undefined') {
      errors.push(`${key} is required`);
    }
  });

  // AWS validation (optional but if provided must be valid)
  if (process.env.AWS_BUCKET_NAME) {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const bucketNameRegex = /^[a-z0-9.-]{3,63}$/;
    
    if (!bucketNameRegex.test(bucketName)) {
      errors.push(`AWS_BUCKET_NAME "${bucketName}" is invalid. Must be 3-63 characters, lowercase letters, numbers, dots, and hyphens only.`);
    }
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach(error => console.error(`   - ${error}`));
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }

  console.log('✅ Configuration validated successfully');
};

// ✅ Validate on startup
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error.message);
  console.error('Please check your .env file and fix the above issues');
  process.exit(1);
}

const configKeys = {
  // Database
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

  // AWS S3 - ✅ With fallbacks to prevent crashes
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || '',
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION || 'ap-southeast-1',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
  CLOUDFRONT_DISTRIBUTION_ID: process.env.CLOUDFRONT_DISTRIBUTION_ID || '',
  CLOUDFRONT_DOMAIN_NAME: process.env.CLOUDFRONT_DOMAIN_NAME || '',

  // VNPay
  VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE || '',
  VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET || '',
  VNPAY_URL: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/return',

  // ✅ AI Chat Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gpt-3.5-turbo',
  AI_MAX_TOKENS: process.env.AI_MAX_TOKENS || '1000',
  AI_TEMPERATURE: process.env.AI_TEMPERATURE || '0.7',
  AI_CHAT_RATE_LIMIT_WINDOW: process.env.AI_CHAT_RATE_LIMIT_WINDOW || '60000',
  AI_CHAT_RATE_LIMIT_MAX: process.env.AI_CHAT_RATE_LIMIT_MAX || '20',
};

// ✅ Log important config (without sensitive data)
console.log('📋 Current configuration:');
console.log('   Environment:', configKeys.NODE_ENV);
console.log('   Port:', configKeys.PORT);
console.log('   Database:', configKeys.MONGO_DB_URL ? '✅ Configured' : '❌ Missing');
console.log('   AWS S3:', configKeys.AWS_BUCKET_NAME ? `✅ ${configKeys.AWS_BUCKET_NAME}` : '❌ Not configured');
console.log('   OpenAI:', configKeys.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing');

export default configKeys;