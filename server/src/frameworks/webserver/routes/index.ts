import { Application } from 'express';
import authRouter from './auth';
import adminRouter from './admin';
import courseRouter from './course';
import instructorRouter from './instructor';
import { RedisClient } from '../../../app';
import jwtAuthMiddleware from '../middlewares/userAuth';
import roleCheckMiddleware from '../middlewares/roleCheckMiddleware';
import videoStreamRouter from './videoStream';
import refreshRouter from './refresh';
import paymentRouter from './payment';
import categoryRouter from './category';
import studentRouter from './student';
import shopRouter from './shop'; 

const routes = (app: Application, redisClient: RedisClient) => {
  app.use('/api/auth', authRouter());
  app.use('/api/all/refresh-token', refreshRouter());
  app.use(
    '/api/admin',
    jwtAuthMiddleware,
    roleCheckMiddleware('admin'),
    adminRouter()
  );
  app.use('/api/category', categoryRouter());
  app.use('/api/products', courseRouter(redisClient)); // Products routes (using course model for now)
  app.use('/api/video-streaming', videoStreamRouter());
  app.use('/api/sellers', instructorRouter()); // Sellers routes
  app.use('/api/payments', jwtAuthMiddleware, paymentRouter());
  app.use('/api/customers', studentRouter(redisClient)); // Customers routes
  app.use('/api/shop/chat', shopRouter()); // Shop AI Chat routes
};

export default routes;