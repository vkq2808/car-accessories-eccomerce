import React, { useEffect } from "react";

const Toast = ({ msg, handleShow, icon, borderColor, textColor }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleShow()
        }, 2500)
        return () => clearTimeout(timeout)
    }, [handleShow])
    return (
        <div className={`fixed flex border-0 border-l-[4px] items-center ${borderColor} border-solid !bg-[rgba(255,255,255,0.98)]`} style={{ maxWidth: "350px", left: "10px", top: "10px", zIndex: 1000 }}>
            <i className={`${icon} ${textColor} px-5`} />
            <div className="flex flex-col">
                <div className={`toast-header flex justify-content-between`}>
                    <strong className={`mr-auto ${textColor}`}>
                        <p style={{ fontSize: "1.2rem" }}> {msg.title}</p>
                    </strong>
                    <button
                        className="ml-auto mb-1 close focus:border-0"
                        data-dismiss="toast"
                        style={{ border: "none", background: "none", fontSize: "30px", right: 0 }}
                        onClick={handleShow}>
                        &times;
                    </button>
                </div>
                <div className="toast-body">
                    <p style={{ fontSize: "1rem" }}>{msg.body}</p>
                </div>
            </div>
        </div>
    )
}

export default Toast