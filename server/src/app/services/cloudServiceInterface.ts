import { CloudServiceImpl } from '../../frameworks/services/s3CloudService';

export const cloudServiceInterface = (service: ReturnType<CloudServiceImpl>) => {
  const uploadFile = async (file: Express.Multer.File) => await service.uploadFile(file);
  
  // ✅ Remove uploadAndGetUrl since we removed it from s3CloudService
  // const uploadAndGetUrl = async (file:Express.Multer.File) => await service.uploadAndGetUrl(file)
  
  const getFile = async (fileKey: string) => await service.getFile(fileKey);
  
  const getVideoStream = async (key: string) => await service.getVideoStream(key);
  
  const getCloudFrontUrl = async (fileKey: string) => await service.getCloudFrontUrl(fileKey);
  
  const removeFile = async (fileKey: string) => await service.removeFile(fileKey);
  
  // ✅ Add new function from enhanced service
  const checkFileExists = async (fileKey: string) => await service.checkFileExists(fileKey);

  return {
    uploadFile,
    getFile,
    getVideoStream,
    getCloudFrontUrl,
    removeFile,
    checkFileExists
  };
};

export type CloudServiceInterface = typeof cloudServiceInterface;