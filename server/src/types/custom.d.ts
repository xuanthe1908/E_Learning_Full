import { Request } from 'express';

export interface CustomRequest extends Request {
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
