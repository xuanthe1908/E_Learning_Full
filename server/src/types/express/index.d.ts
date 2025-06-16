import { Request } from 'express';

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
  }
}

export {};
