import React from "react";
import { useSelector } from "react-redux";
import IconButton from "../button/IconButton";

const Dialog = () => {
  const alert = useSelector((state) => state.alert);

  return (
    <div className={"flex fixed top-0 left-0 w-full items-center justify-center z-[2001] " + (alert.dialog ? "bg-[rgba(0,0,0,0.5)] h-full" : "h-0")}>{
      alert.dialog && (
        <div className={"dialog flex flex-col bg-white p-[1rem] " + alert.dialog.dialogStyle}>
          <div className={"dialog-header flex justify-between mb-5" + alert.dialog.headerStyle}>
            <h3 className={alert.dialog.titleStyle}>{alert.dialog.title}</h3>
            <IconButton onClick={alert.dialog.onClose} iconClassName="fas fa-close" size="sm" className={alert.dialog.closeBtnStyle} />
          </div>
          <div className={"dialog-body flex " + alert.dialog.bodyStyle}>
            {alert.dialog.children}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dialog;