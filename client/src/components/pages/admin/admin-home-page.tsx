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

const AdminHomePage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashData | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardDetails = async () => {
    try {
      const response = await getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Dashboard data error:", error);
    }
  };

  const fetchGraphData = async () => {
    try {
      const response = await getGraphData();
      setGraphData(response.data);
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Graph data error:", error);
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
                Monthly revenue
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
                Total courses
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
                Total instructors
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
                Total students
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
            Revenue Chart
          </Typography>
          {/* ✅ Pass safe data with fallback */}
          <RevenueChart 
            data={graphData?.revenue || defaultRevenueData} 
          />
        </div>

        <div className='flex-1'>
          <Typography variant='h5' color='blue-gray' className='mb-4'>
            Course Categories
          </Typography>
          {/* ✅ Pass safe data with fallback */}
          <CourseCategoryChart 
            data={graphData?.courseByCategory || defaultCategoryData} 
          />
        </div>
      </div>

      <div className='ml-3 mr-3 mt-6'>
        <Typography variant='h5' color='blue-gray' className='mb-4'>
          Trending Courses
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