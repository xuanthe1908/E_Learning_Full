import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
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
      
      let contentType = file.mimetype;
      if (file.mimetype.startsWith('video/')) {
        contentType = 'video/mp4';
      }
      
      const params = {
        Bucket: configKeys.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: contentType,
        Metadata: {
          'original-name': file.originalname,
          'upload-date': new Date().toISOString(),
          'file-size': file.size.toString()
        }
      };
      
      console.log(`🚀 Uploading to S3: ${file.originalname} (${file.size} bytes)`);
      const command = new PutObjectCommand(params);
      await s3.send(command);
      
      console.log(`✅ Successfully uploaded to S3 with key: ${key}`);
      return {
        name: file.originalname,
        key,
      };
    } catch (error: any) {
      console.error('❌ S3 uploadFile error:', error);
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  };

  const checkFileExists = async (fileKey: string): Promise<boolean> => {
    if (!s3 || !fileKey) return false;
    
    try {
      const command = new HeadObjectCommand({
        Bucket: configKeys.AWS_BUCKET_NAME,
        Key: fileKey.trim(),
      });
      await s3.send(command);
      console.log(`✅ File exists in S3: ${fileKey}`);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        console.warn(`⚠️ File not found in S3: ${fileKey}`);
        return false;
      }
      console.error('❌ Error checking file existence:', error);
      return false;
    }
  };

  const getFile = async (fileKey: string) => {
    if (!fileKey || fileKey.trim() === '') {
      console.warn('⚠️ getFile called with empty fileKey');
      return '/placeholder-image.png';
    }

    if (!s3) {
      console.warn('⚠️ AWS S3 not configured, returning placeholder');
      return '/placeholder-image.png';
    }

    try {
      const exists = await checkFileExists(fileKey);
      if (!exists) {
        console.error(`❌ File does not exist in S3: ${fileKey}`);
        return '/placeholder-image.png';
      }

      const getObjectParams = {
        Bucket: configKeys.AWS_BUCKET_NAME,
        Key: fileKey.trim(),
      };
      
      const command = new GetObjectCommand(getObjectParams);
      const signedUrl = await getSignedUrl(s3, command, { 
        expiresIn: 3600 // 1 hour
      });
      
      console.log(`✅ Generated S3 signed URL for: ${fileKey}`);
      return signedUrl;
    } catch (error: any) {
      console.error('❌ S3 getFile error for key:', fileKey, error.message);
      return '/placeholder-image.png';
    }
  };

  // 🔧 FIXED: Use S3 direct URL instead of broken CloudFront
  const getCloudFrontUrl = async (fileKey: string) => {
    if (!fileKey || fileKey.trim() === '') {
      console.warn('⚠️ getCloudFrontUrl called with empty fileKey');
      return '/placeholder-image.png';
    }

    try {
      // First check if file exists in S3
      const exists = await checkFileExists(fileKey);
      if (!exists) {
        console.error(`❌ File does not exist for streaming: ${fileKey}`);
        return '/placeholder-image.png';
      }

      // 🔧 Use S3 signed URL instead of CloudFront
      console.log('🔄 CloudFront domain not working, using S3 signed URL...');
      const signedUrl = await getFile(fileKey);
      
      if (signedUrl && signedUrl !== '/placeholder-image.png') {
        console.log(`✅ Generated S3 signed URL for streaming: ${fileKey}`);
        return signedUrl;
      }

      // 🔧 Alternative: Try S3 direct public URL (if bucket is public)
      const directUrl = `https://${configKeys.AWS_BUCKET_NAME}.s3.${configKeys.AWS_BUCKET_REGION}.amazonaws.com/${fileKey}`;
      console.log(`🔄 Trying S3 direct URL: ${directUrl}`);
      
      return directUrl;

    } catch (error: any) {
      console.error('❌ Error generating video URL:', error);
      
      // Emergency fallback to S3 direct URL
      const fallbackUrl = `https://${configKeys.AWS_BUCKET_NAME}.s3.${configKeys.AWS_BUCKET_REGION}.amazonaws.com/${fileKey}`;
      console.log(`🆘 Using fallback S3 URL: ${fallbackUrl}`);
      return fallbackUrl;
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
      const exists = await checkFileExists(key);
      if (!exists) {
        throw new Error(`Video file not found in S3: ${key}`);
      }

      const s3Params = {
        Bucket: configKeys.AWS_BUCKET_NAME,
        Key: key.trim(),
      };

      console.log(`🎥 Streaming video from S3: ${key}`);
      const command = new GetObjectCommand(s3Params);
      const { Body } = await s3.send(command);

      if (!Body) {
        throw new Error('No video data received from S3');
      }

      return Body as NodeJS.ReadableStream;
    } catch (error: any) {
      console.error('❌ S3 getVideoStream error:', error);
      throw new Error(`Failed to get video stream from S3: ${error.message}`);
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
      console.log(`✅ Successfully deleted from S3: ${fileKey}`);
    } catch (error: any) {
      console.error('❌ S3 removeFile error:', error);
      throw new Error(`Failed to remove file from S3: ${error.message}`);
    }
  };

  return {
    uploadFile,
    getFile,
    getVideoStream,
    getCloudFrontUrl, // Now returns S3 signed URL
    removeFile,
    checkFileExists,
  };
};

export type CloudServiceImpl = typeof s3Service;