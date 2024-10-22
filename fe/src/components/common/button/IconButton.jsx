import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './IconButton.css';

const IconButton = ({ iconClassName, onClick }) => {
    return (
        <div onClick={onClick} className="icon-button">
            <i className={"fas " + iconClassName}></i> {/* Thẻ <i> cho icon */}
        </div>
    );
}

export default IconButton;