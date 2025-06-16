export interface PaymentInfo {
  orderId?: string;
  paymentId?: string; // For backward compatibility
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  paymentMethod: string; // 'vnpay', 'stripe', etc.
  status: 'pending' | 'completed' | 'failed' | 'expired' | 'cancelled';
  transactionId?: string;
  responseCode?: string;
  payDate?: string;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VNPayPaymentData {
  orderId: string;
  courseId: string;
  studentId: string;
  amount: number;
  currency: 'VND';
  paymentMethod: 'vnpay' | 'vnpay_qr';
  status: 'pending';
  expiresAt: Date;
}