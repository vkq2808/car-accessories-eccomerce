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
  Label,
} from 'recharts';
import { getDataAPI } from '../../../utils/fetchData';
import { formatNumberWithCommas } from '../../../utils/stringUtils';

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

        setMonthlyRevenue(monthlyData?.sort((a, b) => new Date(a.name) - new Date(b.name)));
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

        setYearlyRevenue(yearlyData?.sort((a, b) => new Date(a.name) - new Date(b.name)));
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
      <RevenueChart data={yearlyRevenue} title="Thống kê doanh thu theo năm" date_type='month' />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-lg">
        <p className="font-semibold text-gray-700">{`Ngày: ${label}`}</p>
        <p className="text-blue-500">{`Doanh thu: ${(payload[0].value + payload[1].value).toLocaleString()} VND`}</p>
      </div>
    );
  }
  return null;
};

const getDayOfMonth = (dateString, date_type) => {
  const date = new Date(dateString);
  if (date_type === "day") {
    return date.getDate();
  }
  if (date_type === "month") {
    return date.getMonth() + 1;
  }
}


export const RevenueChart = ({ data, title, date_type = "day" }) => {
  return (
    <div className='w-full min-h-[400px]'>
      <h2 className='mb-4'>{title}</h2>
      <ResponsiveContainer
        height={400}
      >
        <BarChart data={data} margin={{ top: 40, right: 30, left: 50, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickFormatter={(value) => getDayOfMonth(value, date_type)} />
          <YAxis tickFormatter={(value) => formatNumberWithCommas(value)}>
            <Label
              value="Doanh thu"
              position="top"
              offset={20}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="user" fill="#8884d8" name="Doanh thu User" />
          <Bar dataKey="guest" fill="#82ca9d" name="Doanh thu Guest" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueStatitics;
