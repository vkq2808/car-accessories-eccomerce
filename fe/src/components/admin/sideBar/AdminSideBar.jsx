import React from "react";
import './AdminSideBar.css'
import IconButton from "../../common/header/IconButton";

const AdminSideBar = () => {
    const handleClick = () => {

    }
    return (
        <div className="flex flex-col w-auto h-full overflow-y-auto">
            <div className="flex flex-row w-auto h-auto mx-2">
                <input type="text" className="SearchBar" placeholder="Search..." content="Hello" />
                <IconButton iconClassName={"fa-search"} onClick={handleClick} />
            </div >
        </div >
    )
}

export default AdminSideBar;