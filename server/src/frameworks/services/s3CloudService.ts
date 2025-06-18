import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CloudFrontClient, GetDistributionCommand } from '@aws-sdk/client-cloudfront';
import configKeys from '../../config';
import crypto from 'crypto';

const validateAwsConfig = () => {
  const required = ['AWS_ACCESS_KEY', 'AWS_SECRET_KEY', 'AWS_BUCKET_REGION', 'AWS_BUCKET_NAME'];
  const missing = required.filter(key => !(configKeys as Record<string, any>)[key] || (configKeys as Record<string, any>)[key] === 'undefined');
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing AWS configuration:', missing);
    console.warn('S3 features will be disabled');
    return false;
  }

  const bucketName = configKeys.AWS_BUCKET_NAME;
  const bucketNameRegex = /^[a-z0-9.-]{3,63}$/;
  
  if (!bucketNameRegex.test(bucketName)) {
    console.warn('⚠️ Invalid AWS bucket name:', bucketName);
    console.warn('S3 features will be disabled');
    return false;
  }

  console.log('✅ AWS configuration validated successfully');
  console.log('   Bucket:', bucketName);
  console.log('   Region:', configKeys.AWS_BUCKET_REGION);
  return true;
};
const isAwsConfigured = validateAwsConfig();

let s3: S3Client | null = null;
let cloudFront: CloudFrontClient | null = null;

if (isAwsConfigured) {
  s3 = new S3Client({
    credentials: {
      accessKeyId: configKeys.AWS_ACCESS_KEY,
      secretAccessKey: configKeys.AWS_SECRET_KEY,
    },
    region: configKeys.AWS_BUCKET_REGION,
  });

  cloudFront = new CloudFrontClient({
    credentials: {
      accessKeyId: configKeys.AWS_ACCESS_KEY,
      secretAccessKey: configKeys.AWS_SECRET_KEY,
    },
    region: configKeys.AWS_BUCKET_REGION,
  });
}

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export const s3Service = () => {
  const uploadFile = async (file: Express.Multer.File) => {
    if (!s3) {
      throw new Error('AWS S3 is not configured');
    }

    try {
      const key = randomImageName();
      const params = {
        Bucket: configKeys.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);
      return {
        name: file.originalname,
        key,
      };
    } catch (error) {
      console.error('❌ S3 uploadFile error:', error);
      throw new Error('Failed to upload file to S3');
    }
  };

  const uploadAndGetUrl = async (file: Express.Multer.File) => {
    if (!s3) {
      throw new Error('AWS S3 is not configured');
    }

    try {
      const key = randomImageName();
      const params = {
        Bucket: configKeys.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', 
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const url = `https://${configKeys.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

      return {
        name: file.originalname,
        key,
        url,
      };
    } catch (error) {
      console.error('❌ S3 uploadAndGetUrl error:', error);
      throw new Error('Failed to upload file and get URL from S3');
    }
  };

  const getFile = async (fileKey: string) => {
    if (!fileKey || fileKey.trim() === '') {
      console.warn('⚠️ getFile called with empty fileKey, returning default placeholder');
      return '/placeholder-image.png'; 
    }

    if (!s3) {
      console.warn('⚠️ AWS S3 not configured, returning placeholder');
      return '/placeholder-image.png';
    }

    try {
      const getObjectParams = {
        Bucket: configKeys.AWS_BUCKET_NAME,
        Key: fileKey.trim(), // ✅ Trim fileKey
      };
      const command = new GetObjectCommand(getObjectParams);
      return await getSignedUrl(s3, command, { expiresIn: 60000 });
    } catch (error) {
      console.error('❌ S3 getFile error for key:', fileKey, error.message);
      return '/placeholder-image.png'; // ✅ Trả về placeholder thay vì throw
    }
  };

  const getVideoStream = async (key: string): Promise<NodeJS.ReadableStream> => {
    if (!key || key.trim() === '') {
      throw new Error('Video key is required');
    }

    if (!s3) {
      throw new Error('AWS S3 is not configured');
    }

    try {
      const s3Params = {
        Bucket: configKeys.AWS_BUCKET_NAME,
        Key: key.trim(),
      };

      const command = new GetObjectCommand(s3Params);
      const { Body } = await s3.send(command);

      return Body as NodeJS.ReadableStream;
    } catch (error) {
      console.error('❌ S3 getVideoStream error:', error);
      throw new Error('Failed to get video stream from S3');
    }
  };

  const getCloudFrontUrl = async (fileKey: string) => {
    if (!fileKey || fileKey.trim() === '') {
      return '/placeholder-image.png';
    }

    try {
      if (!configKeys.CLOUDFRONT_DISTRIBUTION_ID || !cloudFront) {
        console.warn('⚠️ CloudFront not configured, using S3 direct URL');
        return `https://${configKeys.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      }

      const getDistributionParams = {
        Id: configKeys.CLOUDFRONT_DISTRIBUTION_ID,
      };
      const command = new GetDistributionCommand(getDistributionParams);
      const { Distribution } = await cloudFront.send(command);
      const cloudFrontDomain = Distribution?.DomainName;
      const cloudFrontUrl = `https://${cloudFrontDomain}/${fileKey}`;

      return cloudFrontUrl;
    } catch (error) {
      console.error('❌ CloudFront getUrl error:', error);
      // Fallback to S3 direct URL
      if (isAwsConfigured) {
        return `https://${configKeys.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      }
      return '/placeholder-image.png';
    }
  };

  const removeFile = async (fileKey: string) => {
    if (!fileKey || fileKey.trim() === '') {
      console.warn('⚠️ removeFile called with empty fileKey');
      return;
    }

    if (!s3) {
      throw new Error('AWS S3 is not configured');
    }

    try {
      const params = {
        Bucket: configKeys.AWS_BUCKET_NAME,
        Key: fileKey.trim(),
      };
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
    } catch (error) {
      console.error('❌ S3 removeFile error:', error);
      throw new Error('Failed to remove file from S3');
    }
  };

  return {
    uploadFile,
    uploadAndGetUrl,
    getFile,
    getVideoStream,
    getCloudFrontUrl,
    removeFile,
  };
};

export type CloudServiceImpl = typeof s3Service;