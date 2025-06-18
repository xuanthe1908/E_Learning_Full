import { Request } from 'express';

declare module 'express-rate-limit';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        Id?: string;
        email?: string;
        role?: string;
        payload?: {
          Id?: string;
          email?: string;
          role?: string;
        };
      };
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
