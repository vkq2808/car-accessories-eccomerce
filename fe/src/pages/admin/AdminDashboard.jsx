import React, { useState } from "react";
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiMenu, FiX } from "react-icons/fi";
import AccordionItem from "./AccorditionItem";

const AdminDashboard = ({ child }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: <FiHome className="w-5 h-5" />, label: "Dashboard", subItems: [] },
    { icon: <FiBox className="w-5 h-5" />, label: "Products", subItems: ["All Products", "Add New", "Categories"] },
    { icon: <FiShoppingCart className="w-5 h-5" />, label: "Orders", subItems: ["All Orders", "Pending", "Completed"] },
    { icon: <FiUsers className="w-5 h-5" />, label: "Customers", subItems: ["All Customers", "VIP", "Blocked"] }
  ];


  return (
    <div className="flex h-screen bg-[--primary-background-color] text-[--primary-text-color] w-full p-2">
      <div className={`${isSidebarOpen ? "w-[400px]" : "w-[120px]"} bg-[--primary-background-color] transition-all duration-300 ease-in-out shadow-md shadow-[--quaternary-text-color] overflow-hidden`}>
        <div className="p-4 flex justify-between items-center border-b">
          <h1 className={`${isSidebarOpen ? "block" : "hidden"} font-bold text-xl`}>Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-blue-400"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className={`${isSidebarOpen ? "w-[400px]" : "w-[80px]"}`}>
          {menuItems.map((item, index) => (
            <AccordionItem
              key={index}
              icon={item.icon}
              label={item.label}
              subItems={item.subItems}
            />
          ))}
        </nav>
      </div>
      <div className="w-full min-h-screen p-4">
        {child}
      </div>
    </div >
  );
};

export default AdminDashboard;