import React, { useEffect } from "react";

const Toast = ({ msg, handleShow, icon, textColor }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleShow()
        }, 2000)
        return () => clearTimeout(timeout)
    }, [handleShow])
    return (
        <div className={`toast show position-fixed !bg-[rgba(255,255,255,0.95)]`} style={{ maxWidth: "350px", right: "10px", top: "10px", zIndex: 1000 }}>
            <div className={`toast-header justify-content-between`}>
                <strong className={`mr-auto ${textColor}`}><p style={{ fontSize: "1.2rem" }}><i className={`${icon}`} /> {msg.title}</p></strong>
                <button
                    className="ml-auto mb-1 close"
                    data-dismiss="toast"
                    style={{ border: "none", background: "none", fontSize: "30px", right: 0 }}
                    onClick={handleShow}>
                    &times;
                </button>
            </div>
            <div className="toast-body"><p style={{ fontSize: "1rem" }}>{msg.body}</p></div>
        </div>
    )
}

export default Toast