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
import { getCourseByInstructor } from '../../../api/endpoints/course/course';
import { getMyStudents, getInstructorDetails } from '../../../api/endpoints/instructor';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getLessonsByCourse } from '../../../api/endpoints/course/lesson';

// Types
import { GetCourseByInstructorInterface, InstructorApiResponse } from '../../../api/types/apiResponses/api-response-instructors';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  totalLessons: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'review';
  message: string;
  timestamp: string;
}

const InstructorDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalLessons: 0
  });
  const [recentCourses, setRecentCourses] = useState<GetCourseByInstructorInterface[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [instructorInfo, setInstructorInfo] = useState<InstructorApiResponse | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch instructor details
        const instructorResponse = await getInstructorDetails();
        setInstructorInfo(instructorResponse.data);

        // Fetch courses by instructor
        const coursesResponse = await getCourseByInstructor();
        const courses = coursesResponse.data || [];
        setRecentCourses(courses.slice(0, 5)); // Show only latest 5 courses

        // Fetch students
        const studentsResponse = await getMyStudents();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const students = studentsResponse.data || [];

        // Calculate total lessons from all courses
        let totalLessons = 0;
        for (const course of courses) {
          if (course.lessons && course.lessons.length > 0) {
            totalLessons += course.lessons.length;
          }
        }

        // Calculate total revenue from all courses
        const totalRevenue = courses.reduce((sum: number, course: GetCourseByInstructorInterface) => {
          return sum + (course.price ? course.price * course.enrollmentCount : 0);
        }, 0);

        // Calculate total unique students across all courses
        const totalStudents = courses.reduce((sum: number, course: GetCourseByInstructorInterface) => {
          return sum + course.enrollmentCount;
        }, 0);

        setStats({
          totalCourses: courses.length,
          totalStudents: totalStudents,
          totalRevenue: totalRevenue,
          totalLessons: totalLessons
        });

        // Generate recent activities based on real data
        const activities: RecentActivity[] = [];
        courses.forEach((course: { enrollmentCount: number; title: any; createdAt: string | number | Date; }, index: any) => {
          if (course.enrollmentCount > 0) {
            activities.push({
              id: `activity-${index}`,
              type: 'enrollment',
              message: `${course.enrollmentCount} students enrolled in ${course.title}`,
              timestamp: new Date(course.createdAt).toLocaleDateString()
            });
          }
        });
        setRecentActivities(activities.slice(0, 5));

      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back{instructorInfo ? `, ${instructorInfo.firstName} ${instructorInfo.lastName}` : ''}! Here's your teaching overview.
            </p>
          </div>
          <Link
            to="/instructor/add-course"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Create New Course
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpenIcon className="h-6 w-6 text-blue-600" />}
            title="Total Courses"
            value={stats.totalCourses}
            change="+2 this month"
            color="text-blue-600"
          />
          <StatCard
            icon={<UserGroupIcon className="h-6 w-6 text-green-600" />}
            title="Total Students"
            value={stats.totalStudents}
            change="+12% this month"
            color="text-green-600"
          />
          <StatCard
            icon={<CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change="+8% this month"
            color="text-yellow-600"
          />
          <StatCard
            icon={<PlayIcon className="h-6 w-6 text-purple-600" />}
            title="Total Lessons"
            value={stats.totalLessons}
            change="+5 this week"
            color="text-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Courses</h2>
                <Link
                  to="/instructor/courses"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentCourses.length > 0 ? (
                  recentCourses.map((course) => (
                    <div key={course._id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <img
                        src={course.thumbnailUrl || '/api/placeholder/64/64'}
                        alt={course.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">
                          {course.enrollmentCount} students enrolled
                        </p>
                        <p className="text-xs text-gray-500">
                          Created on {new Date(course.createdAt).toLocaleDateString()}
                        </p>
                        {course.price && (
                          <p className="text-xs text-green-600 font-medium">
                            ${course.price}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.isVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {course.isVerified ? 'Published' : 'Pending'}
                        </span>
                        <Link
                          to={`/instructor/courses/${course._id}`}
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
                    <p>No courses created yet</p>
                    <Link
                      to="/instructor/add-course"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Create your first course
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/instructor/add-course"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Create New Course</span>
                </Link>
                <Link
                  to="/instructor/courses"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpenIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Manage Courses</span>
                </Link>
                <Link
                  to="/instructor/analytics"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChartBarIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">View Analytics</span>
                </Link>
                <Link
                  to="/instructor/students"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">Manage Students</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;