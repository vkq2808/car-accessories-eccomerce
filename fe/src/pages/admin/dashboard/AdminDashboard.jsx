import React, { useEffect, useState } from "react";
import { HeartIcon, CartIcon, GameIcon, WorkIcon } from "../../../assets"
import { motion, AnimatePresence } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  LineChart,
  Line,
} from 'recharts';
import { getDataAPI } from "../../../utils/fetchData";
import { formatNumberWithCommas } from "../../../utils/stringUtils";
import RecentOrderTable from "./RecentOrder";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [displayAnalyticsData, setDisplayAnalyticsData] = useState([]);
  const [weeklyOrdersData, setWeeklyOrdersData] = useState([]);

  useEffect(() => {
    const renderItemsWithDelay = async () => {
      for (let i = 0; i < analyticsData.length; i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            setDisplayAnalyticsData(analyticsData.slice(0, i + 1));
            resolve()
          }, 300); // Thay đổi thời gian nếu cần
        });
      }
    };

    if (analyticsData.length >= 0) {
      setDisplayAnalyticsData([]);
      renderItemsWithDelay();
    }
  }, [analyticsData]);

  useEffect(() => {
    const fetchWeeklyOrders = async () => {
      let res = await getDataAPI('admin/weekly-orders');
      let data = Object.entries(res.data).map(([key, value]) => {
        return {
          name: key, total: value.reduce((acc, order) => {
            return acc + parseInt(order.total_amount);
          }, 0)
        };
      });
      data.sort((a, b) => new Date(a.name) - new Date(b.name));
      setWeeklyOrdersData(data);
    };
    const fetchAnalyticsData = async () => {
      let res = await getDataAPI('admin/analytics');
      let data = res.data;
      setAnalyticsData([
        { title: "Total Users", value: data[0].value, icon: HeartIcon },
        { title: "Total Products", value: data[1].value, icon: CartIcon },
        { title: "Total Orders", value: data[2].value, icon: GameIcon },
        { title: "Total Revenue", value: data[3].value, icon: WorkIcon },
      ]);
    }

    fetchAnalyticsData();
    fetchWeeklyOrders();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-y-auto scrollbar-hide bg-[--primary-background-color] text-[--primary-text-color] w-full p-2">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="flex w-full flex-wrap min-h-[100px]">
        <AnimatePresence>
          {displayAnalyticsData.map((data, index) => (
            <AnalyticCard key={index} data={data} />
          ))}
        </AnimatePresence>
      </div>
      <div className="flex flex-col mb-4">
        <h3 className="text-2xl font-bold">Recent orders</h3>
        <div className="flex justify-between mb-4">
          <div></div>
          <div className="flex gap-4 justify-between items-center">
            <button className="p-3 rounded-md"
              onClick={() => window.location.reload()}
            >
              <span className="text-md font-semibold text-blue-500">Làm mới</span>
            </button>
            <button className="p-3 rounded-md"
              onClick={() => navigate('/admin/manage/order')}
            >
              <span className="text-md font-semibold text-blue-500">View all</span>
            </button>
          </div>
        </div>
        <WeeklyOrderChart data={weeklyOrdersData} />
      </div>
      <div className="flex flex-col mb-4">
        <RecentOrderTable />
      </div>
    </div >
  );
};

function getDayOfWeek(dateString) {
  const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-lg">
        <p className="font-semibold text-gray-700">{`Ngày: ${label}`}</p>
        <p className="text-blue-500">{`Doanh thu: ${payload[0].value.toLocaleString()} VND`}</p>
      </div>
    );
  }
  return null;
};

const WeeklyOrderChart = ({ data }) => {
  return (
    <div className="flex flex-col w-full bg-[--secondary-background-color] rounded-lg p-4">
      <ResponsiveContainer height={450}>
        <LineChart data={data} margin={{ top: 40, right: 30, left: 50, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickFormatter={(value) => getDayOfWeek(value)} />
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
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const AnalyticCard = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -400 }}
      transition={{ duration: 0.3 }}
      className="flex min-w-[250px] h-24 bg-[--secondary-background-color] m-2 rounded-lg items-center px-4 py-2 mb-2"
    >
      <div className="flex justify-center items-center w-16 h-16  rounded-full bg-[--tertiary-background-color]">
        <img src={data.icon} alt="icon" className="w-8 h-8" />
      </div>
      <div className='flex flex-col p-4'>
        <h3 className="text-lg font-bold">{data.title}</h3>
        <h3 className="text-2xl font-bold">{data.value}</h3>
      </div>
    </motion.div>
  )
}

export default AdminDashboard;