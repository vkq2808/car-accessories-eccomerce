import React from 'react';
import { useSelector } from 'react-redux';
import { formatNumberWithCommas, maximizeString } from '../../utils/stringUtils';
import { useNavigate } from 'react-router-dom';

const CartDetail = () => {
  const cartItems = useSelector(state => state.cart.items);
  const naviagte = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
    }
    else {
      naviagte('/cart/checkout');
    }
  }

  return (
    <div className='flex items-center justify-center w-full min-h-[80dvh] py-4 lg:py-8 2xl:py-16 px-0 lg:px-8 2xl:px-16 '>
      <div className="panels-container flex h-full min-h-[80dvh]">
        <div className="left-panel h-full flex flex-col pr-[10px] lg:mr-[20px] p-2 justify-start">
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
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className='p-[0.75rem]'>
                      <div className="product-info flex items-start">
                        <img className="product-image h-[60px] w-[60px]" src={item.product.imageUrl} alt="product" />
                        <div className="p-[0.25rem] flex flex-col">
                          <p className="text-sm m-0">{maximizeString(item.product.name, 15)}</p>
                          <p className="text-xs m-0 text-[rgba(51,51,51,0.4)]">Thể loại: {item.product.category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className='p-[0.75rem] text-sm'>{formatNumberWithCommas(item.product.price)} {item.product.currency}</td>
                    <td className='p-[0.75rem] text-sm'>
                      {item.quantity}
                    </td>
                    <td className='p-[0.75rem] text-sm'>{formatNumberWithCommas(item.product.price * item.quantity)} {item.product.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cartItems.length > 0 && <div className="interactive-buttons-container flex justify-end p-4 w-full">
            <button className="btn btn-primary">Clear cart</button>
          </div>}
        </div>

        <div className="total-cost-container flex flex-col p-2">
          <div className="total-cost-info flex flex-col">
            <h2 className="text-lg font-bold">Total cost</h2>
            <div className="total-cost-details flex flex-col">
              <div className="total-cost-detail flex justify-between">
                <p className="text-sm">Subtotal</p>
                <p className="text-sm">{formatNumberWithCommas(cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0))} VND</p>
              </div>
              <div className="total-cost-detail flex justify-between">
                <p className="text-sm">Total</p>
                <p className="text-sm">{formatNumberWithCommas(cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0))} VND</p>
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