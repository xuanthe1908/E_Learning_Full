import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface CourseData {
  title: string;
  enrolled: number;
}

interface Props {
  data: CourseData[];
}

const TrendingCoursesChart: React.FC<Props> = ({ data = [] }) => {
  // ✅ Safety check and data validation
  const safeData = Array.isArray(data) ? data : [];
  const validData = safeData
    .filter(course => course && typeof course === 'object')
    .map(course => ({
      title: course?.title || 'Sản phẩm không xác định',
      enrolled: Number(course?.enrolled) || 0,
    }));

  const sortedData = validData.sort((a, b) => b.enrolled - a.enrolled).slice(0, 5);

  // ✅ Fallback if no data
  const displayData = sortedData.length > 0 ? sortedData : [{ title: 'Không có sản phẩm', enrolled: 0 }];

  const chartOptions: Partial<ApexOptions> = {
    chart: {
      id: 'trending-courses-chart',
    },
    xaxis: {
      categories: displayData.map((course) => course.title),
      labels: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Số lượng bán',
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: 35,
      },
    },
  };

  const chartSeries = [
    {
      name: 'Số lượng bán',
      data: displayData.map((course) => course.enrolled),
    },
  ];

  return (
    <div className="bg-white p-4 shadow rounded-md">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar" 
        height={255}
      />
    </div>
  );
};

export default TrendingCoursesChart;