import React, { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PlayIcon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DocumentTextIcon
} from '@heroicons/react/24/outline';

// API imports
import { getProductBySeller } from '../../../api/endpoints/product/product';
import { getMyCustomers, getSellerDetails } from '../../../api/endpoints/seller';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getItemsByProduct } from '../../../api/endpoints/product/item';

// Types
import { GetProductBySellerInterface, SellerApiResponse } from '../../../api/types/apiResponses/api-response-sellers';
import { USE_MOCK_DATA, MOCK_DELAY } from '../../../config/mockConfig';
import { mockSellerProducts, mockSellerStats, mockSellerInfo, mockSellercustomers } from '../../../data/mockSellerData';

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  totalItems: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'review';
  message: string;
  timestamp: string;
}

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalItems: 0
  });
  const [recentProducts, setRecentProducts] = useState<GetProductBySellerInterface[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sellerInfo, setSellerInfo] = useState<SellerApiResponse | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // ✅ Mock Mode
      if (USE_MOCK_DATA) {
        setIsLoading(true);
        setTimeout(() => {
          setSellerInfo(mockSellerInfo as any);
          setRecentProducts(mockSellerProducts.slice(0, 5));
          setStats(mockSellerStats as unknown as DashboardStats);
          
          // Generate activities from mock data
          const activities: RecentActivity[] = mockSellerProducts
            .filter(product => product.purchaseCount > 0)
            .map((product, index) => ({
              id: `activity-${index}`,
              type: 'enrollment' as const,
              message: `${product.purchaseCount} customers đã mua ${product.title}`,
              timestamp: new Date(product.createdAt).toLocaleDateString('vi-VN')
            }));
          setRecentActivities(activities.slice(0, 5));
          
          setIsLoading(false);
        }, MOCK_DELAY);
        return;
      }

      // ✅ Production Mode
      try {
        setIsLoading(true);
        
        // Fetch seller details
        const sellerResponse = await getSellerDetails();
        setSellerInfo(sellerResponse.data);

        // Fetch products by seller
        const productsResponse = await getProductBySeller();
        const products = productsResponse.data || [];
        setRecentProducts(products.slice(0, 5)); // Show only latest 5 products

        // Fetch customers
        const customersResponse = await getMyCustomers();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const customers = customersResponse.data || [];

        // Calculate total items from all products
        let totalItems = 0;
        for (const product of products) {
          if (product.items && product.items.length > 0) {
            totalItems += product.items.length;
          }
        }

        // Calculate total revenue from all products
        const totalRevenue = products.reduce((sum: number, product: GetProductBySellerInterface) => {
          return sum + (product.price ? product.price * product.purchaseCount : 0);
        }, 0);

        // Calculate total unique customers across all products
        const totalCustomers = products.reduce((sum: number, product: GetProductBySellerInterface) => {
          return sum + product.purchaseCount;
        }, 0);

        setStats({
          totalProducts: products.length,
          totalCustomers: totalCustomers,
          totalRevenue: totalRevenue,
          totalItems: totalItems
        });

        // Generate recent activities based on real data
        const activities: RecentActivity[] = [];
        products.forEach((product: { purchaseCount: number; title: any; createdAt: string | number | Date; }, index: any) => {
          if (product.purchaseCount > 0) {
            activities.push({
              id: `activity-${index}`,
              type: 'enrollment',
              message: `${product.purchaseCount} customers purchased ${product.title}`,
              timestamp: new Date(product.createdAt).toLocaleDateString()
            });
          }
        });
        setRecentActivities(activities.slice(0, 5));

      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data
        setSellerInfo(mockSellerInfo as any);
        setRecentProducts(mockSellerProducts.slice(0, 5));
        setStats(mockSellerStats as unknown as DashboardStats);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change?: string;
    color: string;
  }> = ({ icon, title, value, change, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${color} mt-1`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.includes('green') ? 'bg-green-100' : color.includes('blue') ? 'bg-blue-100' : color.includes('yellow') ? 'bg-yellow-100' : 'bg-purple-100'}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Chào mừng trở lại{sellerInfo ? `, ${sellerInfo.firstName} ${sellerInfo.lastName}` : ''}! Tổng quan bán hàng của bạn.
            </p>
          </div>
          <Link
            to="/sellers/add-product"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Thêm sản phẩm mới
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpenIcon className="h-6 w-6 text-blue-600" />}
            title="Tổng sản phẩm"
            value={stats.totalProducts}
            change="+2 tháng này"
            color="text-blue-600"
          />
          <StatCard
            icon={<UserGroupIcon className="h-6 w-6 text-green-600" />}
            title="Tổng customers"
            value={stats.totalCustomers}
            change="+12% tháng này"
            color="text-green-600"
          />
          <StatCard
            icon={<CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />}
            title="Tổng doanh thu"
            value={`${(stats.totalRevenue / 1000000).toFixed(1)}M VND`}
            change="+8% tháng này"
            color="text-yellow-600"
          />
          <StatCard
            icon={<PlayIcon className="h-6 w-6 text-purple-600" />}
            title="Tổng items"
            value={stats.totalItems}
            change="+5 tuần này"
            color="text-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Sản phẩm gần đây</h2>
                <Link
                  to="/sellers/view-products"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => (
                    <div key={product._id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <img
                        src={product.thumbnailUrl || '/api/placeholder/64/64'}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-600">
                          {product.purchaseCount} customers purchased
                        </p>
                        <p className="text-xs text-gray-500">
                          Created on {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                        {product.price && (
                          <p className="text-xs text-green-600 font-medium">
                            ${product.price}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.isVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.isVerified ? 'Published' : 'Pending'}
                        </span>
                        <Link
                          to={`/sellers/edit-product/${product._id}`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpenIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No products created yet</p>
                    <Link
                      to="/sellers/add-product"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Create your first product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Hoạt động gần đây</h2>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === 'enrollment'
                            ? 'bg-blue-100'
                            : activity.type === 'completion'
                            ? 'bg-green-100'
                            : 'bg-yellow-100'
                        }`}
                      >
                        {activity.type === 'enrollment' && (
                          <UserGroupIcon className="h-4 w-4 text-blue-600" />
                        )}
                        {activity.type === 'completion' && (
                          <BookOpenIcon className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === 'review' && (
                          <ChartBarIcon className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ChartBarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
              <div className="space-y-3">
                <Link
                  to="/sellers/add-product"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Thêm sản phẩm mới</span>
                </Link>
                <Link
                  to="/sellers/view-products"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpenIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Quản lý sản phẩm</span>
                </Link>
                <Link
                  to="/sellers"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChartBarIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Xem thống kê</span>
                </Link>
                <Link
                  to="/sellers/view-customers"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">Quản lý customers</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;




























