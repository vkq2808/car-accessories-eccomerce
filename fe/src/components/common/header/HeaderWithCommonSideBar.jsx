import React from 'react';
import Headroom from 'react-headroom';
import Header from './Header';
import CommonSideBar from '../sideBar/CommonSideBar';
import { useState } from 'react';

const HeaderWithCommonSideBar = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <div>
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
        </div>
    );
};

export default HeaderWithCommonSideBar;