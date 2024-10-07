import React, { useState } from "react";
import { FaHome, FaUser, FaEnvelope, FaBars, FaSearch } from "react-icons/fa";
import './Header.css'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const dummySuggestions = [
        "React",
        "Tailwind CSS",
        "JavaScript",
        "Node.js",
        "Express.js",
    ];

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length > 0) {
            const filteredSuggestions = dummySuggestions.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = () => {
        console.log("Searching for:", searchTerm);
        setSuggestions([]);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <header className="bg-gradient-to-r from-blue-400 to-blue-500 p-4 shadow-md">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-4 md:mb-0">
                        <div
                            className="header-item flex items-center text-white cursor-pointer hover:text-blue-100 transition-colors duration-200"
                            aria-label="Home"
                            onClick={() => window.location.href = '/'}
                        >
                            <FaHome size={24} />
                        </div>
                        <div
                            className="header-item flex items-center text-white cursor-pointer hover:text-blue-100 transition-colors duration-200"
                            aria-label="Profile"
                        >
                            <FaUser size={23} />
                        </div>
                        <div
                            className="header-item flex items-center text-white cursor-pointer hover:text-blue-100 transition-colors duration-200"
                            aria-label="Messages"
                        >
                            <FaEnvelope size={24} />
                        </div>
                        <div className="relative">
                            <div
                                className="header-item flex items-center text-white cursor-pointer hover:text-blue-100 transition-colors duration-200"
                                aria-label="Menu"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <FaBars size={24} />
                            </div>
                            {isMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <a
                                            href="/profile/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                        >
                                            Account Settings
                                        </a>
                                        <a
                                            href="/support"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                        >
                                            Support
                                        </a>
                                        <a
                                            href="/auth/logout"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                        >
                                            Sign out
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative w-full md:w-64 justify-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            aria-label="Search"
                        />
                        <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                            onClick={handleSearch}
                            aria-label="Perform search"
                        >
                            <FaSearch size={18} />
                        </div>
                        {suggestions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSearchTerm(suggestion);
                                            setSuggestions([]);
                                        }}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
