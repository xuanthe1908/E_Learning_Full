import Payment from '../models/payment';
import { PaymentInfo } from '@src/types/payment';

export const paymentRepositoryMongodb = () => {
  const savePaymentInfo = async (paymentInfo: PaymentInfo) => {
    const newPaymentInfo = new Payment(paymentInfo);
    const response = await newPaymentInfo.save();
    return response;
  };

  // Add new methods for VNPay integration
  const createPendingPayment = async (paymentData: any) => {
    const payment = new Payment({
      ...paymentData,
      status: 'pending',
      createdAt: new Date()
    });
    return await payment.save();
  };

  const getPaymentByOrderId = async (orderId: string) => {
    return await Payment.findOne({ orderId }).lean();
  };

  const updatePaymentStatus = async (orderId: string, status: string, updateData?: any) => {
    const updatePayload = {
      status,
      updatedAt: new Date(),
      ...updateData
    };
    
    return await Payment.findOneAndUpdate(
      { orderId },
      updatePayload,
      { new: true }
    );
  };

  const getMonthlyRevenue = async () => {
    const currentMonth = new Date().getMonth() + 1;
    const pipeline = [
      {
        $match: {
          status: 'completed',
          $expr: {
            $eq: [{ $month: '$createdAt' }, currentMonth]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ];
    const revenue: Array<{ _id: null; totalAmount: number }> =
      await Payment.aggregate(pipeline);

    return revenue.length > 0 ? revenue[0].totalAmount : 0;
  };

  const getRevenueForEachMonth = async () => {
    const revenueByMonth = await Payment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: {
            $month: '$createdAt'
          },
          totalRevenue: { $sum: '$amount' } 
        }
      },
      {
        $project: {
          month: '$_id',
          totalRevenue: 1,
          _id: 0
        }
      },
      {
        $sort: {
          month: 1
        }
      }
    ]);
    return revenueByMonth;
  };

  const getCoursesEnrolledPerMonth = async () => {
    const enrolled = await Payment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: {
          month: 1
        }
      }
    ]);
    return enrolled;
  };

  const getAllPayments = async (filters: any = {}) => {
    const query: any = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) {
        query.createdAt.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        query.createdAt.$lte = new Date(filters.dateTo);
      }
    }
    
    if (filters.courseId) {
      query.courseId = filters.courseId;
    }

    const limit = parseInt(filters.limit) || 50;
    const offset = parseInt(filters.offset) || 0;

    return await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();
  };

  const getPaymentById = async (paymentId: string) => {
    return await Payment.findById(paymentId).lean();
  };

  return {
    savePaymentInfo,
    createPendingPayment,
    getPaymentByOrderId,
    updatePaymentStatus,
    getMonthlyRevenue,
    getRevenueForEachMonth,
    getCoursesEnrolledPerMonth,
    getAllPayments,
    getPaymentById
  };
};

export type PaymentRepositoryMongoDbInterface = typeof paymentRepositoryMongodb;
export type PaymentImplInterface = typeof paymentRepositoryMongodb;