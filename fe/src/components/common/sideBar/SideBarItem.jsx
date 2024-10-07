import React from 'react';
import './SideBarItem.css';

const SideBarItem = ({ name, iconClassName, handleNavigate, bgColor = '[--side-bar-bg-color]', textColor = 'white' }) => {
    return (
        <div className={`side-bar-item-container flex flex-row w-auto h-auto mx-2 my-2 bg-${bgColor}`} onClick={handleNavigate}>
            <div className="flex items-center justify-center w-14 "><i className={`fa ${iconClassName} fa-2x px-2 text-${textColor}`} /></div>
            <div className={`flex items-center justify-center text-${textColor} text-lg ml-2`}>{name}</div>
        </div>
    )
}

export default SideBarItem;