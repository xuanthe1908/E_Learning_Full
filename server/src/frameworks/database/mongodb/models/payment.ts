import mongoose, { Schema, Document } from 'mongoose';

interface PaymentDocument extends Document {
  orderId?: string; // For VNPay
  paymentId?: string; // For Stripe (backward compatibility)
  customerId: string; // Đổi từ studentId
  productId: string; // Đổi từ courseId
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
  productId: { type: String, required: true }, // Đổi từ courseId
  customerId: String, // Đổi từ studentId
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
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound indexes for better query performance
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ productId: 1, customerId: 1 }); // Đổi từ courseId, studentId
paymentSchema.index({ orderId: 1, status: 1 });

// TTL index for expired payments cleanup (optional)
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Payment = mongoose.model<PaymentDocument>(
  'Payment',
  paymentSchema,
  'payment'
);

export default Payment;