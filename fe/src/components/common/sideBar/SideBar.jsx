import React from "react";
import { IconButton, SideBarItem } from "..";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";

const SideBar = ({ setIsSideBarOpen }) => {
    const naviagte = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');
    const theme = useSelector(state => state.theme.theme);
    const dispatch = useDispatch();
    const handleSearch = () => {
        setIsSideBarOpen(false);
        naviagte(`/search/q?searchTerm`);
    }
    const handleClick = (link) => {
        setIsSideBarOpen(false);
        naviagte(link);
    }

    const handleChangeTheme = () => {
        if (theme === 'dark') {
            dispatch({ type: GLOBALTYPES.THEME, payload: 'light' });
            localStorage.setItem('theme', 'light');
        } else {
            dispatch({ type: GLOBALTYPES.THEME, payload: 'dark' });
            localStorage.setItem('theme', 'dark');
        }
    }

    const sideBarItems = [
        { name: "Profile", iconClassName: "fa-user", link: `/profile` },
        { name: "Settings", iconClassName: "fa-cog", link: "/settings" },
        { name: "About", iconClassName: "fa-info", link: "/about" },
        { name: "Logout", iconClassName: "fa-sign-out", link: "/auth/logout" }
    ]

    return (
        <div className="flex flex-col w-auto h-full overflow-y-auto bg-[--primary-background-color] text-[--primary-text-color] z-1">
            <SideBarItem styles={{ color: 'inherit' }} text="Close" iconClassName="fa-times" handleClick={() => setIsSideBarOpen(false)} />
            <div className="search-container flex flex-row items-center w-auto h-auto mx-2 mt-2">
                <input
                    type="text"
                    className="SearchBar p-2 pl-10 pr-4 w-full max-w-md bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IconButton iconClassName={"fas fa-search hover:text-blue"} onClick={handleSearch} />
            </div >
            {sideBarItems.map((item, index) => (
                <SideBarItem styles={{ color: 'inherit' }} key={index} handleClick={() => handleClick(item.link)} text={item.name} iconClassName={item.iconClassName} />
            ))}
            <SideBarItem styles={{ color: 'inherit' }} text="Change Theme" iconClassName="fa-adjust" handleClick={handleChangeTheme} />
        </div >
    )
}

export default SideBar;