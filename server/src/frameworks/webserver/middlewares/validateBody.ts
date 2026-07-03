import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';

const formatErrors = (errors: ValidationError[]): string =>
  errors
    .flatMap((error) => Object.values(error.constraints ?? {}))
    .join(', ');

export const validateBody =
  <T extends object>(DtoClass: new () => T) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return next(
        new AppError(
          `Validation error: ${formatErrors(errors)}`,
          HttpStatusCodes.BAD_REQUEST
        )
      );
    }

    req.body = dto;
    next();
  };
