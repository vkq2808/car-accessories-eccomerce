import React, { useState } from 'react';
import { Header, SideBar } from '../../common';
import { AnimatePresence } from 'framer-motion';

const HeaderWithSideBar = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <div>
            {/* Overlay để đóng sidebar */}
            <div
                onClick={() => setIsSideBarOpen(false)}
                className={`BodyCover flex flex-row fixed top-0 left-0 h-[100vh] w-[100vw] z-[200] bg-[rgba(0,0,0,0.5)] ${isSideBarOpen ? '' : 'hidden'}`}
            ></div>

            {/* Bọc với AnimatePresence */}
            <AnimatePresence>
                {isSideBarOpen && (
                    <SideBar setIsSideBarOpen={setIsSideBarOpen} />
                )}
            </AnimatePresence>

            {/* Header component */}
            <Header setIsSideBarOpen={setIsSideBarOpen} />
        </div>
    );
};

export default HeaderWithSideBar;
