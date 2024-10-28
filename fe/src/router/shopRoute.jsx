import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { CartDetail, CheckOutFirstStep } from '../pages';
import { HeaderWithSideBar } from '../components/common'

const ShopRoute = () => {
  return (
    <>
      <HeaderWithSideBar />
      <Routes>
        <Route path='/detail' exact element={<CartDetail />} />
        <Route path='/checkout' element={<CheckOutFirstStep />} />
      </Routes>
    </>
  );
};

export default ShopRoute;
