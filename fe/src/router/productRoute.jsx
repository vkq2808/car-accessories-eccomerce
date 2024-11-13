import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ProductDetail } from '../pages';
import { Footer, HeaderWithSideBar } from '../components/common'

const ProductRoute = () => {
    return (
        <>
            <HeaderWithSideBar />
            <Routes>
                <Route path='/*' element={<ProductDetail />} />
            </Routes>
            <Footer />
        </>
    );
};

export default ProductRoute;
