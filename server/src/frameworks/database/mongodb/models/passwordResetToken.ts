import mongoose, { Document, Schema, model } from 'mongoose';

export interface IPasswordResetToken extends Document {
  email: string;
  tokenHash: string;
  role: 'student' | 'instructor';
  expiresAt: Date;
  createdAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>({
  email: { type: String, required: true, lowercase: true, trim: true },
  tokenHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor'], required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  createdAt: { type: Date, default: Date.now },
});

passwordResetTokenSchema.index({ email: 1, role: 1 });

const PasswordResetToken = model<IPasswordResetToken>(
  'password_reset_tokens',
  passwordResetTokenSchema,
  'password_reset_tokens'
);

export default PasswordResetToken;
