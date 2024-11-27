import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas, maximizeString } from '../../../utils/stringUtils';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../../components/common';
import { removeCartItem, retrieveCartItem, updateCartItem } from '../../../redux/actions/cartActions';
import { getEmptyOrder, ORDER_ACTION_TYPES } from '../../../redux/actions/orderActions';

const CartDetail = () => {
  const cart = useSelector(state => state.cart);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const naviagte = useNavigate();

  const handleCheckout = () => {
    if (cart.cart_items.length === 0) {
      alert('Cart is empty');
    }
    else {
      dispatch(getEmptyOrder(auth.token));
      dispatch({ type: ORDER_ACTION_TYPES.CONVERT_FROM_CART, payload: { cart: cart } });
      naviagte('/cart/checkout/confirm-information');
    }
  }



  const handleIncreaseQuantity = (index) => {
    let cartItem = cart.cart_items[index];
    let quantity = cartItem.quantity + 1;

    dispatch(updateCartItem({ token: auth.token, cart_item: cartItem, quantity }));
  }

  const handleDecreaseQuantity = (index) => {
    let cartItem = cart.cart_items[index];
    let quantity = cartItem.quantity - 1;

    if (quantity === 0) {
      handleDeleteItem(index);
    } else {
      dispatch(updateCartItem({ token: auth.token, cart_item: cartItem, quantity }));
    }
  }

  const handleDeleteItem = (index) => {
    let cartItem = cart.cart_items[index];

    dispatch(removeCartItem({ token: auth.token, cart_item: cartItem }));
  }

  const handleRetreiveItem = (index) => {
    let cartItem = cart.deleted_items[index];

    dispatch(retrieveCartItem({ token: auth.token, cart_item: cartItem }));
  }

  const handleClearCart = () => {
    for (let i = 0; i < cart.cart_items.length; i++) {
      handleDeleteItem(i);
    }
  }

  return (
    <div className='flex items-center justify-center w-full min-h-[80dvh] py-4 lg:py-8 2xl:py-16 px-0 lg:px-8 2xl:px-16 '>
      <div className="panels-container flex min-h-[80dvh]">
        <div className="left-panel h-full flex flex-col pr-[10px] lg:mr-[20px] p-2 justify-start ">
          <div className="w-full cart-list-table flex flex-col">
            <table className='lg:min-w-[35dvw]'>
              <thead className='w-full'>
                <tr className='w-full'>
                  <th className='p-[0.75rem] text-start font-bold'>Product</th>
                  <th className='p-[0.75rem] text-start font-bold'>Price</th>
                  <th className='p-[0.75rem] text-start font-bold'>Quantity</th>
                  <th className='p-[0.75rem] text-start font-bold'>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.cart_items.map((item, index) => (
                  <tr key={index}>
                    <td className='p-[0.75rem] flex'>
                      <div className="flex">
                        <img className='h-[65px] w-[65px] m-2' src={item.product.image_url} alt={item.product.name} />
                        <div className="review-item-info">
                          <h5>{maximizeString(item.product.name, 15)}</h5>
                        </div>
                      </div>
                      <IconButton
                        onClick={() => handleDeleteItem(index)}
                        className='items-start justify-start flex-col'
                        iconClassName='fa-regular fa-circle-xmark' />
                    </td>
                    <td className='p-[0.75rem] text-sm'>{formatNumberWithCommas(item.product.price)} {item.product.currency}</td>
                    <td className='p-[0.75rem] text-sm'>
                      <div className="flex">
                        <IconButton
                          onClick={() => handleDecreaseQuantity(index)}
                          className='items-center justify-start'
                          iconClassName='fa-solid fa-minus'
                        />
                        <span>{item.quantity}</span>
                        <IconButton
                          onClick={() => handleIncreaseQuantity(index)}
                          className='items-center justify-start'
                          iconClassName='fa-solid fa-plus'
                        />
                      </div>
                    </td>
                    <td className='p-[0.75rem] text-sm'>{formatNumberWithCommas(item.product.price * item.quantity)} {item.product.currency}</td>
                  </tr>
                ))}
                {cart.deleted_items.map((item, index) => (
                  <tr key={index}>
                    <td className='p-[0.75rem] flex'>
                      <div className="flex opacity-35">
                        <img className='h-[65px] w-[65px] m-2' src={item.product.image_url} alt={item.product.name} />
                        <div className="review-item-info">
                          <h5>{maximizeString(item.product.name, 15)}</h5>
                        </div>
                      </div>
                      <IconButton
                        onClick={() => handleRetreiveItem(index)}
                        className='items-start justify-start flex-col'
                        iconClassName='fa-solid fa-undo'
                      />
                    </td>
                    <td className='opacity-35 p-[0.75rem] text-sm'>{formatNumberWithCommas(item.product.price)} {item.product.currency}</td>
                    <td className='opacity-35 p-[0.75rem] text-sm'>
                      <div className="flex">
                        <IconButton
                          className='items-center justify-start'
                          iconClassName='fa-solid fa-minus'
                        />
                        <span>{item.quantity}</span>
                        <IconButton
                          className='items-center justify-start'
                          iconClassName='fa-solid fa-plus'
                        />
                      </div>
                    </td>
                    <td className='opacity-35 p-[0.75rem] text-sm'>{formatNumberWithCommas(item.product.price * item.quantity)} {item.product.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cart.cart_items.length > 0 && <div className="interactive-buttons-container flex justify-end p-4 w-full">
            <button
              type="button"
              onClick={handleClearCart}
              className="min-w-[100px] bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Clear cart</span>
            </button>
          </div>}
        </div>

        <div className="total-cost-container flex flex-col p-2 w-full h-full border-[0px] border-l border-solid border-black">
          <div className="total-cost-info flex flex-col w-full">
            <h2 className="text-lg font-bold">Total cost</h2>
            <div className="total-cost-details flex flex-col w-full">
              <div className="total-cost-detail flex justify-between w-full">
                <p className="text-sm">Subtotal</p>
                <p className="text-sm">{formatNumberWithCommas(cart.cart_items.reduce((acc, item) => acc + item.product.price * item.quantity, 0))} VND</p>
              </div>
              <div className="total-cost-detail flex justify-between">
                <p className="text-sm">Total</p>
                <p className="text-sm">{formatNumberWithCommas(cart.cart_items.reduce((acc, item) => acc + item.product.price * item.quantity, 0))} VND</p>
              </div>
            </div>
          </div>
          <div className="checkout-button-container flex justify-end p-4">
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Check out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartDetail;