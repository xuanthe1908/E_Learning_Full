import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { CloudServiceInterface } from '../../../app/services/cloudServiceInterface';

export const streamVideoU = async (
  fileKey: string,
  cloudService: ReturnType<CloudServiceInterface>
) => {
  console.log('🎬 === STREAM VIDEO USE CASE DEBUG ===');
  console.log(`📝 Input fileKey: "${fileKey}"`);
  console.log(`📏 FileKey length: ${fileKey ? fileKey.length : 0}`);
  console.log(`🔍 FileKey type: ${typeof fileKey}`);
  
  if (!fileKey) {
    console.error('❌ File key is null/undefined');
    throw new AppError('File key not found', HttpStatusCodes.BAD_REQUEST);
  }
  
  if (fileKey.trim() === '') {
    console.error('❌ File key is empty string');
    throw new AppError('File key is empty', HttpStatusCodes.BAD_REQUEST);
  }
  
  try {
    console.log('🚀 Calling cloudService.getCloudFrontUrl...');
    console.log('🔍 CloudService methods available:', Object.keys(cloudService));
    
    const stream = await cloudService.getCloudFrontUrl(fileKey);
    
    console.log(`📤 CloudService returned: "${stream}"`);
    console.log(`📏 Stream length: ${stream ? stream.length : 0}`);
    console.log(`🔍 Stream type: ${typeof stream}`);
    
    if (!stream) {
      console.error('❌ CloudService returned null/undefined');
      throw new AppError('Failed to get video stream URL', HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    
    if (stream === '/placeholder-image.png') {
      console.error('❌ CloudService returned placeholder');
      throw new AppError('Video file not found in cloud storage', HttpStatusCodes.NOT_FOUND);
    }
    
    console.log('✅ Stream URL generated successfully');
    return stream;
    
  } catch (error: any) {
    console.error('❌ === STREAM USE CASE ERROR ===');
    console.error('❌ Error in streamVideoU:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Re-throw the error to be handled by controller
    throw error;
  }
};