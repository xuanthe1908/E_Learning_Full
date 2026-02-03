import { ProductDbRepositoryInterface } from '../../repositories/productDbRepository';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import { EditProductInfo } from '../../../types/productInterface';
import AppError from '../../../utils/appError';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const editProductU = async (
  productId: string,
  sellerId: string | undefined,
  files: Express.Multer.File[],
  productInfo: EditProductInfo,
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  let isThumbnailUpdated = false,
    isGuideLinesUpdated = false;
  if (!productId) {
    throw new AppError(
      'Please provide product id ',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (!sellerId) {
    throw new AppError(
      'Please provide seller id ',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (!productInfo) {
    throw new AppError(
      'Please provide product details',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const oldProduct = await productDbRepository.getProductById(productId);

  if (files && files.length > 0) {
    const uploadPromises = files.map(async (file) => {
      if (file.mimetype === 'application/pdf') {
        const guidelines = await cloudService.uploadFile(file);
        productInfo.guidelines = guidelines;
        isGuideLinesUpdated = true;
      } else {
        const thumbnail = await cloudService.uploadFile(file);
        productInfo.thumbnail = thumbnail;
        isThumbnailUpdated = true;
      }
    });

    await Promise.all(uploadPromises);
  }
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

  const response = await productDbRepository.editProduct(productId, productInfo);
  if (response) {
    if (isGuideLinesUpdated && oldProduct?.guidelines) {
      await cloudService.removeFile(oldProduct.guidelines.key);
    }
    if (isThumbnailUpdated && oldProduct?.thumbnail) {
      await cloudService.removeFile(oldProduct.thumbnail.key);
    }
  }
};
