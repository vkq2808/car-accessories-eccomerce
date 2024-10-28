import React from "react";

import LoadingSpinner from "./LoadingSpinner";

const Loading = () => {
    return (
        <div
            style={{ background: "white", top: 0, left: 0, zIndex: 101, opacity: .7 }}
            className="position-fixed vh-100 w-100 d-flex justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center gap-4">
                <LoadingSpinner />
                <h4
                    style={{ fontSize: "3rem", color: "#2F55A6" }}
                >Loading....</h4>
            </div>
        </div>
    )
}

export default Loading