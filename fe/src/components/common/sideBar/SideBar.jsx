import React from "react";
import './SideBar.css'
import IconButton from "../button/IconButton";
import { SideBarItem } from "..";
import { useNavigate } from "react-router-dom";

const SideBar = ({ setIsSideBarOpen, user }) => {
    const naviagte = useNavigate();
    const handleSearch = () => {
    }
    const handleClick = (link) => {
        setIsSideBarOpen(false);
        naviagte(link);
    }

    const sideBarItems = [
        { name: "Profile", iconClassName: "fa-user", link: `/profile` },
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
                <SideBarItem key={index} handleClick={() => handleClick(item.link)} text={item.name} iconClassName={item.iconClassName} />
            ))}
        </div >
    )
}

export default SideBar;