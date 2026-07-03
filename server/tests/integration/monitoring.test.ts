import request from 'supertest';
import express from 'express';
import mountMonitoringRoutes from '../../src/frameworks/webserver/routes/monitoring';

describe('Monitoring routes', () => {
  const app = express();
  mountMonitoringRoutes(app);

  it('returns health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('TutorTrek API');
  });

  it('returns metrics payload', async () => {
    const response = await request(app).get('/api/metrics');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('requestsServed');
    expect(response.body).toHaveProperty('memory');
  });
});
