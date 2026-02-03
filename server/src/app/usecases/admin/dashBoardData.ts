import { ProductDbRepositoryInterface } from '../../../app/repositories/productDbRepository';
import { SellerDbInterface } from '../../../app/repositories/sellerDbRepository';
import { CustomersDbInterface } from '../../../app/repositories/customerDbRepository';
import { PaymentInterface } from '../../../app/repositories/paymentDbRepository';
import { CategoryDbInterface } from '@src/app/repositories/categoryDbRepository';

export const getDashBoardDetailsU = async (
  dbRepositoryProduct: ReturnType<ProductDbRepositoryInterface>,
  dbRepositorySeller: ReturnType<SellerDbInterface>,
  dbRepositoryCustomer: ReturnType<CustomersDbInterface>,
  dbRepositoryPayment: ReturnType<PaymentInterface>
) => {
  const [numberOfProducts, numberSellers, numberOfCustomers, monthlyRevenue] =
    await Promise.allSettled([
      dbRepositoryProduct.getTotalNumberOfProducts(),
      dbRepositorySeller.getTotalNumberOfSellers(),
      dbRepositoryCustomer.getTotalNumberOfCustomers(),
      dbRepositoryPayment.getMonthlyRevenue()
    ]);

  return {
    numberOfProducts:
      numberOfProducts.status === 'fulfilled' ? numberOfProducts.value : null,
    numberSellers:
      numberSellers.status === 'fulfilled' ? numberSellers.value : null,
    numberOfCustomers:
      numberOfCustomers.status === 'fulfilled' ? numberOfCustomers.value : null,
    monthlyRevenue:
      monthlyRevenue.status === 'fulfilled' ? monthlyRevenue.value : null
  };
};

export const getGraphDetailsU = async (
  dbRepositoryProduct: ReturnType<ProductDbRepositoryInterface>,
  dbRepositoryCategory: ReturnType<CategoryDbInterface>,
  dbRepositoryPayment: ReturnType<PaymentInterface>
) => {
  const [
    trendingProducts,
    productByCategory,
    revenueForEachMonth,
    productsAdded,
    productsPurchased
  ] = await Promise.allSettled([
    dbRepositoryProduct.getTrendingProduct(),
    dbRepositoryCategory.getProductCountByCategory(),
    dbRepositoryPayment.getRevenueForEachMonth(),
    dbRepositoryProduct.getNumberOfProductsAddedInEachMonth(),
    dbRepositoryPayment.getProductsPurchasedPerMonth()
  ]);

  let trending: Array<{ title: string; purchased: number }> = [];
  if (trendingProducts.status === 'fulfilled') {
    trendingProducts.value.map((product) => {
      trending.push({
        title: product?.title,
        purchased: product.productsPurchased?.length
      });
    });
  }

  let revenueData: Array<{
    month: string;
    revenue: number;
    productsAdded: number;
    productsPurchased: number;
  }> = [];
  if (
    revenueForEachMonth.status === 'fulfilled' &&
    productsAdded.status === 'fulfilled' &&
    productsPurchased.status === 'fulfilled'
  ) {
    const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    revenueData = allMonths.map((month) => {
      const matchedRevenueMonth = revenueForEachMonth.value.find(
        (data: { month: number; totalRevenue: number }) => data.month === month
      );
      const matchedAddedMonth = productsAdded.value.find(
        (data: { month: number; count: number }) => data.month === month
      );
      const matchedPurchasedMonth = productsPurchased.value.find(
        (data: { month: number; count: number }) => data.month === month
      );
      return {
        month: monthNames[month - 1],
        revenue: matchedRevenueMonth ? matchedRevenueMonth.totalRevenue : 0,
        productsAdded: matchedAddedMonth ? matchedAddedMonth.count : 0,
        productsPurchased: matchedPurchasedMonth ? matchedPurchasedMonth.count : 0
      };
    });
  }

  return {
    revenue: revenueData,
    trendingProducts: trending,
    productByCategory:
      productByCategory.status === 'fulfilled' ? productByCategory.value : null
  };
};
