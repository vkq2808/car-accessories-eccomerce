import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HeaderWithSideBar } from '../components/common'
import ProductsByCategory from '../pages/product/ProductsByCategory';


const CategoryRoute = () => {
  return (
    <>
      <HeaderWithSideBar />
      <Routes>
        <Route path='/*' element={<ProductsByCategory />} />
      </Routes>
    </>
  );
};

export default CategoryRoute;
