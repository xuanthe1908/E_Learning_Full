import mongoose, { Document, Schema, model } from 'mongoose';

export interface IAdminEarning extends Document {
  month: number;
  year: number;
  courseId: mongoose.Types.ObjectId;
  paymentId: string;
  amount: number;
  currency: string;
  createdAt: Date;
}

const adminEarningSchema = new Schema<IAdminEarning>({
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    required: true,
    index: true,
  },
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'VND' },
  createdAt: { type: Date, default: Date.now },
});

adminEarningSchema.index({ year: 1, month: 1 });

const AdminEarning = model<IAdminEarning>(
  'admin_earnings',
  adminEarningSchema,
  'admin_earnings'
);

export default AdminEarning;
