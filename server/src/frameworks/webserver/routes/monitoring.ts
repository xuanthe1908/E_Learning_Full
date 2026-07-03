import express, { Application, Request, Response } from 'express';
import os from 'os';

const startedAt = Date.now();
let requestCount = 0;

export const requestMetricsMiddleware = (
  _req: Request,
  _res: Response,
  next: () => void
) => {
  requestCount += 1;
  next();
};

const monitoringRouter = () => {
  const router = express.Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'TutorTrek API',
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    });
  });

  router.get('/metrics', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      requestsServed: requestCount,
      memory: process.memoryUsage(),
      loadAverage: os.loadavg(),
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    });
  });

  return router;
};

export const mountMonitoringRoutes = (app: Application) => {
  app.use(requestMetricsMiddleware);
  app.use('/api', monitoringRouter());
};

export default mountMonitoringRoutes;
