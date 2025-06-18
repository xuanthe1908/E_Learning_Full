// server/src/frameworks/webserver/middlewares/userAuth.ts
import { NextFunction, Response } from 'express';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { authService } from '../../services/authService';
import { CustomRequest } from '@src/types/customRequest';
import { JwtPayload } from '@src/types/common';

const jwtAuthMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  console.log('🔍 DEBUG Auth Middleware:');
  console.log('- Request URL:', req.url);
  console.log('- Request Method:', req.method);
  console.log('- Authorization Header:', req.headers.authorization);

  let token: string | null = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ Token extracted:', token ? 'Present' : 'Missing');
  }
  
  if (!token) {
    console.log('❌ No token found');
    throw new AppError('Token not found', HttpStatusCodes.UNAUTHORIZED);
  }
  
  try {
    const verificationResult = authService().verifyToken(token);
    console.log('🔐 Token verification result:', verificationResult);
    
    // ✅ Kiểm tra cấu trúc payload
    let payload;
    if (verificationResult && typeof verificationResult === 'object') {
      // Token có thể được wrap trong object { payload: ... }
      payload = (verificationResult as any).payload || verificationResult;
    } else {
      payload = verificationResult;
    }
    
    console.log('👤 User payload:', payload);
    req.user = payload;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    throw new AppError('Session is expired please login again', HttpStatusCodes.FORBIDDEN);
  }
};

export default jwtAuthMiddleware;