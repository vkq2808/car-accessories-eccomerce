import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ProductDetail } from '../pages';
import { HeaderWithSideBar } from '../components/common'

const ProductRoute = () => {
    return (
        <>
            <HeaderWithSideBar />
            <Routes>
                <Route path='/*' element={<ProductDetail />} />
            </Routes>
        </>
    );
};

export default ProductRoute;
