import mongoose, { Document, Schema, model } from 'mongoose';

export interface IPayout extends Document {
  instructorId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  createdAt: Date;
  paidAt?: Date;
}

const payoutSchema = new Schema<IPayout>({
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: 'instructor',
    required: true,
    index: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    required: true,
    index: true,
  },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'VND' },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
});

const Payout = model<IPayout>('payouts', payoutSchema, 'payouts');

export default Payout;
