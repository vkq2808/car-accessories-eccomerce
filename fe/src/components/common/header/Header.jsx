import React, { useEffect } from 'react';
<<<<<<< HEAD
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { IconButton, Cart } from '..';
import { formatNumberWithCommas } from '../../../utils/stringProcess';
import { getCategories } from '../../../redux/actions/categoryActions';
import { getProducts } from '../../../redux/actions/productActions';
import Following from './following/Following';
=======
import IconButton from '../button/IconButton';
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cart from '../../customer/cart/Cart';
import { formatNumberWithCommas } from '../../../utils/stringProcess';
import { getCategories } from '../../../redux/actions/categoryActions';
import { getProducts } from '../../../redux/actions/productActions';
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
const Header = ({ setIsSideBarOpen }) => {

    const auth = useSelector(state => state.auth);
    const products = useSelector(state => state.product.list);
    const categories = useSelector(state => state.category.list);
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [categoryId, setCategoryId] = React.useState(-1);
<<<<<<< HEAD
=======

    const handleClick = () => {
    };
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded

    const handleProfileClick = () => {
        nav('/profile');
    };

    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);

        if (e.target.value === '') {
            setSearchResults([]);
            return;
        }
    };

    useEffect(() => {
        if (!categories) {
            dispatch(getCategories());
        }
    }, [categories, dispatch]);

    useEffect(() => {
        if (!products) {
            dispatch(getProducts());
        }
    }, [products, dispatch]);

    const onFilterCategoryChange = (e) => {
        setCategoryId(e.target.value);
    };

    useEffect(() => {
        if (searchTerm !== '') {
<<<<<<< HEAD
            let searchProducts = Array.from(products);
            // Lọc sản phẩm dựa trên searchTerm
            const filterByCategoryResults = searchProducts.filter(product =>
                product.path.toLowerCase().includes(searchTerm.toLowerCase())
=======

            // Lọc sản phẩm dựa trên searchTerm
            const filterByCategoryResults = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
            );

            // Lọc tiếp theo categoryId nếu categoryId không phải là -1
            const results = filterByCategoryResults.filter(product =>
<<<<<<< HEAD
                product.categoryId === parseInt(categoryId) || parseInt(categoryId) === -1
=======
                product.categoryId === parseInt(categoryId) || categoryId === -1
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
            );

            setSearchResults(results);
        } else {
            // Nếu searchTerm rỗng, không thực hiện lọc, nhưng giữ nguyên searchResults trước đó hoặc đặt kết quả về rỗng
            setSearchResults([]); // Hoặc giữ nguyên searchResults nếu muốn
        }
    }, [searchTerm, categoryId, products]);



    const handleSearch = (e) => {
        if (searchTerm === '') {
            return;
        }

        if (e.key === 'Enter') {
            const sanitizedSearchTerm = searchTerm.trim().replace(/[\s/]+/g, '-');
            setSearchTerm('');
            nav('/search/q?key=' + sanitizedSearchTerm + '&categoryId=' + categoryId.toString());
        }
    };

    return (
        <div className='flex flex-col w-[100vw] md:w-[80vw] border-none z-10 bg-white md:py-0'>
            <header className="PageHeader flex flex-col md:flex-row justify-between items-center border-b border-b-black">
                <div className="HomeIcon m-[8px] mb-[20px] md:mb-[8px]">
                    <img
                        className="home-icon w-[250px] cursor-pointer"
                        src="https://file.hstatic.net/200000317829/file/logo-02_9e045ad7d96c45e0ade84fd8ff5e8ca2.png"
                        alt="Home"
                        onClick={() => { nav('/'); }}
                    />
                </div>
<<<<<<< HEAD
                <div className="search-bar flex-row w-[40%] flex justify-center ">
                    <select className="border px-2 py-1 w-[100px] "
=======
                <div className="search-bar flex-row w-[40%] flex justify-center">
                    <select className="border-l border-t border-b border-black px-2 py-1 w-[100px] "
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
                        onChange={(e) => onFilterCategoryChange(e)}
                        value={categoryId}
                    >
                        <option value={-1}>Tất cả</option>
                        {categories.map(category => (
                            <option key={category.id}
                                value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
<<<<<<< HEAD
                        className="border px-2 py-1 w-full md:w-[70%] lg:w-[80%]"
=======
                        className="border border-black px-2 py-1 w-full md:w-[70%] lg:w-[80%]"
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={onSearchChange}
                        onKeyDown={(e) => handleSearch(e)}
                    />
                    {searchResults.length > 0 &&
                        <div className="search-result absolute bg-white border border-black w-[500px] top-[78px]">
<<<<<<< HEAD
                            <div className="flex justify-between">
                                <h6 className="text-center">Kết quả tìm kiếm:</h6>
                                <h6>{searchResults.length} sản phẩm được tìm thấy</h6>
                            </div>
=======
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
                            {searchResults.slice(0, 5).map(product => (
                                <div key={product.id}
                                    className="search-item p-2 border-b border-black"
                                    onClick={() => nav('/product/' + product.path)}>
                                    <div className="flex p-1 m-1 border items-center">
                                        <img
                                            className="w-[70px] h-[70px] cursor-pointer"
                                            src={product.imageUrl}
                                            alt="Ảnh"
                                        />
                                        <div className="flex flex-col m-2 pr-4">
                                            <div>{product.name}</div>
                                            <div
                                                className='text-blue-500'
                                            >
                                                {formatNumberWithCommas(product.price)} {product.currency}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                    <button onClick={handleSearch} className="s-btn block border w-auto py-2">
<<<<<<< HEAD
                        <IconButton iconClassName="fas fa-search"
                            className={"h-auto p-[0px] m-[0px]"} />
=======
                        <IconButton iconClassName="fa-search" />
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
                    </button>
                </div>
                <div className="flex flex-row justify-start space-x-4 mt-2 md:mt-0">
                    {!auth?.token && <div className='flex flex-row'>
                        <div className='pl-1 mr-1' onClick={() => nav('/auth/login')}>
                            <span className='underline text-[blue] cursor-pointer'>Đăng nhập</span>
                        </div>
                        /
                        <div className='pl-1 mr-1' onClick={() => nav('/auth/regist')}>
                            <span className='underline text-[blue] cursor-pointer'>Đăng ký</span>
                        </div>
                    </div>}
<<<<<<< HEAD
                    {auth?.token && <IconButton iconClassName="fas fa-user" onClick={handleProfileClick} />}
                    <Following />
                    <Cart />
                    <IconButton iconClassName="fas fa-bars" onClick={() => setIsSideBarOpen(true)} />
                </div>
            </header >
            <div className="nav-bar flex flex-row bg-black justify-between 
            items-center pl-8 text-[var(--yellow-color)]">
=======
                    {auth?.token && <IconButton iconClassName="fa-user" onClick={handleProfileClick} />}
                    <IconButton iconClassName="fa-heart" onClick={handleClick} />
                    <Cart />
                    <IconButton iconClassName="fa-bars" onClick={() => setIsSideBarOpen(true)} />
                </div>
            </header >
            <div className="nav-bar flex flex-row bg-black justify-between items-center p-2 px-4">
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
                <div>Chào mừng đến với UTE Gara</div>
                <div className="flex flex-row justify-center items-center space-x-4">
                    <li className='list-none'>
                        <div className='cursor-pointer p-2 hover:bg-[var(--yellow-color)] hover:text-[black]' onClick={() => nav("/")}>Home</div>
                    </li>
                    <li className='list-none'>
                        <div className='cursor-pointer p-2 hover:bg-[var(--yellow-color)] hover:text-[black]' onClick={() => nav("/products")}>Products</div>
                    </li>
                    <li className='list-none'>
                        <div className='cursor-pointer p-2 hover:bg-[var(--yellow-color)] hover:text-[black]' onClick={() => nav("/about")}>About</div>
                    </li>
                    <li className='list-none'>
                        <div className='cursor-pointer p-2 hover:bg-[var(--yellow-color)] hover:text-[black]' onClick={() => nav("/contact")}>Contact</div>
                    </li>
                </div>
            </div>
        </div >
    );
};

export default Header;
