import React from "react";
import './SideBar.css'
import { IconButton, SideBarItem } from "..";
import { useNavigate } from "react-router-dom";

const SideBar = ({ setIsSideBarOpen }) => {
    const naviagte = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');
    const handleSearch = () => {
        setIsSideBarOpen(false);
        naviagte(`/search/q?searchTerm`);
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
        <div className="flex flex-col w-auto h-full overflow-y-auto bg-white text-black">
            <div className="search-container flex flex-row items-center w-auto h-auto mx-2 mb-4 mt-4">
                <input type="text" className="SearchBar" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <IconButton iconClassName={"fas fa-search text-black hover:text-blue"} onClick={handleSearch} />
            </div >
            {sideBarItems.map((item, index) => (
                <SideBarItem styles={{ color: 'black' }} key={index} handleClick={() => handleClick(item.link)} text={item.name} iconClassName={item.iconClassName} />
            ))}
        </div >
    )
}

export default SideBar;