import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCT_ACTION_TYPES, searchProducts } from '../../redux/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas } from '../../utils/stringUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
    const searchResults = useSelector(state => state.product.searchResults);
    const categories = useSelector(state => state.category.list);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();

    const query = useQuery();
    const key = query.get('key');
    const categoryFilterId = query.get('categoryId');
    const [searchKey, setSearchKey] = useState(key);
    const [categoryId, setCategoryId] = useState(categoryFilterId);
    const [hasMore, setHasMore] = useState(true);
    const [displayedProducts, setDisplayedProducts] = useState([]);

    useEffect(() => {
        if (searchKey?.length > 0 || !searchKey) {
            dispatch({ type: PRODUCT_ACTION_TYPES.CLEAR_SEARCH_PRODUCTS })
            dispatch(searchProducts({ searchTerm: searchKey, category_id: categoryId, page: 1, limit: 12 }));
        }
    }, [searchKey, categoryId, dispatch]);

    useEffect(() => {
        const renderItemsWithDelay = async () => {
            setDisplayedProducts([]); // Đặt lại danh sách hiển thị
            for (let i = 0; i < searchResults.products.length; i++) {
                await new Promise(resolve => {
                    setTimeout(() => {
                        setDisplayedProducts(prev => [...prev, searchResults.products[i]]);
                        resolve();
                    }, 150); // Thay đổi thời gian nếu cần
                });
            }
        };

        if (searchResults.products.length > 0) {
            renderItemsWithDelay();
        }
    }, [searchResults.products]);

    const handleNext = () => {
        let newPage = page + 1;
        if (page * 12 >= searchResults.total) {
            setHasMore(false);
            return;
        }
        setPage(newPage);
        dispatch(searchProducts({ searchTerm: searchKey, category_id: categoryId, page: newPage, limit: 12 }));
    }

    return (
        <div className='w-full flex flex-col items-center'>
            <div className='w-11/12 mt-10'>
                <div className="flex justify-center">
                    <input type="text" className='w-[80%] border-none text-5xl text-center focus:outline-none' placeholder='Search here'
                        onChange={(e) => {
                            const searchKey = e.target.value;
                            const newUrl = new URLSearchParams(window.location.search);
                            newUrl.set('key', searchKey);
                            window.history.pushState({}, '', `${window.location.pathname}?${newUrl.toString()}`)
                            setSearchKey(searchKey);
                        }} />
                </div>
            </div>
            <div className='w-11/12 mt-10 min-h-[50dvh]'>
                <div className="flex justify-between">
                    <h1 className='text-3xl font-bold'>Search Result:
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={searchResults.total !== 0 ? { opacity: 1 } : null}
                            transition={{ duration: 1 }}>
                            {searchResults.total}
                        </motion.span>
                    </h1>
                    <div className='flex items-center'>
                        <label htmlFor='categoryFilter' className='mr-2'>Category:</label>
                        <select
                            id='categoryFilter'
                            className='border p-2 rounded'
                            value={categoryId}
                            onChange={(e) => {
                                const newCategoryId = e.target.value;
                                const newUrl = new URLSearchParams(window.location.search);
                                newUrl.set('categoryId', newCategoryId);
                                window.history.pushState({}, '', `${window.location.pathname}?${newUrl.toString()}`)
                                setCategoryId(newCategoryId);
                            }}
                        >
                            <option value='-1'>All</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <InfiniteScroll
                    dataLength={displayedProducts.length}
                    next={handleNext}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center', paddingTop: 30 }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5'>
                        {displayedProducts.map((product, index) => (

                            <LazyLoad
                                height={330}
                                offset={800}
                                placeholder={<div className='bg-gray-200 w-full h-40 animate-pulse'></div>}
                                key={index}
                            >
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className='bg-white p-4 shadow-md'>
                                    <img loading='lazy' src={product.imageUrl} alt={product.name} className='w-full h-40 object-cover' />
                                    <h1 className='text-lg font-semibold mt-2'>{product.name}</h1>
                                    <p className='text-sm mt-2'>{product.description}</p>
                                    <p className='text-lg font-semibold mt-2'>{formatNumberWithCommas(product.price)} {product.currency}</p>
                                </motion.div>
                            </LazyLoad>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div >
    );
};

export default SearchPage;
