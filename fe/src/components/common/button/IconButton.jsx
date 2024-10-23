import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

const ICON_BUTTON_TAILWIND_CSS = "flex cursor-pointer border-none bg-transparent hover:text-[#002fff] px-2 items-center justify-center";

/**
 * IconButton component renders a button with an icon and optional status indicator.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.className - Additional CSS classes for the button.
 * @param {string} props.iconClassName - CSS classes for the icon.
 * @param {function} props.onClick - Click event handler for the button.
 * @param {Object} [props.status] - Optional status object to display a count indicator.
 * @param {number} [props.status.count] - The count to display in the status indicator.
 * @param {number} [props.size=20] - The size of the icon in pixels.
 *
 * @returns {JSX.Element} The rendered IconButton component.
 */
const IconButton = ({ className, iconClassName, onClick, status, size = 20 }) => {

    if (status) {
        return (
            <div onClick={onClick} className={`${ICON_BUTTON_TAILWIND_CSS} justify-between ${className}`}>
                <i className={`text-inherit text-[${size}px] ${iconClassName}`} />
                <div className="flex flex-row-reverse absolute top-[-21px] left-[21px]">
                    <div className="text-[black] text-xs bg-transparent px-[4px] rounded-[50%] border-solid border-[red]">{status.count}</div>
                </div>
            </div>
        );
    }

    return (
        <div onClick={onClick} className={`${ICON_BUTTON_TAILWIND_CSS} ${className}`}>
            <i className={`text-inherit text-[${size}px] ${iconClassName}`} />
        </div>
    );
}

export default IconButton;