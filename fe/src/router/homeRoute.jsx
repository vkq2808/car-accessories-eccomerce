import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserProfile from '../pages/profile/UserProfile';
import HeaderWithCommonSideBar from '../components/common/header/HeaderWithCommonSideBar';

const HomeRoute = () => {
    return (
        <>
            <HeaderWithCommonSideBar />
            <Routes>
                <Route path='profile' element={<UserProfile />} />
                <Route path='profile/edit' element={<UserProfile isEditing={true} />} />
            </Routes>
        </>
    )
};

export default HomeRoute;
