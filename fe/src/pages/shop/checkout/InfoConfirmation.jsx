import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas } from '../../../utils/stringUtils';
// import { useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import { ORDER_ACTION_TYPES } from '../../../redux/actions/orderActions';
import { useNavigate } from 'react-router-dom';

const OrderInfoConfirmationPage = () => {
  const order = useSelector(state => state.order);
  const orderItems = order.order_items;
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [form, setForm] = useState({
    name: user ? (user?.first_name + ' ' + user?.last_name) : '',
    email: user?.email || '',
    phone: user?.phone || '',
    shipping_address: user?.address || '',
    note: '',
  });

  const emailDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];

  const validateForm = (name, value) => {
    let newErrors = {};
    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required";
        } else if (value.length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Invalid email format";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        const phoneRegex = /^\+?[1-10]\d{9,14}$/;
        if (!value) {
          newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(value.replace(/\D/g, ""))) {
          newErrors.phone = "Invalid phone number";
        } else {
          delete newErrors.phone;
        }
        break;
      case "shipping_address":
        if (!value.trim()) {
          newErrors.shipping_address = "Shipping address is required";
        } else if (value.length < 10) {
          newErrors.shipping_address = "Shipping address must be at least 10 characters";
        } else {
          delete newErrors.shipping_address;
        }
        break;

      default:
        break;
    }
    setErrors(newErrors);

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "phone" ? formatPhoneNumber(value) : value });
    validateForm(name, value);
  };

  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, "");
    if (phone.length <= 4) return phone;
    if (phone.length <= 7) return `${phone.slice(0, 3)}-${phone.slice(3)}`;
    return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7, 11)}`;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateForm(name, form[name]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let allErrors = {};
    for (const key in form) {
      allErrors = { ...allErrors, ...validateForm(key, form[key]) };
    }

    // Check if there are any validation errors
    if (Object.keys(allErrors).length === 0) {
      setTimeout(() => {
        dispatch({ type: ORDER_ACTION_TYPES.UPDATE_ORDER_INFO, payload: { info: form } });
        navigate("/cart/checkout/payment-method");
      }, 1000);
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, ...allErrors }));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!order.order_items) {
      navigate('/')
    } else {
      setTotalAmount(order.order_items?.reduce((acc, item) => acc + item.product_option.price * item.quantity, 0));
    }
  }, [order, navigate]);

  return (
    <div className="check-out-container w-[calc(100vw-17px)] overflow-clip mb-8 bg-[--primary-background-color] text-[--primary-text-color]">
      <h2 className="underline-title mb-2 w-full text-center">Check out</h2>
      <div className="flex justify-between flex-col xl:flex-row">
        <div className="review-container flex flex-col pr-8 pl-10 w-full">
          <h3 className="w-full mb-6">Review</h3>
          <div className="review-items w-full px-10">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Option</th>
                  <th className="py-2 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4 flex items-center gap-4">
                      <img
                        className="h-[65px] w-[65px] rounded"
                        src={item.product.image_url}
                        alt={item.product.name}
                      />
                      <div className="overflow-hidden">
                        <h5 className="truncate">{item.product.name}</h5>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      {formatNumberWithCommas(item.product_option.price)} {item.product.currency}
                    </td>
                    <td className="py-2 px-4 text-center">{item.quantity}</td>
                    <td className="py-2 px-4 text-center">{item.product_option.name}</td>
                    <td className="py-2 px-4 text-right">
                      {formatNumberWithCommas(item.product_option.price * item.quantity)} {item.product.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="total-price w-full mt-4">
            <h4 className="w-full">Total Price: {formatNumberWithCommas(totalAmount)}</h4>
          </div>
        </div>
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[--secondary-background-color] to-[--tertiary-background-color] p-6 mr-6">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6 transition-all duration-300 transform hover:scale-[1.02]">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-8">Checkout Form</h2>

            <form className="space-y-6" noValidate onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* Name Field */}
                <InputField
                  id="name"
                  label="Name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                />

                {/* Email Field */}
                <InputField
                  id="email"
                  label="Email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  list="email-suggestions"
                />
                <datalist id="email-suggestions">
                  {emailDomains.map((domain) => (
                    <option key={domain} value={`${form.email.split("@")[0]}${domain}`} />
                  ))}
                </datalist>

                {/* Phone Field */}
                <InputField
                  id="phone"
                  label="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  placeholder="123-456-7890"
                />

                {/* Shipping Address Field */}
                <InputField
                  id="shipping_address"
                  label="Shipping Address"
                  value={form.shipping_address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.shipping_address}
                />

                {/* Note Field */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                    Note
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none resize-none"
                    aria-label="Note"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div >
  );
};

const InputField = ({ id, label, value, onChange, onBlur, error, list = null, placeholder = "" }) => (
  <div className="space-y-2 min-w-[300px]">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      list={list}
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-lg border ${error ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none`}
      aria-label={label}
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="text-red-500 text-sm mt-1" role="alert">
        {error}
      </p>
    )}
  </div>
);

export default OrderInfoConfirmationPage;
