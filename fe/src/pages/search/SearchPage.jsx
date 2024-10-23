import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts } from '../../redux/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas } from '../../utils/stringProcess';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
    const products = useSelector(state => state.product.list);
    const categories = useSelector(state => state.category.list);
    const dispatch = useDispatch();
    const [searchResults, setSearchResults] = useState([]);

    const query = useQuery();
    const key = query.get('key');
    const page = query.get('page');
    const categoryFilterId = query.get('categoryId');
    const [categoryId, setCategoryId] = useState(categoryFilterId);

    useEffect(() => {
        if (!products || products.length === 0) {
            dispatch(getProducts());
        }
    }, [products])

    useEffect(() => {
        const allKeys = key.split('-');
        let searchProducts = Array.from(products);
        let results = [];
        allKeys.forEach(key => {
            searchProducts.forEach(product => {
                if (parseInt(categoryId) === -1 || product.categoryId === parseInt(categoryId)) {
                    if (product.path.toLowerCase().includes(key.toLowerCase())) {
                        results.push(product);
                        searchProducts.splice(searchProducts.indexOf(product), 1);
                    }
                }
            });
        });
        setSearchResults(results);
    }, [key, categoryId, page]);

    return (
        <div className='w-full flex flex-col items-center'>
            <div className='w-11/12 mt-10'>
                <div className="flex justify-between">
                    <h1 className='text-3xl font-bold'>Search Results({searchResults.length})</h1>
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
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5'>
                    {searchResults.map(product => (
                        <div key={product.id} className='bg-white p-4 shadow-md'>
                            <img src={product.imageUrl} alt={product.name} className='w-full h-40 object-cover' />
                            <h1 className='text-lg font-semibold mt-2'>{product.name}</h1>
                            <p className='text-sm mt-2'>{product.description}</p>
                            <p className='text-lg font-semibold mt-2'>{formatNumberWithCommas(product.price)} {product.currency}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
