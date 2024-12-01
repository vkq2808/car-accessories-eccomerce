import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatNumberWithCommas } from '../../utils/stringUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getDataAPI } from '../../utils/fetchData';
import { debounce } from 'lodash';
import { CustomMarkdown } from '../../components';
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
    const categories = useSelector(state => state.category.list);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const query = useQuery();
    const key = query.get('key');
    const categoryFilterId = query.get('category_id');
    const [searchKey, setSearchKey] = useState(key);
    const [category_id, setcategory_id] = useState(categoryFilterId);
    const [searchResults, setSearchResults] = useState({ products: [], total: 0 });
    const [isLoadingResults, setIsLoadingResults] = useState(false);


    useEffect(() => {
        const fetchFirstResults = async () => {
            const res = await getDataAPI(`product/search?searchTerm=${searchKey}&category_id=${category_id}&page=${1}&limit=12`);
            if (res.status === 200) {
                setSearchResults(res.data.result);
            }
        }

        if (searchKey && category_id) {
            fetchFirstResults();
        }
    }, [searchKey, category_id]);

    const handleNext = async () => {
        if (isLoadingResults || !hasMore()) return; // Ngăn chặn gọi nếu đang tải hoặc hết dữ liệu

        setIsLoadingResults(true); // Đặt cờ ngay khi bắt đầu tải
        try {
            const newPage = page + 1;
            const res = await getDataAPI(`product/search?searchTerm=${searchKey}&category_id=${category_id}&page=${newPage}&limit=12`);

            if (res.status === 200) {
                const newProducts = res.data.result.products;
                setSearchResults(prev => ({
                    ...prev,
                    products: [...prev.products, ...newProducts],
                }));
                setPage(newPage);
            }
        } catch (error) {
            console.error("Error fetching next results:", error);
        } finally {
            setIsLoadingResults(false); // Hoàn tất tải
        }
    };
    const handleNextDebounced = debounce(() => {
        if (!isLoadingResults && hasMore()) {
            handleNext();
        }
    }, 300);

    const hasMore = () => {
        return searchResults.products.length < searchResults.total;
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
                            value={category_id}
                            onChange={(e) => {
                                const newcategory_id = e.target.value;
                                const newUrl = new URLSearchParams(window.location.search);
                                newUrl.set('category_id', newcategory_id);
                                window.history.pushState({}, '', `${window.location.pathname}?${newUrl.toString()}`)
                                setcategory_id(newcategory_id);
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
                    dataLength={searchResults.products.length}
                    next={handleNextDebounced}
                    hasMore={hasMore()}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center', paddingTop: 30 }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    className='h-screen'
                >
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr>
                                <th className='w-1/4 text-center'>Image</th>
                                <th className='text-left'>Product Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.products.map((product, index) => (
                                <tr
                                    key={'search-page-product-' + product.id}
                                    onClick={() => navigate(`/product/${product.path}`)}
                                    className='cursor-pointer hover:bg-gray-100 h-50'
                                >
                                    <td className="w-1/4 text-start h-40">
                                        <img
                                            loading='lazy'
                                            src={product.image_url}
                                            alt={product.name}
                                            className='h-40 w-auto object-cover mx-auto'
                                        />
                                    </td>
                                    <td className="p-4 align-middle h-40 overflow-hidden">
                                        <h1 className='text-lg font-semibold'>{product.name}</h1>
                                        <p className='text-lg font-semibold'>
                                            {formatNumberWithCommas(product.price)} {product.currency}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </InfiniteScroll>
            </div>
        </div >
    );
};

export default SearchPage;
