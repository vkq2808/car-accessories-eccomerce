import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login';
import Regist from '../pages/regist/Regist';
import VerifyEmail from '../pages/regist/VerifyEmail';
import Logout from '../pages/login/Logout';
import EnterEmail from '../pages/resetPassword/EnterEmail';
import EnterNewPassword from '../pages/resetPassword/EnterNewPassword';

const LoginRoute = () => {
    return (
        <Routes>
            <Route path='login' element={<Login />} />
            <Route path='regist' element={<Regist />} />
            <Route path='verify-email/*' element={<VerifyEmail />} />
            <Route path='logout' element={<Logout />} />
            <Route path='forgot-password' element={<EnterEmail />} />
            <Route path='reset-password/*' element={<EnterNewPassword />} />
        </Routes>
    )
};

export default LoginRoute;
