import { CourseDbRepositoryInterface } from '../../repositories/courseDbRepository';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import { EditCourseInfo } from '../../../types/courseInterface';
import AppError from '../../../utils/appError';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const editCourseU = async (
  courseId: string,
  editorId: string | undefined,
  files: Express.Multer.File[],
  courseInfo: EditCourseInfo,
  cloudService: ReturnType<CloudServiceInterface>,
  courseDbRepository: ReturnType<CourseDbRepositoryInterface>,
  options?: { isAdmin?: boolean }
) => {
  let isThumbnailUpdated = false,
    isGuideLinesUpdated = false;
  if (!courseId) {
    throw new AppError(
      'Please provide course id ',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (!editorId) {
    throw new AppError(
      'Please provide editor id ',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (!courseInfo) {
    throw new AppError(
      'Please provide course details',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const oldCourse = await courseDbRepository.getCourseById(courseId);
  if (!oldCourse) {
    throw new AppError('Course not found', HttpStatusCodes.NOT_FOUND);
  }

  const instructorId = options?.isAdmin
    ? String(oldCourse.instructorId)
    : editorId;

  if (
    !options?.isAdmin &&
    String(oldCourse.instructorId) !== String(editorId)
  ) {
    throw new AppError(
      'You are not allowed to edit this course',
      HttpStatusCodes.FORBIDDEN
    );
  }

  if (files && files.length > 0) {
    const uploadPromises = files.map(async (file) => {
      if (file.mimetype === 'application/pdf') {
        const guidelines = await cloudService.upload(file);
        courseInfo.guidelines = guidelines;
        isGuideLinesUpdated = true;
      } else {
        const thumbnail = await cloudService.upload(file);
        courseInfo.thumbnail = thumbnail;
        isThumbnailUpdated = true;
      }
    });

    await Promise.all(uploadPromises);
  }
  courseInfo.instructorId = instructorId;

  if (typeof courseInfo.tags === 'string') {
    courseInfo.tags = courseInfo.tags.split(',');
  }

  if (typeof courseInfo.syllabus === 'string') {
    courseInfo.syllabus = courseInfo.syllabus.split(',');
  }

  if (typeof courseInfo.requirements === 'string') {
    courseInfo.requirements = courseInfo.requirements.split(',');
  }

  const response = await courseDbRepository.editCourse(courseId, courseInfo);
  if (response) {
    if (isGuideLinesUpdated && oldCourse?.guidelines) {
      await cloudService.removeFile(oldCourse.guidelines.key);
    }
    if (isThumbnailUpdated && oldCourse?.thumbnail) {
      await cloudService.removeFile(oldCourse.thumbnail.key);
    }
  }
};
