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

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  paymentId: String, // For backward compatibility
  courseId: { type: String, required: true },
  studentId: String, // Thêm field này
  amount: { type: Number, required: true },
  currency: { type: String, default: 'VND' },
  paymentMethod: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'expired', 'cancelled'],
    default: 'pending'
  },
  transactionId: String,
  responseCode: String,
  payDate: String,
  expiresAt: Date, // Thêm field này
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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