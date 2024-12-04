import React, { useState, useEffect } from "react";
import { FiHome, FiSettings, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";
import { IoMdSwitch, IoIosSearch } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import { account_roles } from "../../../constants/constants";

const Sidebar = ({ setIsSideBarOpen }) => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [menuItems, setMenuItems] = useState([]);



    useEffect(() => {
        const handleNavigate = (path) => {
            setIsSideBarOpen(false);
            navigate(path);
        };
        let items = [];
        if ([account_roles.ADMIN, account_roles.SUPER_ADMIN].includes(auth.role)) {
            items = [
                { id: 11, title: "Hone", icon: <FiHome />, onClick: () => handleNavigate("/") },
                { id: 14, title: "Admin Page", icon: <FiSettings />, onClick: () => handleNavigate("/admin/dashboard") },
                { id: 12, title: "Profile", icon: <FiUser />, onClick: () => handleNavigate("/profile") },
                { id: 15, title: "Change Theme", icon: <IoMdSwitch />, onClick: () => dispatch({ type: GLOBALTYPES.THEME }) },
                { id: 16, title: "Logout", icon: <RiLogoutCircleLine />, onClick: () => handleNavigate("/auth/logout") }
            ]
        } else {
            items = [
                { id: 1, title: "Hone", icon: <FiHome />, onClick: () => handleNavigate("/") },
                { id: 2, title: "Profile", icon: <FiUser />, onClick: () => handleNavigate("/profile") },
                { id: 4, title: "Change Theme", icon: <IoMdSwitch />, onClick: () => dispatch({ type: GLOBALTYPES.THEME }) },
                { id: 5, title: "Logout", icon: <RiLogoutCircleLine />, onClick: () => handleNavigate("/auth/logout") }
            ];
        }
        setMenuItems(items);
    }, [navigate, setIsSideBarOpen, dispatch, auth]);

    const toggleSearch = (e) => {
        e.preventDefault();
        navigate("/search/q?key=" + searchQuery);
    };

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-0 right-0 h-screen bg-[--primary-background-color] text-[--primary-text-color] shadow-xl transition-all duration-300 ease-in-out w-64 z-[201]`}
            role="navigation"
            aria-label="Main Sidebar"
        >
            <div className="flex items-center justify-between p-4 border-b">

                <div className="relative flex-1 mr-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && toggleSearch(e)}
                            className="w-full pl-5 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Search menu items"
                        />
                    </div>
                </div>
                <IoIosSearch cursor={'pointer'} onClick={toggleSearch} size={24} />
            </div>

            <nav className="mt-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={'side-bar-item-' + item.id} className="list-none">
                            <div
                                onClick={item.onClick}
                                className={`flex items-center px-8 py-3  cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:translate-x-6 rounded-lg transition duration-200`}
                                aria-label={item.title}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="ml-6">{item.title}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className={`flex items-center justify-center text-sm `}>
                    <span>© 2024 Dashboard</span>
                </div>
            </div>
        </motion.div >
    );
};

export default Sidebar;