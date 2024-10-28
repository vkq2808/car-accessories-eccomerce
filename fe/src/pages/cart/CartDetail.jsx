import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas, maximizeString } from '../../utils/stringUtils';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../components/common';
import { addProductToCart, CART_ACTION_TYPES, updateCart } from '../../redux/actions/cartActions';

const CartDetail = () => {
  const cart = useSelector(state => state.cart);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const naviagte = useNavigate();

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Cart is empty');
    }
    else {
      naviagte('/cart/checkout');
    }
  }



  const handleDeleteItem = (index) => {
    let updateCartItems = cart.items.filter((item, i) => i !== index);
    let updateDeletedItems = [...cart.deleted_items, cart.items[index]];

    if (auth.token) {
      dispatch(updateCart({ token: auth.token, cart_items: updateCartItems }));
    } else {
      dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { items: updateCartItems, deleted_items: updateDeletedItems } });
    }
  }

  const handleIncreaseQuantity = (index) => {
    let updateCartItems = cart.items.map((ci, i) => i === index ? { ...ci, quantity: ci.quantity + 1 } : ci);
    if (auth.token) {
      dispatch(updateCart({ token: auth.token, cart_items: updateCartItems }));
    } else {
      dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { items: updateCartItems } });
    }
  }

  const handleDecreaseQuantity = (index) => {
    let updateCartItems = cart.items.map((ci, i) => i === index ? { ...ci, quantity: ci.quantity - 1 >= 0 ? ci.quantity -= 1 : ci.quantity } : ci);
    if (auth.token) {
      dispatch(updateCart({ token: auth.token, cart_items: updateCartItems }));
    } else {
      dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { items: updateCartItems } });
    }
  }

  const handleRetreiveItem = (index) => {
    let updateCartItems = [...cart.items, cart.deleted_items[index]];
    let updateDeletedItems = cart.deleted_items.filter((item, i) => i !== index);

    if (auth.token) {
      dispatch(addProductToCart({ token: auth.token, product: cart.deletedItems[index].product, quantity: cart.deletedItems[index].quantity }));
    } else {
      dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { items: updateCartItems, deleted_items: updateDeletedItems } });
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
                {cart.items.map((item, index) => (
                  <tr key={index}>
                    <td className='p-[0.75rem] flex'>
                      <div className="flex">
                        <img className='h-[65px] w-[65px] m-2' src={item.product.imageUrl} alt={item.product.name} />
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
                        <img className='h-[65px] w-[65px] m-2' src={item.product.imageUrl} alt={item.product.name} />
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
          {cart.items.length > 0 && <div className="interactive-buttons-container flex justify-end p-4 w-full">
            <button className="btn btn-primary">Clear cart</button>
          </div>}
        </div>

        <div className="total-cost-container flex flex-col p-2 w-full h-full border-[0px] border-l border-solid border-black">
          <div className="total-cost-info flex flex-col w-full">
            <h2 className="text-lg font-bold">Total cost</h2>
            <div className="total-cost-details flex flex-col w-full">
              <div className="total-cost-detail flex justify-between w-full">
                <p className="text-sm">Subtotal</p>
                <p className="text-sm">{formatNumberWithCommas(cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0))} VND</p>
              </div>
              <div className="total-cost-detail flex justify-between">
                <p className="text-sm">Total</p>
                <p className="text-sm">{formatNumberWithCommas(cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0))} VND</p>
              </div>
            </div>
          </div>
          <div className="checkout-button-container flex justify-end p-4">
            <button className="btn btn-primary"
              onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartDetail;