import React from 'react';
import { useState } from 'react';

import { Header, SideBar } from '../../common';
// import { AdminSideBar } from '../../admin';

const HeaderWithSideBar = ({ user }) => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const SideBarLanding = SideBar;
    return (
        <div>
            <div
                onClick={() => setIsSideBarOpen(false)}
                className={`BodyCover flex flex-row fixed top-0 left-0 h-[100vh] w-[100vw] z-[200] bg-[rgba(0,0,0,0.5)] 
                    ${isSideBarOpen ? '' : 'hidden'}`}>
            </div>
            <div className={`SideBar flex flex-col fixed top-0 right-0 z-[201] h-[100vh] w-[100vw] md:w-[60vw] lg:w-[30vw] 2xl:w-[20vw]  ${isSideBarOpen ? '' : 'hidden'}`}>
                <SideBarLanding setIsSideBarOpen={setIsSideBarOpen} user={user} />
            </div>
            <Header setIsSideBarOpen={setIsSideBarOpen} />
        </div>
    );
};

export default HeaderWithSideBar;