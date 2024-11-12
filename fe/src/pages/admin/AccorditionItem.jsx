import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const AccordionItem = ({ icon, label, subItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full px-4 py-3 hover:bg-blue-400 transition-colors bg-inherit text-inherit"
      >
        {icon}
        <span className="ml-3">{label}</span>
        {subItems.length > 0 && (
          <FiChevronDown className={`ml-auto transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>
      {isOpen && (
        <div className="pl-10">
          {subItems.map((subItem, index) => (
            <button
              key={index}
              className="w-full py-2 text-left text-sm hover:bg-blue-400 transition-colors bg-inherit text-inherit"
            >
              {subItem}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
