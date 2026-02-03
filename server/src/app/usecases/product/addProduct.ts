import { ProductDbRepositoryInterface } from '../../repositories/productDbRepository';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import { AddProductInfoInterface } from '../../../types/productInterface';
import AppError from '../../../utils/appError';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const addProducts = async (
  sellerId: string | undefined,
  productInfo: AddProductInfoInterface,
  files: Express.Multer.File[],
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  if (!sellerId || !productInfo || !files || files.length === 0) {
    throw new AppError('Invalid input data', HttpStatusCodes.BAD_REQUEST);
  }
  console.log(files);

  const uploadPromises = files.map(async (file) => {
    let uploadedFile;

    if (file.mimetype === 'application/pdf') {
      uploadedFile = await cloudService.uploadFile(file);
      productInfo.guidelines = uploadedFile;
    }

    if (file.mimetype === 'video/mp4') {
      uploadedFile = await cloudService.uploadFile(file);
      productInfo.introduction = uploadedFile;
    }

    if (file.mimetype.includes('image')) {
      uploadedFile = await cloudService.uploadFile(file);
      productInfo.thumbnail = uploadedFile;
    }
  });

  await Promise.all(uploadPromises);

  productInfo.sellerId = sellerId;

  if (typeof productInfo.tags === 'string') {
    productInfo.tags = productInfo.tags.split(',');
  }
  if (typeof productInfo.syllabus === 'string') {
    productInfo.syllabus = productInfo.syllabus.split(',');
  }
  if (typeof productInfo.requirements === 'string') {
    productInfo.requirements = productInfo.requirements.split(',');
  }
  console.log(productInfo)
  const productId = await productDbRepository.addProduct(productInfo);

  if (!productId) {
    throw new AppError(
      'Unable to add product',
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return productId;
};
