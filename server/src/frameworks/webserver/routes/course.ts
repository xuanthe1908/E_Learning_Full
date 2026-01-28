import express from 'express';
import courseController from '../../../adapters/controllers/courseController';
import { courseRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/courseReposMongoDb';
import { courseDbRepository } from '../../../app/repositories/courseDbRepository';
import roleCheckMiddleware from '../middlewares/roleCheckMiddleware';
import { cloudServiceInterface } from '../../../app/services/cloudServiceInterface';
import { s3Service } from '../../../frameworks/services/s3CloudService';
import upload from '../middlewares/multer';
import { quizDbRepository } from '../../../app/repositories/quizDbRepository';
import { quizRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/quizzDbRepository';
import { lessonDbRepository } from '../../../app/repositories/lessonDbRepository';
import { lessonRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/lessonRepoMongodb';
import { discussionDbRepository } from '../../../app/repositories/discussionDbRepository';
import { discussionRepositoryMongoDb } from '../../../frameworks/database/mongodb/repositories/discussionsRepoMongodb';
import { paymentRepositoryMongodb } from '../../../frameworks/database/mongodb/repositories/paymentRepoMongodb';
import { paymentInterface } from '../../../app/repositories/paymentDbRepository';
import jwtAuthMiddleware from '../middlewares/userAuth';
import { redisCacheRepository } from '../../../frameworks/database/redis/redisCacheRepository';
import { cacheRepositoryInterface } from '../../../app/repositories/cachedRepoInterface';
import { RedisClient } from '../../../app';
import { cachingMiddleware } from '../middlewares/redisCaching';

const courseRouter = (redisClient: RedisClient) => {
  const router = express.Router();
  const controller = courseController(
    cloudServiceInterface,
    s3Service,
    courseDbRepository,
    courseRepositoryMongodb,
    quizDbRepository,
    quizRepositoryMongodb,
    lessonDbRepository,
    lessonRepositoryMongodb,
    discussionDbRepository,
    discussionRepositoryMongoDb,
    paymentInterface,
    paymentRepositoryMongodb,
    cacheRepositoryInterface,
    redisCacheRepository,
    redisClient
  );
  //* Add product (Seller)
  router.post(
    '/sellers/add-product',
    jwtAuthMiddleware,
    roleCheckMiddleware('instructor'),
    upload.array('files'),
    controller.addCourse
  );

  router.put(
    '/sellers/edit-product/:courseId',
    jwtAuthMiddleware,
    roleCheckMiddleware('instructor'),
    upload.array('files'),
    controller.editCourse
  );

  router.get(
    '/list',
    cachingMiddleware(redisClient, 'all-products'), 
    controller.getAllCourses
  );

  router.get('/:productId', controller.getIndividualCourse);

  router.get(
    '/sellers/my-products',
    jwtAuthMiddleware,
    roleCheckMiddleware('instructor'),
    controller.getCoursesByInstructor
  );

  router.post(
    '/sellers/add-item/:courseId',
    jwtAuthMiddleware,
    roleCheckMiddleware('instructor'),
    upload.array('media'),
    controller.addLesson
  );

  router.put(
    '/sellers/edit-item/:lessonId',
    jwtAuthMiddleware,
    roleCheckMiddleware('instructor'),
    upload.array('media'),
    controller.editLesson
  );

  router.get(
    '/sellers/get-items-by-product/:courseId',
    controller.getLessonsByCourse
  );

  router.get('/items/:lessonId', controller.getLessonById);

  router.get('/items/:lessonId/quizzes', controller.getQuizzesByLesson);

  router.post(
    '/items/add-discussion/:lessonId',
    jwtAuthMiddleware,
    controller.addDiscussion
  );

  router.get(
    '/items/get-discussions-by-item/:lessonId',
    controller.getDiscussionsByLesson
  );

  router.patch(
    '/items/edit-discussion/:discussionId',
    jwtAuthMiddleware,
    controller.editDiscussions
  );

  router.delete(
    '/items/delete-discussion/:discussionId',
    jwtAuthMiddleware,
    controller.deleteDiscussion
  );

  router.put(
    '/items/reply-discussion/:discussionId',
    jwtAuthMiddleware,
    controller.replyDiscussion
  );

  router.get(
    '/items/replies-based-on-discussion/:discussionId',
    controller.getRepliesByDiscussion
  );

  router.post(
    '/purchase/:courseId',
    jwtAuthMiddleware,
    controller.enrollStudent
  );

  router.get(
    '/recommended',
    jwtAuthMiddleware,
    roleCheckMiddleware('student'),
    controller.getRecommendedCourseByStudentInterest
  );

  router.get('/trending', controller.getTrendingCourses);

  router.get(
    '/customers/my-products',
    jwtAuthMiddleware,
    controller.getCourseByStudent
  );

  router.get(
    '/search',
    cachingMiddleware(redisClient),
    controller.searchCourse
  );

  return router;
};
export default courseRouter;
