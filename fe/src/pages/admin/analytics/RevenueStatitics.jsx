import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getDataAPI } from '../../../utils/fetchData';

const RevenueStatitics = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);

  const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
  const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
  // Tạo mảng gồm 20 năm trước và năm hiện tại
  const currentYear = new Date().getFullYear();
  const monthlyYearOption = Array.from({ length: 20 }, (_, i) => currentYear - i);
  const monthlyMonthOption = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [yearlyYear, setYearlyYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const monthlyRes = await getDataAPI(`admin/monthly-revenue?year=${monthlyYear}&month=${monthlyMonth}`);

        let monthlyData = Object.entries(monthlyRes.data).map(([key, value]) => ({
          name: key,
          user: value.filter((item) => item.user_id).reduce((acc, item) => acc + parseInt(item.total_amount), 0),
          guest: value.filter((item) => !item.user_id).reduce((acc, item) => acc + parseInt(item.total_amount), 0),
        }));

        setMonthlyRevenue(monthlyData?.reverse());
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchData();
  }, [monthlyMonth, monthlyYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yearlyRes = await getDataAPI(`admin/yearly-revenue${yearlyYear ? `?year=${yearlyYear}` : ''}`);

        let yearlyData = Object.entries(yearlyRes.data).map(([key, value]) => ({
          name: key,
          user: value.filter((item) => item.user_id).reduce((acc, item) => acc + parseInt(item.total_amount), 0),
          guest: value.filter((item) => !item.user_id).reduce((acc, item) => acc + parseInt(item.total_amount), 0),
        }));

        setYearlyRevenue(yearlyData?.reverse());
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchData();
  }, [yearlyYear]);


  return (
    <div className='flex flex-col w-full min-h-[90vh]'>
      <div className="flex justify-end w-full my-2">
        <div className="flex items-center">
          <label className="mr-2">Thống kê theo tháng:</label>
          <select
            value={monthlyMonth}
            onChange={(e) => setMonthlyMonth(e.target.value)}
            className="mr-2"
          >
            {monthlyMonthOption.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            value={monthlyYear}
            onChange={(e) => setMonthlyYear(e.target.value)}
          >
            {monthlyYearOption.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <RevenueChart data={monthlyRevenue} title="Thống kê doanh thu theo tháng" />

      <div className="flex justify-end w-full my-2">
        <div className="flex items-center">
          <label className="mr-2">Thống kê theo năm:</label>
          <select
            value={yearlyYear}
            onChange={(e) => setYearlyYear(e.target.value)}
          >
            {monthlyYearOption.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <RevenueChart data={yearlyRevenue} title="Thống kê doanh thu theo năm" />
    </div>
  );
}

const RevenueChart = ({ data, title }) => {
  return (
    <div className='w-full min-h-[400px]'>
      <h2 className='mb-4'>{title}</h2>
      <ResponsiveContainer
        height={400}
      >
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="user" fill="#8884d8" name="Doanh thu User" />
          <Bar dataKey="guest" fill="#82ca9d" name="Doanh thu Guest" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueStatitics;
