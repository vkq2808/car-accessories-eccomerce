import React from 'react';
import './SideBarItem.css';

const SideBarItem = ({ text, iconClassName, handleClick, styles = { backgroundColor: 'var(--side-bar-bg-color)', color: 'white' } }) => {
    return (
        <div style={styles} className={`side-bar-item-container flex flex-row w-auto h-auto mx-2 my-2`} onClick={handleClick}>
            <div className="flex items-center justify-center w-14 "><i className={`fa ${iconClassName} fa-2x px-2`} /></div>
            <div className={`flex items-center justify-center text-lg ml-2`}>{text}</div>
        </div>
    )
}

export default SideBarItem;