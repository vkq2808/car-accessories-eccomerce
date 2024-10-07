import React from "react";
import './CommonSideBar.css'
import IconButton from "../header/IconButton";
import SideBarItem from "./SideBarItem";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CommonSideBar = ({ setIsSideBarOpen }) => {
    const naviagte = useNavigate();
    const auth = useSelector(state => state.auth);
    const userId = auth?.user?.id || '#';
    const handleSearch = () => {

    }
    const handleNavigate = (link) => {
        setIsSideBarOpen(false);
        naviagte(link);
    }

    const sideBarItems = [
        { name: "Profile", iconClassName: "fa-user", link: `/profile/${userId}` },
        { name: "Settings", iconClassName: "fa-cog", link: "/settings" },
        { name: "About", iconClassName: "fa-info", link: "/about" },
        { name: "Logout", iconClassName: "fa-sign-out", link: "/auth/logout" }
    ]

    return (
        <div className="flex flex-col w-auto h-full overflow-y-auto z-200">
            <div className="search-container flex flex-row w-auto h-auto mx-2 mb-4">
                <input type="text" className="SearchBar" placeholder="Search..." content="Hello" />
                <IconButton iconClassName={"fa-search"} onClick={handleSearch} />
            </div >
            {sideBarItems.map((item, index) => (
                <SideBarItem key={index} handleNavigate={() => handleNavigate(item.link)} name={item.name} iconClassName={item.iconClassName} />
            ))}
        </div >
    )
}

export default CommonSideBar;