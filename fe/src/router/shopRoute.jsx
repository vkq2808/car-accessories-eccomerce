import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { CartDetail, NotFound, OrderInfoConfirmationPage, PaymentMethodSelector, PaymentResultPage } from '../pages';
import { Footer, HeaderWithSideBar } from '../components/common'
import { payment_method_codes } from '../constants/constants';

const ShopRoute = () => {
  return (
    <>
      <HeaderWithSideBar />
      <Routes>
        <Route path='/detail' exact element={<CartDetail />} />
        <Route path='/checkout/confirm-information' element={<OrderInfoConfirmationPage />} />
        <Route path='/checkout/payment-method' element={<PaymentMethodSelector />} />
        <Route path='/payment-result/vnpay-return/*' element={<PaymentResultPage method_code={payment_method_codes.VN_PAY} />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default ShopRoute;
