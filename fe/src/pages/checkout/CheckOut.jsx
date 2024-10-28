import React from 'react';
import { useSelector } from 'react-redux';
import { formatNumberWithCommas, maximizeString } from '../../utils/stringUtils';
import { useNavigate } from 'react-router-dom';

const CheckOut = () => {
  const cartItems = useSelector(state => state.cart.items);
  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [timer, setTimer] = React.useState(5);



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

  return (
    <div className='check-out-container w-full md:w-[94dvw] lg:w-[80dvw]'>
      <h2 className='underline-title m-2 w-full text-center'>
        Check out
      </h2>
      <div className="check-out-form-container flex flex-col justify-between lg:flex-row w-full" >
        <div className="review-container flex flex-col mr-8 w-[90%] lg:w-[40%]">
          <h3 className='w-full'>Review</h3>
          <div className="review-items w-full">
            {cartItems.map((item, index) => (
              <div key={index} className="review-item grid grid-cols-1">
                <img src={item.product.imageUrl} alt={item.product.name} />
                <div className="review-item-info">
                  <h4>{maximizeString(item.product.name, 15)}</h4>
                  <p>Price: {formatNumberWithCommas(item.product.price)}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="total-price w-full">
            <h4 w-full>Total Price: {formatNumberWithCommas(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0))}</h4>
          </div>
        </div>
        <div className="check-out-form mr-8 w-[90%] lg:w-[40%]">
          <form className='w-full flex flex-col'>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
            <button type="submit">Check Out</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;