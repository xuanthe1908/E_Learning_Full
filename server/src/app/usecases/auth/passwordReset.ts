import crypto from 'crypto';
import PasswordResetToken from '../../../frameworks/database/mongodb/models/passwordResetToken';
import Students from '../../../frameworks/database/mongodb/models/student';
import Instructor from '../../../frameworks/database/mongodb/models/instructor';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import configKeys from '../../../config';
import { SendEmailService } from '../../../frameworks/services/sendEmailService';
import { authService } from '../../../frameworks/services/authService';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const requestPasswordResetU = async (
  email: string,
  role: 'student' | 'instructor',
  emailService: ReturnType<SendEmailService>
) => {
  const normalizedEmail = email.toLowerCase().trim();
  const account =
    role === 'student'
      ? await Students.findOne({ email: normalizedEmail })
      : await Instructor.findOne({ email: normalizedEmail });

  if (!account) {
    throw new AppError('No account found with this email', HttpStatusCodes.NOT_FOUND);
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);

  await PasswordResetToken.deleteMany({ email: normalizedEmail, role });

  await PasswordResetToken.create({
    email: normalizedEmail,
    tokenHash,
    role,
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  });

  const resetUrl = `${configKeys.ORIGIN_PORT}/reset-password?token=${rawToken}&role=${role}`;
  emailService.sendEmail(
    normalizedEmail,
    'TutorTrek Password Reset',
    `Click the link below to reset your password (valid for 1 hour):\n\n${resetUrl}`
  );

  return { message: 'Password reset email sent' };
};

export const resetPasswordWithTokenU = async (
  token: string,
  newPassword: string
) => {
  const tokenHash = hashToken(token);
  const resetRecord = await PasswordResetToken.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRecord) {
    throw new AppError('Invalid or expired reset token', HttpStatusCodes.BAD_REQUEST);
  }

  const auth = authService();
  const hashedPassword = await auth.hashPassword(newPassword);

  if (resetRecord.role === 'student') {
    await Students.updateOne(
      { email: resetRecord.email },
      { $set: { password: hashedPassword } }
    );
  } else {
    await Instructor.updateOne(
      { email: resetRecord.email },
      { $set: { password: hashedPassword } }
    );
  }

  await PasswordResetToken.deleteMany({ email: resetRecord.email, role: resetRecord.role });

  return { message: 'Password reset successful' };
};
