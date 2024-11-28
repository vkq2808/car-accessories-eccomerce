import React, { useEffect, useState } from "react";
import { AiOutlineDashboard, AiOutlineUser, AiOutlineSetting, AiOutlineBarChart, AiOutlineProduct } from "react-icons/ai";
import { PiListChecksLight, PiReadCvLogo, PiTag } from "react-icons/pi";
import AdminSideBar from "../../components/admin/sideBar/AdminSideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { account_roles } from "../../constants/constants";
import { GiPayMoney } from "react-icons/gi";

const AdminLandingPage = ({ child }) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = window.location.pathname;
  const [expandedSubmenus, setExpandedSubmenus] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!auth.token) {
        dispatch({ type: "ERROR_ALERT", payload: "Bạn chưa đăng nhập" });
        navigate("/auth/login");
      } else if (auth.user.role !== account_roles.ADMIN && auth.user.role !== account_roles.SUPER_ADMIN) {
        dispatch({ type: "ERROR_ALERT", payload: "Bạn không có quyền quản trị viên" });
        navigate("/");
      } else {
        if (location === "/admin") {
          navigate("/admin/dashboard");
          return;
        }
        if (location === "/admin/manage") {
          navigate("/admin/manage/user");
          return;
        }
        if (location === "/admin/analytics") {
          navigate("/admin/analytics/revenue");
          return;
        }
        if (location === "/admin/settings") {
          navigate("/admin/settings/promotion");
          return;
        }
      }
    }, 3000);

    return () => clearTimeout(timer); // Clear timeout on cleanup
  }, [auth, dispatch, navigate, location]);

  useEffect(() => {
    setActiveMenu(location.split("/").slice(2).join("/"));
    setExpandedSubmenus(expandedSubmenus => [...expandedSubmenus, location.split("/")[2]]);
  }, [location]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = (menu_id) => {
    if (isCollapsed) setIsCollapsed(false);
    if (menuItems.find(menu => menu.id === menu_id)?.submenu?.length > 0) {
      return;
    }
    setActiveMenu(menu_id);
    navigate(`/admin/${menu_id}`);
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "Trang chủ",
      icon: <AiOutlineDashboard className="w-5 h-5" />
    },
    {
      id: "manage",
      title: "Quản lý",
      icon: <PiReadCvLogo className="w-5 h-5" />,
      submenu: [
        { id: "manage/user", title: "Tài khoản", icon: <AiOutlineUser className="w-4 h-4" /> },
        { id: "manage/product", title: "Sản phẩm", icon: <AiOutlineProduct className="w-4 h-4" /> },
        { id: "manage/category", title: "Thể loại", icon: <PiTag className="w-4 h-4" /> },
        { id: "manage/order", title: "Đơn hàng", icon: <PiListChecksLight className="w-4 h-4" /> },
        { id: "manage/cost", title: "Chi phí", icon: <GiPayMoney className="w-4 h-4" /> }
      ]
    },
    {
      id: "analytics",
      title: "Thống kê",
      icon: <AiOutlineBarChart className="w-5 h-5" />,
      submenu: [
        { id: "analytics/revenue", title: "Doanh Thu", icon: <AiOutlineBarChart className="w-4 h-4" /> }
      ]
    },
    {
      id: "settings",
      title: "Cài đặt web",
      icon: <AiOutlineSetting className="w-5 h-5" />,
      submenu: [
        { id: "settings/promotion", title: "Promotion", icon: <AiOutlineSetting className="w-4 h-4" /> },
        { id: "settings/policies", title: "Policies", icon: <AiOutlineSetting className="w-4 h-4" /> }
      ]
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
        admin_avatar_url={auth?.user?.image_url ?? ""}
        admin_name={auth?.user?.first_name && (auth?.user?.first_name + " " + auth?.user?.last_name)}
        admin_role={auth?.user?.role ?? ""}
        expandedSubmenus={expandedSubmenus}
        setExpandedSubmenus={setExpandedSubmenus}
      />
      <div className={`w-full min-h-[70vh] p-4 transition-all duration-300 ease-in-out ${isCollapsed ? "pl-24" : "pl-[17rem]"}`}>
        {child}
      </div>
    </div >
  );
};

export default AdminLandingPage;