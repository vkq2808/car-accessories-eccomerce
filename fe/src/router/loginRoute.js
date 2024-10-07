import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login';
import Regist from '../pages/regist/Regist';
import VerifyEmail from '../pages/regist/VerifyEmail';
import Logout from '../pages/login/Logout';
import EnterEmail from '../pages/resetPassword/EnterEmail';
import EnterNewPassword from '../pages/resetPassword/EnterNewPassword';
import Headroom from 'react-headroom';
import Header from '../components/common/header/Header.jsx';
import CommonSideBar from '../components/common/sideBar/CommonSideBar.jsx';
import { useState } from 'react'
import Footer from '../components/common/footer/Footer.jsx';

const LoginRoute = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    return (
        <>
            <div
                onClick={() => setIsSideBarOpen(false)}
                className={`BodyCover flex flex-row ${isSideBarOpen ? '' : 'hidden'}`}>
            </div>
            <div className={`SideBar pt-5 flex flex-col ${isSideBarOpen ? '' : 'hidden'}`}>
                <CommonSideBar setIsSideBarOpen={setIsSideBarOpen} />
            </div>
            <Headroom className="Headroom w-full z-[101]" disable={isSideBarOpen} >
                <Header setIsSideBarOpen={setIsSideBarOpen} />
            </Headroom>

            <Routes>
                <Route path='login' element={<Login />} />
                <Route path='regist' element={<Regist />} />
                <Route path='verify-email/*' element={<VerifyEmail />} />
                <Route path='logout' element={<Logout />} />
                <Route path='forgot-password' element={<EnterEmail />} />
                <Route path='reset-password/*' element={<EnterNewPassword />} />
            </Routes>

            <Footer />
        </>
    )
};

export default LoginRoute;
