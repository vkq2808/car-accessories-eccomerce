import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserProfile from '../pages/profile/UserProfile';
import Headroom from 'react-headroom';
import Header from '../components/common/header/Header.jsx';
import CommonSideBar from '../components/common/sideBar/CommonSideBar.jsx';
import { useState } from 'react'
import Footer from '../components/common/footer/Footer.jsx';
import Home from '../pages/home/Home';

const HomeRoute = () => {
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

                <Route exact path='/' Component={Home} />
                <Route path='profile' element={<UserProfile />} />
                <Route path='profile/edit' element={<UserProfile isEditing={true} />} />
            </Routes>
            <Footer />
        </>
    )
};

export default HomeRoute;
