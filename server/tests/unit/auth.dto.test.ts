import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ForgotPasswordDto } from '../../src/dtos/auth.dto';

describe('ForgotPasswordDto validation', () => {
  it('accepts valid student reset request', async () => {
    const dto = plainToInstance(ForgotPasswordDto, {
      email: 'student1@tutortrek.com',
      role: 'student',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid email', async () => {
    const dto = plainToInstance(ForgotPasswordDto, {
      email: 'not-an-email',
      role: 'student',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
