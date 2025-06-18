import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface DataPoint {
  month: string;
  revenue: number;
  coursesAdded: number;
  coursesEnrolled: number;
}

interface Props {
  data: DataPoint[];
}

const RevenueChart: React.FC<Props> = ({ data = [] }) => {
  // ✅ Safety check - ensure data is array and has valid structure
  const safeData = Array.isArray(data) ? data : [];
  
  // ✅ Ensure all data points have required properties
  const validData = safeData.map(d => ({
    month: d?.month || 'Unknown',
    revenue: Number(d?.revenue) || 0,
    coursesAdded: Number(d?.coursesAdded) || 0,
    coursesEnrolled: Number(d?.coursesEnrolled) || 0,
  }));

  const chartOptions: Partial<ApexOptions> = {
    chart: {
      id: 'revenue-chart',
      animations: {
        enabled: true,
        easing: 'linear',
        speed: 300,
      },
    },
    xaxis: {
      categories: validData.map((d) => d.month),
    },
    yaxis: {
      title: {
        text: 'Amount',
      },
    },
    stroke: {
      curve: 'smooth',
    },
  };

  const chartSeries = [
    {
      name: 'Monthly Revenue',
      data: validData.map((d) => d.revenue),
    },
    {
      name: 'Courses Added',
      data: validData.map((d) => d.coursesAdded),
    },
    {
      name: 'Courses Enrolled',
      data: validData.map((d) => d.coursesEnrolled),
    },
  ];

  return (
    <div className="bg-white p-4 shadow rounded-md">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={300}
      />
    </div>
  );
};

export default RevenueChart;