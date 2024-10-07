import React from "react";

const Loading = () => {
    return (
        <div
            style={{ background: "white", top: 0, left: 0, zIndex: 101, opacity: .7 }}
            className="position-fixed vh-100 w-100 d-flex justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center gap-4">
                <div className="spinner-border" style={{ width: "6rem", height: "6rem", borderWidth: "1.3rem", color: "#2F55A6" }} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <h4
                    style={{ fontSize: "3rem", color: "#2F55A6" }}
                >Loading....</h4>
            </div>
        </div>
    )
}

export default Loading