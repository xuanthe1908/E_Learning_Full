import React, { useState, useEffect } from "react";
import RevenueChart from "./revenue-chart";
import TrendingCoursesChart from "./trending-chart";
import CourseCategoryChart from "./progress-chart";
import { Typography } from "@material-tailwind/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FaMoneyBillWave, FaRupeeSign } from "react-icons/fa";
import {
  AiOutlineUser,
  AiOutlineBook,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import {
  getDashboardData,
  getGraphData,
} from "../../../api/endpoints/dashboard-data";
import {
  DashData,
  GraphData,
} from "../../../api/types/apiResponses/api-response-dash";
import {formatToVND } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { USE_MOCK_DATA, MOCK_DELAY } from "../../../config/mockConfig";
import { mockAdminDashboard } from "../../../data/mockDashboardData";

const AdminHomePage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashData | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardDetails = async () => {
    // ✅ Mock Mode
    if (USE_MOCK_DATA) {
      setTimeout(() => {
        setDashboardData({
          totalUsers: mockAdminDashboard.totalUsers,
          totalSellers: mockAdminDashboard.totalSellers,
          totalCustomers: mockAdminDashboard.totalCustomers,
          totalCourses: mockAdminDashboard.totalProducts,
          totalRevenue: mockAdminDashboard.totalRevenue,
          totalOrders: mockAdminDashboard.totalOrders,
          pendingInstructorRequests: mockAdminDashboard.pendingSellerRequests,
          blockedUsers: mockAdminDashboard.blockedUsers,
        } as any);
      }, MOCK_DELAY);
      return;
    }

    // ✅ Production Mode
    try {
      const response = await getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      console.error("Dashboard data error:", error);
      // Fallback to mock data
      setDashboardData({
        totalUsers: mockAdminDashboard.totalUsers,
        totalSellers: mockAdminDashboard.totalSellers,
        totalCustomers: mockAdminDashboard.totalCustomers,
        totalCourses: mockAdminDashboard.totalProducts,
        totalRevenue: mockAdminDashboard.totalRevenue,
        totalOrders: mockAdminDashboard.totalOrders,
        pendingInstructorRequests: mockAdminDashboard.pendingSellerRequests,
        blockedUsers: mockAdminDashboard.blockedUsers,
      } as any);
    }
  };

  const fetchGraphData = async () => {
    // ✅ Mock Mode
    if (USE_MOCK_DATA) {
      setTimeout(() => {
        setGraphData({
          revenueData: mockAdminDashboard.revenueChart.data.map((val, idx) => ({
            month: mockAdminDashboard.revenueChart.labels[idx].substring(0, 3),
            revenue: val,
            coursesAdded: 0,
            coursesEnrolled: 0,
          })),
          trendingCourses: mockAdminDashboard.recentOrders.slice(0, 5).map((order, idx) => ({
            _id: order.orderId,
            title: order.productName,
            enrolled: idx + 1,
          })),
          categoryData: mockAdminDashboard.categoryStats.map((cat, idx) => ({
            _id: String(idx + 1),
            name: cat.category,
            courseCount: cat.count,
          })),
        } as any);
      }, MOCK_DELAY);
      return;
    }

    // ✅ Production Mode
    try {
      const response = await getGraphData();
      setGraphData(response.data);
    } catch (error) {
      console.error("Graph data error:", error);
      // Fallback to mock data
      setGraphData({
        revenueData: mockAdminDashboard.revenueChart.data.map((val, idx) => ({
          month: mockAdminDashboard.revenueChart.labels[idx].substring(0, 3),
          revenue: val,
          coursesAdded: 0,
          coursesEnrolled: 0,
        })),
        trendingCourses: mockAdminDashboard.recentOrders.slice(0, 5).map((order, idx) => ({
          _id: order.orderId,
          title: order.productName,
          enrolled: idx + 1,
        })),
        categoryData: mockAdminDashboard.categoryStats.map((cat, idx) => ({
          _id: String(idx + 1),
          name: cat.category,
          courseCount: cat.count,
        })),
      } as any);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDashboardDetails(),
          fetchGraphData()
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="pl-1">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // ✅ Default data for charts when API data is null/undefined
  const defaultRevenueData = [
    { month: 'Jan', revenue: 0, coursesAdded: 0, coursesEnrolled: 0 },
    { month: 'Feb', revenue: 0, coursesAdded: 0, coursesEnrolled: 0 },
    { month: 'Mar', revenue: 0, coursesAdded: 0, coursesEnrolled: 0 },
  ];

  const defaultTrendingData = [
    { title: 'No Data', enrolled: 0 }
  ];

  const defaultCategoryData = [
    { _id: '1', name: 'No Categories', courseCount: 1 }
  ];

  return (
    <div className='pl-1'>
      <div className='ml-3 mr-3 flex items-center justify-between'>
        <div className='bg-white flex-1 rounded-md pb-5 pr-5 pl-5 border shadow-sm border-gray-200 mr-4'>
          <div className='flex items-center '>
            <FaMoneyBillWave size={26} className='text-green-500 mr-3' />
            <div>
              <Typography variant='h6' color='blue-gray' className='pt-2 '>
                Doanh thu tháng
              </Typography>
              <Typography variant='body' color='gray'>
                {formatToVND(dashboardData?.monthlyRevenue ?? 0)}
              </Typography>
            </div>
          </div>
        </div>

        <div className='bg-white flex-1 rounded-md pb-5 pr-5 pl-5 border shadow-sm border-gray-200 mr-4'>
          <div className='flex items-center '>
            <AiOutlineBook size={26} className='text-blue-500 mr-3' />
            <div>
              <Typography variant='h6' color='blue-gray' className='pt-2'>
                Tổng sản phẩm
              </Typography>
              <Typography variant='body' color='gray'>
                {dashboardData?.numberOfCourses ?? 0}
              </Typography>
            </div>
          </div>
        </div>

        <div className='bg-white flex-1 rounded-md pb-5 pr-5 pl-5 border shadow-sm border-gray-200 mr-4'>
          <div className='flex items-center '>
            <AiOutlineUser size={26} className='text-purple-500 mr-3' />
            <div>
              <Typography variant='h6' color='blue-gray' className='pt-2'>
                Tổng sellers
              </Typography>
              <Typography variant='body' color='gray'>
                {dashboardData?.numberInstructors ?? 0}
              </Typography>
            </div>
          </div>
        </div>

        <div className='bg-white flex-1 rounded-md pb-5 pr-5 pl-5 border shadow-sm border-gray-200'>
          <div className='flex items-center '>
            <AiOutlineUsergroupAdd size={26} className='text-orange-500 mr-3' />
            <div>
              <Typography variant='h6' color='blue-gray' className='pt-2'>
                Tổng customers
              </Typography>
              <Typography variant='body' color='gray'>
                {dashboardData?.numberOfStudents ?? 0}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className='ml-3 mr-3 mt-6 flex items-start justify-between'>
        <div className='flex-1 mr-4'>
          <Typography variant='h5' color='blue-gray' className='mb-4'>
            Biểu đồ doanh thu
          </Typography>
          {/* ✅ Pass safe data with fallback */}
          <RevenueChart 
            data={graphData?.revenue || defaultRevenueData} 
          />
        </div>

        <div className='flex-1'>
          <Typography variant='h5' color='blue-gray' className='mb-4'>
            Danh mục sản phẩm
          </Typography>
          {/* ✅ Pass safe data with fallback */}
          <CourseCategoryChart 
            data={graphData?.courseByCategory || defaultCategoryData} 
          />
        </div>
      </div>

      <div className='ml-3 mr-3 mt-6'>
        <Typography variant='h5' color='blue-gray' className='mb-4'>
          Sản phẩm bán chạy
        </Typography>
        {/* ✅ Pass safe data with fallback */}
        <TrendingCoursesChart 
          data={graphData?.trendingCourses || defaultTrendingData} 
        />
      </div>
    </div>
  );
};

export default AdminHomePage;