import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IconButton, Cart } from '..';
import { formatNumberWithCommas } from '../../../utils/stringUtils';
import { getCategories } from '../../../redux/actions/categoryActions';
import Following from './following/Following';
import { PRODUCT_ACTION_TYPES, headerSearchProducts } from '../../../redux/actions/productActions';
import Headroom from 'react-headroom';
import { postDataAPI } from '../../../utils/fetchData';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
const Header = ({ setIsSideBarOpen }) => {

    const auth = useSelector(state => state.auth);
    const categories = useSelector(state => state.category.list);
    const searchResults = useSelector(state => state.product.headerSearchResults);
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [category_id, setcategory_id] = useState(-1);
    const [escapePressed, setEscapePressed] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loadingUser, setLoadingUser] = useState(false);

    useEffect(() => {
        const renderItemsWithDelay = async () => {
            setDisplayedProducts([]); // Đặt lại danh sách hiển thị
            for (let i = 0; i < searchResults.products.length; i++) {
                await new Promise(resolve => {
                    setTimeout(() => {
                        setDisplayedProducts(prev => [...prev, searchResults.products[i]]);
                        resolve();
                    }, 50); // Thay đổi thời gian nếu cần
                });
            }
        };

        if (searchResults.products.length >= 0) {
            renderItemsWithDelay();
        }
    }, [searchResults.products]);

    const handleProfileClick = () => {
        handleNavigate('/profile');
    };

    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setEscapePressed(false);
    };

    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(getCategories());
        }
    }, [categories, dispatch]);

    const onFilterCategoryChange = (e) => {
        setcategory_id(e.target.value);
    };

    useEffect(() => {
        dispatch({ type: PRODUCT_ACTION_TYPES.CLEAR_HEADER_SEARCH_PRODUCTS })
        setTimeout(() => {
            if (searchTerm && searchTerm !== '' && (category_id || category_id === -1)) {
                dispatch(headerSearchProducts({ searchTerm, category_id: category_id, page: 1, limit: 6 }));
            }
        }, 100);
    }, [dispatch, searchTerm, category_id]);



    const handleSearch = (e) => {
        if (searchTerm === '') {
            return;
        }

        if (e.key && e.key === 'Escape') {
            setEscapePressed(true);
        }

        if (e.key === 'Enter' || e.type === 'click') {
            const sanitizedSearchTerm = searchTerm.trim().replace(/[\s/]+/g, '-');
            handleNavigate('/search/q?key=' + sanitizedSearchTerm + '&category_id=' + category_id.toString());
            setSearchTerm('');
        }
    };

    const handleNavigate = (path) => {
        setIsSideBarOpen(false);
        const currentPath = window.location.pathname;
        nav(path, { state: { from: currentPath } });
    }

    return (
        <div className='flex flex-col w-screen border-none z-10 md:py-0'>
            <Headroom className="w-full z-[101] bg-[--primary-background-color] text-[--primary-text-color] border-0 border-b-2 border-solid border-[--primary-text-color]"
                style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }} >
                <header className="w-full flex flex-col md:flex-row justify-between items-center border-b border-b-black bg-[--primary-background-color] text-[--primary-text-color]">
                    <div className="ml-[100px] cursor-pointer"
                        onClick={() => {
                            handleNavigate('/');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <div className='text-5xl select-none'>HAQ</div>
                    </div>
                    <div className="search-bar w-[40%] justify-center items-center hidden lg:!flex flex-row">
                        <select className="border-none p-2 w-[100px] bg-inherit text-inherit"
                            onChange={(e) => onFilterCategoryChange(e)}
                            value={category_id}
                        >
                            <option className='bg-inherit text-inherit' value={-1}>Tất cả</option>
                            {categories.map(category => (
                                <option key={'header-category-' + category.id}
                                    value={category.id} >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <input
                            className="border-none p-2 px-4 w-full md:w-[70%] lg:w-[80%] rounded-3xl bg-inherit text-inherit"
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={onSearchChange}
                            onKeyDown={(e) => handleSearch(e)}
                            onFocus={() => setEscapePressed(false)}
                        />
                        {searchTerm !== '' && !escapePressed &&
                            <AnimatePresence>
                                <motion.div
                                    className="search-result absolute bg-[--primary-background-color] text-[--primary-text-color] border border-black w-[500px] top-[78px] p-4"
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex justify-between p-4">
                                        <h6 className="text-center">Kết quả tìm kiếm:</h6>
                                        <h6>{searchResults.total} sản phẩm được tìm thấy</h6>
                                    </div>
                                    {displayedProducts.map((product, index) => (
                                        <motion.div
                                            key={'header-search-product-' + product.id}
                                            initial={{ opacity: 0, x: 30 }} // Bắt đầu từ trạng thái ẩn
                                            animate={{ opacity: 1, x: 0 }}   // Hiện ra với opacity 1
                                            transition={{ duration: 0.2, delay: index * 0.1 }} // Tăng dần delay để tạo hiệu ứng lần lượt
                                            className="search-item p-2 border-b border-black "
                                        >
                                            <div className="flex p-1 m-1 border items-center"
                                                onClick={() => handleNavigate('/product/' + product.path)}>
                                                <img
                                                    className="w-[70px] h-[70px] cursor-pointer"
                                                    src={product.image_url}
                                                    alt={product.name}
                                                />
                                                <div className="flex flex-col m-2 pr-4 cursor-pointer">
                                                    <div>{product.name}</div>
                                                    <div className='text-blue-500'>
                                                        {formatNumberWithCommas(product.price)} {product.currency}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                    }
                                </motion.div>
                            </AnimatePresence>
                        }
                        <button onClick={(e) => handleSearch(e)} className="border-none bg-transparent block w-auto text-inherit">
                            <IconButton iconClassName="fas fa-search"
                                className={"h-auto p-2 "} />
                        </button>
                    </div>
                    <div className="flex flex-row justify-start space-x-4 mt-2 md:mt-0 items-center mr-2">
                        {!auth.token && <div className='flex flex-row'>
                            <div className='pl-1 mr-1' onClick={() => handleNavigate('/auth/login')}>
                                <span className='underline text-[blue] cursor-pointer'>Đăng nhập</span>
                            </div>
                            /
                            <div className='pl-1 mr-1' onClick={() => handleNavigate('/auth/regist')}>
                                <span className='underline text-[blue] cursor-pointer'>Đăng ký</span>
                            </div>
                        </div>}
                        {(auth.token || loadingUser) && <IconButton iconClassName="fas fa-user" onClick={handleProfileClick} />}
                        <Following />
                        <Cart />
                        <IconButton iconClassName="fas fa-bars" onClick={() => setIsSideBarOpen(true)} />
                    </div>
                </header >
            </Headroom>
        </div >
    );
};

export default Header;
