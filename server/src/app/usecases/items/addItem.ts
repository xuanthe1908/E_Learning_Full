import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { CreateItemInterface } from '../../../types/item';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';
import { QuizDbInterface } from '@src/app/repositories/quizDbRepository';
import { ItemDbRepositoryInterface } from '@src/app/repositories/itemDbRepository';
import * as ffprobePath from 'ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

export const addItemsU = async (
  media: Express.Multer.File[] | undefined,
  productId: string | undefined,
  sellerId: string | undefined,
  item: CreateItemInterface,
  itemDbRepository: ReturnType<ItemDbRepositoryInterface>,
  cloudService: ReturnType<CloudServiceInterface>,
  quizDbRepository: ReturnType<QuizDbInterface>
) => {
  if (!productId) {
    throw new AppError(
      'Please provide a product id',
      HttpStatusCodes.BAD_REQUEST
    );
  }

  if (!sellerId) {
    throw new AppError(
      'Please provide a seller id',
      HttpStatusCodes.BAD_REQUEST
    );
  }

  if (!item) {
    throw new AppError('Data is not provided', HttpStatusCodes.BAD_REQUEST);
  }

  if (media) {
    const videoFile = media[0];
    const tempFilePath = './temp_video.mp4';
    fs.writeFileSync(tempFilePath, videoFile.buffer);

    const getVideoDuration = () =>
      new Promise<string>((resolve, reject) => {
        ffmpeg(tempFilePath)
          .setFfprobePath(ffprobePath.path)
          .ffprobe((err: Error | null, data: any) => {
            fs.unlinkSync(tempFilePath);

            if (err) {
              console.error('Error while probing the video:', err);
              reject(err);
            }

            const duration: string = data.format.duration;
            resolve(duration);
          });
      });

    try {
      const videoDuration = await getVideoDuration();
      item.duration = parseFloat(videoDuration);
    } catch (error) {
      console.error('Error while getting video duration:', error);
    }
  }

  if (media) {
    item.media = await Promise.all(
      media.map(async (files) => await cloudService.uploadFile(files))
    );
  }
  const itemId = await itemDbRepository.addItem(
    productId,
    sellerId,
    item
  );
  if (!itemId) {
    throw new AppError('Data is not provided', HttpStatusCodes.BAD_REQUEST);
  }
  const quiz = {
    productId,
    itemId: itemId.toString(),
    questions: item.questions
  };
  await quizDbRepository.addQuiz(quiz);
};
