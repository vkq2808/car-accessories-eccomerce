import React from 'react';
import Headroom from 'react-headroom';
import { useState } from 'react';

import { Header, SideBar } from '../../common';
import { AdminSideBar } from '../../admin';

const HeaderWithSideBar = ({ user }) => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const SideBarLanding = user?.role === "USER" ? SideBar : user?.role === "ADMIN" ? AdminSideBar : SideBar;

    return (
        <div>
            <div
                onClick={() => setIsSideBarOpen(false)}
                className={`BodyCover flex flex-row ${isSideBarOpen ? '' : 'hidden'}`}>
            </div>
            <div className={`SideBar pt-5 flex flex-col ${isSideBarOpen ? '' : 'hidden'}`}>
                <SideBarLanding setIsSideBarOpen={setIsSideBarOpen} user={user} />
            </div>
            <Headroom className="Headroom w-full z-[101]" style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }} disable={isSideBarOpen} >
                <Header setIsSideBarOpen={setIsSideBarOpen} />
            </Headroom>
        </div>
    );
};

export default HeaderWithSideBar;