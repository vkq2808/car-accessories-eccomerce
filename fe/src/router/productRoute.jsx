import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProductDetail from '../pages/product/ProductDetail';
import HeaderWithCommonSideBar from '../components/common/header/HeaderWithCommonSideBar';

const ProductRoute = () => {
    return (
        <>
            <HeaderWithCommonSideBar />

            <Routes>
                <Route path='/*' element={<ProductDetail />} />
            </Routes>
        </>
    );
};

export default ProductRoute;
