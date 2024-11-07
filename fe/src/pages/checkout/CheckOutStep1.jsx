import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas } from '../../utils/stringUtils';
// import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../components/common';
import { CART_ACTION_TYPES, updateCart } from '../../redux/actions/cartActions';
import CheckoutForm from './CheckOutForm';

const CheckOutFirstStep = () => {
  const cartItems = useSelector(state => state.cart.items);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();


  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    note: '',
  });

  // const navigate = useNavigate();
  // const [timer, setTimer] = React.useState(5);
  // const redirectTimer = async () => {
  //   if (timer === 0) {
  //     navigate('/');
  //   } else {
  //     setTimeout(() => {
  //       setTimer((prev) => prev - 1);
  //     }, 1000);
  //   }
  // };

  // if (cartItems.length === 0) {

  //   redirectTimer();

  //   return (
  //     <div className='check-out-container'>
  //       <h2>Your cart is empty</h2>
  //       <h4>You will be redirect to Homepage in {timer} </h4>
  //     </div>
  //   );
  // }

  const handleDeleteItem = (index) => {
    let updateCartItems = cartItems.filter((item, i) => i !== index);

    if (auth.token) {
      dispatch(updateCart({ token: auth.token, cart_items: updateCartItems }));
    } else {
      dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { items: updateCartItems, deleted: cartItems[index] } });
    }
  }

  const handleIncreaseQuantity = (index) => {
    let updateCartItems = cartItems.map((ci, i) => i === index ? { ...ci, quantity: ci.quantity + 1 } : ci);
    if (auth.token) {
      dispatch(updateCart({ token: auth.token, cart_items: updateCartItems }));
    } else {
      dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { items: updateCartItems } });
    }
  }

  const handleDecreaseQuantity = (index) => {
    let updateCartItems = cartItems.map((ci, i) => i === index ? { ...ci, quantity: ci.quantity - 1 >= 0 ? ci.quantity -= 1 : ci.quantity } : ci);
    if (auth.token) {
      dispatch(updateCart({ token: auth.token, cart_items: updateCartItems }));
    } else {
      dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { items: updateCartItems } });
    }
  }
  return (
    <div className='check-out-container w-[calc(100vw-17px)] overflow-clip mb-8 bg-[--primary-background-color] text-[--primary-text-color]'>
      <h2 className='underline-title mb-2 w-full text-center'>
        Check out
      </h2>
      <div className="flex justify-between lg:flex-row w-full" >
        <div className="review-container flex flex-col pr-8 pl-10 w-full">
          <h3 className='w-full'>Review</h3>
          <div className="review-items w-full grid grid-cols-1 px-10">
            {cartItems.map((item, index) => (
              <div key={index} className="review-item flex w-full justify-between">
                <div className="flex flex-wrap items-center">
                  <img className='h-[65px] w-[65px] mr-4' src={item.product.image_url} alt={item.product.name} />
                  <div className="review-item-info w-[400px]">
                    <h5 className='text-nowrap overflow-hidden text-ellipsis'>{item.product.name}</h5>
                    <p className='!m-0'>Price: {formatNumberWithCommas(item.product.price)}</p>
                    <div className="flex">
                      Quantity:
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
                  </div>
                </div>
                <IconButton
                  onClick={() => handleDeleteItem(index)}
                  className='items-start justify-start flex-col'
                  iconClassName='fa-regular fa-circle-xmark' />
              </div>
            ))}
          </div>
          <div className="total-price w-full mt-4">
            <h4 className='w-full'>Total Price: {formatNumberWithCommas(cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0))}</h4>
          </div>
        </div>
        <CheckoutForm formData={formData} setFormData={setFormData} />
      </div>
    </div>
  );
};

export default CheckOutFirstStep;