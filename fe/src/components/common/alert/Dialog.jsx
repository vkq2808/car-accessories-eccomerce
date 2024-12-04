import React from "react";
import { useSelector } from "react-redux";
import IconButton from "../button/IconButton";
import { syncCartAndFollowing } from '../../../redux/actions/authActions'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'

export const SyncCartAndFollowingTemplate = (cartItemsRef, followingItemsRef, token, dispatch) => {

  return (
    <div className='flex flex-col items-center bg-[--primary-background-color] text-[--primary-text-color]'>
      <div className='mb-4 text-lg font-semibold'>Bạn có muốn đồng bộ giỏ hàng và sản phẩm theo dõi không?</div>
      <div className='flex space-x-16'>
        <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600' onClick={() => {
          dispatch(syncCartAndFollowing(cartItemsRef, followingItemsRef, token));
          localStorage.removeItem('car');
          localStorage.removeItem('following_items');
          console.log(localStorage.getItem)
          dispatch({ type: GLOBALTYPES.DIALOG, payload: null });
        }}>Có</button>
        <button className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600' onClick={() => {
          localStorage.removeItem('cart');
          localStorage.removeItem('following_items');
          dispatch({ type: GLOBALTYPES.DIALOG, payload: null });
        }}>Không</button>
      </div>
    </div>
  )
}

const Dialog = () => {
  const alert = useSelector((state) => state.alert);

  return (
    <div className={`flex fixed top-0 left-0 w-full items-center justify-center z-[2001] ${(alert.dialog ? "bg-[rgba(0,0,0,0.5)] h-full" : "h-0")}`}>{
      alert.dialog && (
        <div className={"dialog flex flex-col  bg-[--primary-background-color] text-[--primary-text-color] p-[1rem] " + alert.dialog.dialogStyle}>
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