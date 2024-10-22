import React from 'react';
import IconButton from '../button/IconButton';
import './Header.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cart from '../../customer/cart/Cart';
const Header = ({ setIsSideBarOpen }) => {

    const auth = useSelector(state => state.auth);
    const nav = useNavigate();

    const handleClick = () => {
    };

    const handleProfileClick = () => {
        nav('/profile');
    };

    const handleSearch = () => {
        console.log('Search clicked');
    };



    return (
        <div className='flex flex-col w-[100vw] md:w-[80vw] border-none z-10 bg-white md:py-0'>
            <header className="PageHeader flex flex-col md:flex-row justify-between items-center border-b border-b-black">
                <div className="HomeIcon flex m-2">
                    <img
                        className="home-icon w-[150px] md:w-[250px] lg:w-[250px] cursor-pointer"
                        src="https://file.hstatic.net/200000317829/file/logo-02_9e045ad7d96c45e0ade84fd8ff5e8ca2.png"
                        alt="Home"
                        onClick={() => { nav('/'); }}
                    />
                </div>
                <div className="search-bar lg:flex flex-row w-[40%] hidden justify-center">
                    <input
                        className="border border-black px-2 py-1 w-full md:w-[70%] lg:w-[80%] rounded-lg"
                        type="text"
                        placeholder="Search"
                    />
                    <button onClick={handleSearch} className="s-btn block border w-auto rounded-lg py-2 ml-[5%]">
                        <IconButton iconClassName="fa-search" />
                    </button>
                </div>
                <div className="flex flex-row justify-start space-x-4 mt-2 md:mt-0">
                    {!auth?.token && <div>
                        <a href='/auth/login'>
                            <span>Đăng nhập</span>
                        </a>
                        /
                        <a href='/auth/regist'>
                            <span>Đăng ký</span>
                        </a>
                    </div>}
                    {auth?.token && <IconButton iconClassName="fa-user" onClick={handleProfileClick} />}
                    <IconButton iconClassName="fa-heart" onClick={handleClick} />
                    <Cart />
                    <IconButton iconClassName="fa-bars" onClick={() => setIsSideBarOpen(true)} />
                </div>
            </header>
            <div className="nav-bar flex flex-row bg-black justify-between items-center p-2 px-4">
                <div>Chào mừng đến với UTE Gara</div>
                <div className="flex flex-row justify-center items-center space-x-4">
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/products">Products</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                </div>
            </div>
        </div>
    );
};

export default Header;
