import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import configKeys from '../../../config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TutorTrek Online Course Marketplace API',
    version: '1.0.0',
    description:
      'REST API documentation for the TutorTrek e-learning marketplace (students, instructors, admin).',
  },
  servers: [
    {
      url: `http://localhost:${configKeys.PORT}`,
      description: 'Local development',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ['./src/frameworks/webserver/swagger/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });
};

export default setupSwagger;
