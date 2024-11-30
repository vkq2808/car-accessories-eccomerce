import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatNumberWithCommas } from '../../utils/stringUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getDataAPI } from '../../utils/fetchData';
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
    const [displayedProducts, setDisplayedProducts] = useState([]);
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

    useEffect(() => {
        const renderItemsWithDelay = async () => {
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

    const handleNext = async () => {
        const fetchNextResults = async () => {

            let newPage = page + 1;
            const res = await getDataAPI(`product/search?searchTerm=${searchKey}&category_id=${category_id}&page=${newPage}&limit=12`);
            if (res.status === 200) {
                setSearchResults({ products: [...searchResults.products, ...res.data.result.products] });
                setPage(newPage);
            }
        }
        setIsLoadingResults(true);
        if (!isLoadingResults) {
            await fetchNextResults();
            setIsLoadingResults(false);
        }
    }

    const hasMore = () => {
        console.log('test')
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
                    dataLength={displayedProducts.length}
                    next={() => { if (!isLoadingResults) { handleNext() } }}
                    hasMore={hasMore()}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center', paddingTop: 30 }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5'>
                        {displayedProducts.map((product, index) => (

                            <motion.div
                                key={'search-page-product-' + product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                onClick={() => navigate(`/product/${product.path}`)}
                                className='bg-inherit p-4 shadow-md shadow-[--primary-text-color] cursor-pointer'>
                                <img loading='lazy' src={product.image_url} alt={product.name} className='w-full h-40 object-cover' />
                                <h1 className='text-lg font-semibold mt-2'>{product.name}</h1>
                                <p className='text-sm mt-2'>{product.description}</p>
                                <p className='text-lg font-semibold mt-2'>{formatNumberWithCommas(product.price)} {product.currency}</p>
                            </motion.div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div >
    );
};

export default SearchPage;
