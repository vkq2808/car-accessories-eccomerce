import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas, maximizeString } from '../../utils/stringUtils';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../components/common';
import { CART_ACTION_TYPES, updateCart } from '../../redux/actions/cartActions';

const CheckOutFirstStep = () => {
  const cartItems = useSelector(state => state.cart.items);
  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timer, setTimer] = React.useState(5);
  const [errors, setErrors] = React.useState({});



  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    note: '',
  });

  const redirectTimer = async () => {
    if (timer === 0) {
      navigate('/');
    } else {
      setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
  };

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

  const handleSubmitCheckout = () => {
    let errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    }
    if (!formData.phone) {
      errors.phone = 'Phone is required';
    }

    setErrors(errors);
    if (Object.keys(errors).length === 0) {

    }
  }

  return (
    <div className='check-out-container w-full md:w-[94dvw] lg:w-[80dvw]'>
      <h2 className='underline-title m-2 w-full text-center'>
        Check out
      </h2>
      <div className="check-out-form-container flex flex-col justify-between lg:flex-row w-full" >
        <div className="review-container flex flex-col mr-8 w-[90%] lg:w-[45%]">
          <h3 className='w-full'>Review</h3>
          <div className="review-items w-full grid grid-cols-1">
            {cartItems.map((item, index) => (
              <div key={index} className="review-item flex w-full justify-between">
                <div className="flex">
                  <img className='h-[65px] w-[65px] m-2' src={item.product.image_url} alt={item.product.name} />
                  <div className="review-item-info">
                    <h5>{maximizeString(item.product.name, 15)}</h5>
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
          <div className="total-price w-full">
            <h4 className='w-full'>Total Price: {formatNumberWithCommas(cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0))}</h4>
          </div>
        </div>
        <div className="check-out-form mr-8 w-[90%] lg:w-[45%]">
          <form className='w-full flex flex-col'>
            <div className='flex mb-4 items-center justify-between'>
              <label htmlFor="name">Name</label>
              <input
                className='w-[80%]'
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <p className='text-red-500'>{errors.name}</p>
            </div>
            <div className='flex mb-4 items-center justify-between'>
              <label htmlFor="email">Email</label>
              <input
                className='w-[80%]'
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <p className='text-red-500'>{errors.email}</p>
            </div>
            <div className='flex mb-4 items-center justify-between'>
              <label htmlFor="phone">Phone</label>
              <input
                className='w-[80%]'
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <p className='text-red-500'>{errors.phone}</p>
            </div>
            <div className='flex mb-4 items-center justify-between'>
              <label htmlFor="note">Note</label>
              <textarea
                className='w-[80%]'
                id="note"
                name="note"

                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
            <button type="button" onClick={handleSubmitCheckout}>Check Out</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckOutFirstStep;