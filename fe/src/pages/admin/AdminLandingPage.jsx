import React, { useEffect, useState } from "react";
import { AiOutlineDashboard, AiOutlineUser, AiOutlineSetting, AiOutlineBarChart, AiOutlineProduct } from "react-icons/ai";
import { PiReadCvLogo } from "react-icons/pi";
import AdminSideBar from "../../components/admin/sideBar/AdminSideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { account_roles } from "../../constants/constants";
import { BiCategory } from "react-icons/bi";

const AdminLandingPage = ({ child }) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!auth.token) {
        dispatch({ type: "ERROR_ALERT", payload: { error: "You are not logged in" } });
        navigate("/auth/login");
      } else if (auth.user.role !== account_roles.ADMIN && auth.user.role !== account_roles.SUPER_ADMIN) {
        dispatch({ type: "ERROR_ALERT", payload: { error: "You are not an admin" } });
        navigate("/");
      }
    }, 1000);

    return () => clearTimeout(timer); // Clear timeout on cleanup
  }, [auth, dispatch, navigate]);


  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = (menu_id) => {
    if (isCollapsed) setIsCollapsed(false);
    setActiveMenu(menu_id);
    if (menuItems.find(menu => menu.id === menu_id)?.submenu?.length > 0) {
      return;
    }
    navigate(`/admin/${menu_id}`);
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <AiOutlineDashboard className="w-5 h-5" />
    },
    {
      id: "manage",
      title: "Management",
      icon: <PiReadCvLogo className="w-5 h-5" />,
      submenu: [
        { id: "manage/user", title: "Users", icon: <AiOutlineUser className="w-4 h-4" /> },
        { id: "manage/product", title: "Products", icon: <AiOutlineProduct className="w-4 h-4" /> },
        { id: "manage/category", title: "Categories", icon: <BiCategory className="w-4 h-4" /> },
      ]
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: <AiOutlineBarChart className="w-5 h-5" />
    },
    {
      id: "settings",
      title: "Settings",
      icon: <AiOutlineSetting className="w-5 h-5" />
    }
  ];


  return (
    <div className="flex h-screen bg-[--primary-background-color] text-[--primary-text-color] w-full p-2">
      <AdminSideBar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        menuItems={menuItems}
        handleMenuClick={handleMenuClick}
        activeMenu={activeMenu}
        toggleSidebar={toggleSidebar}
        admin_avatar_url={auth?.user?.image_url}
        admin_name={auth?.user?.first_name + " " + auth?.user?.last_name}
        admin_role={auth?.user?.role}
      />
      <div className={`w-full min-h-[70vh] p-4 transition-all duration-300 ease-in-out ${isCollapsed ? "pl-24" : "pl-[17rem]"}`}>
        {child}
      </div>
    </div >
  );
};

export default AdminLandingPage;