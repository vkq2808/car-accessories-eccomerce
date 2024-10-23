import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HeaderWithSideBar } from '../components/common';
import {
    Login,
    Regist,
    VerifyEmail,
    Logout,
    EnterEmail,
    EnterNewPassword
} from '../pages';

const LoginRoute = () => {
    return (
        <>
            <HeaderWithSideBar />
            <Routes>
                <Route path='login' element={<Login />} />
                <Route path='regist' element={<Regist />} />
                <Route path='verify-email/*' element={<VerifyEmail />} />
                <Route path='logout' element={<Logout />} />
                <Route path='forgot-password' element={<EnterEmail />} />
                <Route path='reset-password/*' element={<EnterNewPassword />} />
            </Routes>
        </>
    )
};

export default LoginRoute;
