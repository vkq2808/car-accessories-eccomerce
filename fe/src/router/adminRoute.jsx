import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HeaderWithSideBar } from '../components/common'
import { AccountManagement } from '../pages';
import { AdminLandingPage, ProductManagement } from '../pages/admin';


const AdminRoute = () => {
  return (
    <>
      <HeaderWithSideBar />
      <Routes>
        <Route path='/' element={<AdminLandingPage />} />
        <Route path='/dashboard' element={<AdminLandingPage />} />
        <Route path='/manage' element={<AdminLandingPage />} />
        <Route
          path='/manage/user'
          element={<AdminLandingPage child={<AccountManagement />} />}
        />
        <Route
          path='/manage/product'
          element={<AdminLandingPage child={<ProductManagement />} />}
        />
      </Routes>
    </>
  );
};

export default AdminRoute;
