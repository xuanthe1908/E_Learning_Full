import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { CloudServiceInterface } from '../../app/services/cloudServiceInterface';
import { CloudServiceImpl } from '../../frameworks/services/s3CloudService';
import { streamVideoU } from '../../app/usecases/videoStream/stream';
import HttpStatusCodes from '../../constants/HttpStatusCodes';

const videoStreamController = (
  cloudServiceInterface: CloudServiceInterface,
  cloudServiceImpl: CloudServiceImpl
) => {
  const cloudService = cloudServiceInterface(cloudServiceImpl());

  const streamVideo = asyncHandler(async (req: Request, res: Response) => {
    console.log('🎥 === VIDEO STREAM REQUEST DEBUG ===');
    console.log('📝 Request params:', req.params);
    console.log('📝 Request headers:', req.headers);
    console.log('📝 Request method:', req.method);
    console.log('📝 Request path:', req.path);
    
    try {
      const videoFileId = req.params.videoFileId;
      console.log(`🎯 Video file ID received: "${videoFileId}"`);
      
      if (!videoFileId) {
        console.error('❌ Video file ID is missing');
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Video file ID is required'
        });
        return;
      }

      // Decode URL-encoded key
      const decodedVideoKey = decodeURIComponent(videoFileId);
      console.log(`🔍 Decoded video key: "${decodedVideoKey}"`);
      console.log(`📏 Video key length: ${decodedVideoKey.length}`);

      // Call use case to get video URL
      console.log('🚀 Calling streamVideoU use case...');
      const videoUrl = await streamVideoU(decodedVideoKey, cloudService);
      console.log(`📤 streamVideoU returned: "${videoUrl}"`);
      if (!videoUrl || videoUrl === '/placeholder-image.png') {
        console.error('❌ Video URL is placeholder or null');
        res.status(HttpStatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Video not found or unavailable',
          debug: {
            videoKey: decodedVideoKey,
            returnedUrl: videoUrl
          }
        });
        return;
      }

      console.log(`✅ Successfully generated video URL for key: ${decodedVideoKey}`);
      console.log(`✅ Final video URL: ${videoUrl}`);
      
      const responseData = {
        status: 'success',
        message: 'Successfully retrieved video url',
        data: videoUrl,
        metadata: {
          videoKey: decodedVideoKey,
          timestamp: new Date().toISOString(),
          urlLength: videoUrl.length
        }
      };
      
      console.log('📤 Sending response:', responseData);
      res.status(200).json(responseData);
     
    } catch (error: any) {
      console.error('❌ === VIDEO STREAM ERROR ===');
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to stream video',
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : 'Internal server error'
      });
    }
  });

  return {
    streamVideo
  };
};

export default videoStreamController;