import React from "react";

import LoadingSpinner from "./LoadingSpinner";

const Loading = () => {
    return (
        <div
            style={{ background: "white", top: 0, left: 0, zIndex: 101, opacity: .7 }}
            className="fixed h-screen w-screen flex justify-center items-center">
            <div className="flex justify-center items-center gap-4">
                <LoadingSpinner />
                <h4 className="text-lg font-semibold text-[#2F55A6]">Loading...</h4>
            </div>
        </div>
    )
}

export default Loading