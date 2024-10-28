import React from "react";
import { useSelector } from "react-redux";
import IconButton from "../button/IconButton";
import { syncCartAndFollowing } from '../../../redux/actions/authActions'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import { useDispatch } from 'react-redux'

export const SyncCartAndFollowingTemplate = (cartItemsRef, followingItemsRef, token) => {
  const dispatch = useDispatch();

  return (
    <div className='flex justify-center flex-col'>
      <div className='mb-2'>'Bạn có muốn khôi phục giỏ hàng và sản phẩm theo dõi không?'</div>
      <div className='flex justify-between'>
        <button className='btn btn-primary' onClick={() => {
          dispatch(syncCartAndFollowing(cartItemsRef, followingItemsRef, token));
          localStorage.removeItem('cart_items');
          localStorage.removeItem('following_items');
          dispatch({ type: GLOBALTYPES.DIALOG, payload: null });
        }}>Có</button>
        <button className='btn btn-danger' onClick={() => {
          localStorage.removeItem('cart_items');
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