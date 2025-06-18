import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface CourseCategory {
  _id: string;
  name: string;
  courseCount: number;
}

interface Props {
  data: CourseCategory[];
}

const CourseCategoryChart: React.FC<Props> = ({ data = [] }) => {
  // ✅ Safety check and data validation
  const safeData = Array.isArray(data) ? data : [];
  const validData = safeData
    .filter(category => category && typeof category === 'object')
    .map(category => ({
      _id: category?._id || 'unknown',
      name: category?.name || 'Unknown Category',
      courseCount: Number(category?.courseCount) || 0,
    }));

  // ✅ Fallback if no data
  const displayData = validData.length > 0 ? validData : [
    { _id: 'no-data', name: 'No Categories', courseCount: 1 }
  ];

  const categoryNames = displayData.map((category) => category.name);
  const courseCounts = displayData.map((category) => category.courseCount);

  const donutChartOptions: ApexCharts.ApexOptions = {
    chart: {
      id: 'course-category-donut-chart',
      type: 'donut',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
    labels: categoryNames,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
  };

  const donutChartSeries: number[] = courseCounts;

  return (
    <div className="bg-white p-4 shadow rounded-md">
      <ReactApexChart 
        options={donutChartOptions} 
        series={donutChartSeries} 
        type="donut" 
        height={300} 
      />
    </div>
  );
};

export default CourseCategoryChart;