import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Footer, HeaderWithSideBar } from '../components/common'
import { SearchPage } from '../pages';


const CategoryRoute = () => {
  return (
    <>
      <HeaderWithSideBar />
      <Routes>
        <Route path='/*' element={<SearchPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default CategoryRoute;
