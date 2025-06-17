import { PaymentImplInterface } from '@src/frameworks/database/mongodb/repositories/paymentRepoMongodb';
import { PaymentInfo } from '@src/types/payment';

export const paymentInterface = (
  repository: ReturnType<PaymentImplInterface>
) => {
  const savePayment = async (paymentInfo: PaymentInfo) =>
    await repository.savePaymentInfo(paymentInfo);

  const getMonthlyRevenue = async () => await repository.getMonthlyRevenue();

  const getRevenueForEachMonth = async () => await repository.getRevenueForEachMonth();

  const getCoursesEnrolledPerMonth = async () => await repository.getCoursesEnrolledPerMonth();

  // ✅ ADD: VNPay payment methods
  const createPendingPayment = async (paymentData: any) =>
    await repository.createPendingPayment(paymentData);

  const getPaymentByOrderId = async (orderId: string) =>
    await repository.getPaymentByOrderId(orderId);

  const updatePaymentStatus = async (orderId: string, status: string, updateData?: any) =>
    await repository.updatePaymentStatus(orderId, status, updateData);

  const getAllPayments = async (filters: any = {}) =>
    await repository.getAllPayments(filters);

  const getPaymentById = async (paymentId: string) =>
    await repository.getPaymentById(paymentId);

  return {
    savePayment,
    getMonthlyRevenue,
    getRevenueForEachMonth,
    getCoursesEnrolledPerMonth,
    // ✅ Export VNPay methods
    createPendingPayment,
    getPaymentByOrderId,
    updatePaymentStatus,
    getAllPayments,
    getPaymentById
  };
};

export type PaymentInterface = typeof paymentInterface;