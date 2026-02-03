import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { CreateItemInterface } from '../../../types/item';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';
import { QuizDbInterface } from '@src/app/repositories/quizDbRepository';
import { ItemDbRepositoryInterface } from '@src/app/repositories/itemDbRepository';
import * as ffprobePath from 'ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

export const editItemsU = async (
  media: Express.Multer.File[] | undefined,
  itemId: string,
  item: CreateItemInterface,
  itemDbRepository: ReturnType<ItemDbRepositoryInterface>,
  cloudService: ReturnType<CloudServiceInterface>,
  quizDbRepository: ReturnType<QuizDbInterface>
) => {
  if (!item) {
    throw new AppError('Data is not provided', HttpStatusCodes.BAD_REQUEST);
  }
  let isStudyMaterialUpdated = false,
    isItemVideoUpdated = false;
  const oldItem = await itemDbRepository.getItemById(itemId);
  if (media?.length) {
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
  item.media=[]
  if (media && media.length > 0) {
    const uploadPromises = media.map(async (file) => {
      if (file.mimetype === 'application/pdf') {
        const studyMaterial = await cloudService.uploadFile(file);
        item.media.push(studyMaterial);
        isStudyMaterialUpdated = true;
      } else {
        const itemVideo = await cloudService.uploadFile(file);
        item.media.push(itemVideo);
        isItemVideoUpdated = true;
      }
    });

    await Promise.all(uploadPromises);
  }
  const response = await itemDbRepository.editItem(itemId, item);
  if (!response) {
    throw new AppError('Failed to edit item', HttpStatusCodes.BAD_REQUEST);
  }
  await quizDbRepository.editQuiz(itemId, { questions: item.questions });
  if (response) {
    if (isItemVideoUpdated && oldItem?.media) {
      const videoObject = response.media.find(
        (item) => item.name === 'itemVideo'
      );
      await cloudService.removeFile(videoObject?.key ?? '');
    }
    if (isStudyMaterialUpdated && oldItem?.media) {
      const materialObject = response.media.find(
        (item) => item.name === 'materialFile'
      );
      await cloudService.removeFile(materialObject?.key ?? '');
    }
  }
};
