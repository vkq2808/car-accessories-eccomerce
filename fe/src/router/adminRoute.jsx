import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HeaderWithSideBar } from '../components/common'
import { AccountManagement } from '../pages';
import { AdminDashboard } from '../pages/admin';


const AdminRoute = () => {
  return (
    <>
      <HeaderWithSideBar />
      <Routes>
        <Route path='/' element={<AdminDashboard />} />
        <Route path='/manage' element={<AdminDashboard />} />
        <Route
          path='/manage/account'
          element={<AdminDashboard child={<AccountManagement />} />}
        />
      </Routes>
    </>
  );
};

export default AdminRoute;
