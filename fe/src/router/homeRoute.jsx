import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { Footer, HeaderWithSideBar } from '../components/common'
import { UserProfile, SearchPage, NewHome } from '../pages'
import { useSelector } from 'react-redux';

const HomeRoute = () => {

    const auth = useSelector(state => state.auth);

    return (
        <>
            <HeaderWithSideBar user={auth.user} />
            <Routes>
                <Route path='' element={<NewHome />} />
                <Route path='profile' element={<UserProfile />} />
                <Route path='profile/edit' element={<UserProfile isEditing={true} />} />
                <Route path='search/:searchTerm' element={<SearchPage />} loader />
            </Routes>
            <Footer />
        </>
    )
};

export default HomeRoute;
