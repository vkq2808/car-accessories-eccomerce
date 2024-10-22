import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { HeaderWithSideBar } from '../components/common'
import { Home, UserProfile } from '../pages'
import { useSelector } from 'react-redux';

const HomeRoute = () => {

    const auth = useSelector(state => state.auth);

    return (
        <>
            <HeaderWithSideBar user={auth?.user} />
            <Routes>
                <Route path='' element={<Home />} />
                <Route path='profile' element={<UserProfile />} />
                <Route path='profile/edit' element={<UserProfile isEditing={true} />} />
            </Routes>
        </>
    )
};

export default HomeRoute;
