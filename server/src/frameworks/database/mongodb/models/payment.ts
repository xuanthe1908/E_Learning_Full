import mongoose, { Schema, Document } from 'mongoose';

interface PaymentDocument extends Document {
  orderId?: string; // For VNPay
  paymentId?: string; // For Stripe (backward compatibility)
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  paymentMethod: string; // Renamed from payment_method
  status: 'pending' | 'completed' | 'failed' | 'expired' | 'cancelled';
  transactionId?: string;
  responseCode?: string;
  payDate?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

const paymentSchema: Schema<PaymentDocument> = new Schema({
  orderId: { type: String, sparse: true, index: true }, // VNPay order ID
  paymentId: { type: String, sparse: true }, // Stripe payment ID (backward compatibility)
  studentId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'VND' },
  paymentMethod: { type: String, required: true }, // vnpay, stripe, etc.
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'completed', 'failed', 'expired', 'cancelled'],
    default: 'pending',
    index: true
  },
  transactionId: { type: String }, // VNPay transaction ID
  responseCode: { type: String }, // VNPay response code
  payDate: { type: String }, // VNPay pay date
  expiresAt: { type: Date, index: true }, // Payment expiration
  createdAt: { type: Date, required: true, default: Date.now, index: true },
  updatedAt: { type: Date }
});

// Compound indexes for better query performance
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ courseId: 1, studentId: 1 });
paymentSchema.index({ orderId: 1, status: 1 });

// TTL index for expired payments cleanup (optional)
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Payment = mongoose.model<PaymentDocument>(
  'Payment',
  paymentSchema,
  'payment'
);

export default Payment;