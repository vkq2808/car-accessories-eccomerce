import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCart, removeCartItem, retrieveCartItem, updateCartItem } from '../../../../redux/actions/cartActions';
import { formatNumberWithCommas } from '../../../../utils/stringUtils';
import { useNavigate } from 'react-router-dom';
import IconButton from '../../button/IconButton';
import { getEmptyOrder, ORDER_ACTION_TYPES } from '../../../../redux/actions/orderActions';


const Cart = () => {
    const cart = useSelector(state => state.cart);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [previewEnabled, setPreviewEnabled] = useState(Array(cart.cart_items?.length).fill(false));

    useEffect(() => {
        if (auth.token && !cart.id) {
            dispatch(getCart(auth.token));
        }
    }, [dispatch, auth, cart]);

    useEffect(() => {
        setPreviewEnabled(Array(cart.cart_items?.length).fill(false));
    }, [cart]);

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigate = (link) => {
        setIsOpen(false);
        nav(link);
    }

    const handleIncreaseQuantity = (index) => {
        let cartItem = cart.cart_items[index];
        let quantity = cartItem.quantity + 1;
        dispatch(updateCartItem({ token: auth.token, cart_item: cartItem, quantity, product_option: cartItem.product_option }));
    }

    const handleDecreaseQuantity = (index) => {
        let cartItem = cart.cart_items[index];
        let quantity = cartItem.quantity - 1;

        if (quantity === 0) {
            handleDeleteItem(index);
        } else {
            dispatch(updateCartItem({ token: auth.token, cart_item: cartItem, quantity, product_option: cartItem.product_option }));
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
    const handleCheckOut = () => {
        setIsOpen(false);
        dispatch(getEmptyOrder(auth.token));
        dispatch({ type: ORDER_ACTION_TYPES.CONVERT_FROM_CART, payload: { cart: cart } });
        nav('/cart/checkout/confirm-information');
    }

    useEffect(() => {
        let savingCart = { ...cart, deleted_items: [] };
        localStorage.setItem('cart', JSON.stringify(savingCart));
    }, [cart]);

    const handleChangeProductOption = (e, index) => {
        let cartItem = cart.cart_items[index];
        let product_option_id = e.target.value;
        let new_product_option = cartItem.product.product_options.find(option => option.id === parseInt(product_option_id));
        dispatch(updateCartItem({ token: auth.token, cart_item: cartItem, quantity: cartItem.quantity, product_option: cartItem.product_option, new_product_option: new_product_option }));
    }

    return (
        <div className="cart-container relative inline-flex">
            <IconButton
                iconClassName="fas fa-shopping-cart select-none"
                onClick={toggleCart}
                className={`select-none items-center justify-center ${isOpen ? 'text-[#002fff]' : ''}`}
                status={cart.cart_items?.length > 0 ? { count: cart.cart_items?.length } : null} />
            {isOpen && (
                <div style={{ border: "1px solid #ccc", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                    className="cart-dropdown absolute top-10 right-[-342px] md:right-0 bg-[--primary-background-color] text-[--primary-text-color] p-[10px] w-[100vw] max-w-[888px] max-h-[600px] overflow-y-auto">
                    <div className='flex justify-between items-center'>
                        <h2>Giỏ hàng</h2>
                        <div className='flex items-center'>
                            <div className='hover:text-blue-400 cursor-pointer'
                                onClick={() => handleCheckOut()}
                            >Thanh toán
                            </div>
                            <span className='mx-4'>|</span>
                            <div className='hover:text-blue-400 cursor-pointer'
                                onClick={() => handleNavigate('/cart/detail')}
                            >
                                Xem chi tiết
                            </div>
                        </div>
                    </div>
                    {cart.cart_items?.length === 0 && cart.deleted_items?.length === 0 ? (
                        <div className="flex items-center justify-center h-32 w-full text-lg">
                            <p>Giỏ hàng của bạn trống rỗng</p>
                        </div>
                    ) : (
                        <table className='' style={{ listStyleType: 'none', padding: 0 }}>
                            <thead>
                                <tr>
                                    <td className="pl-8 text-center">Ảnh</td>
                                    <td className="pl-8 text-center">Tên sản phẩm/ dịch vụ</td>
                                    <td className="pl-8 text-center">Số lượng</td>
                                    <td className="pl-8 text-center">Tùy chọn</td>
                                    <td className="pl-8 text-center">Tổng tiền</td>
                                    <td className="pl-8 text-center"></td>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.cart_items?.map((item, index) => (
                                    <tr key={item.product.id + '-' + item.product_option.id} style={{ margin: "5px 0" }} className='select-none'>

                                        <td className="pl-8 text-center "
                                            onClick={() => handleNavigate(item.product.path)}>
                                            <img className='w-[50px] h-[50px] cursor-pointer'
                                                onMouseEnter={() => { setPreviewEnabled(prev => prev.map((_, i) => i === index ? true : false)) }}
                                                onMouseLeave={() => { setPreviewEnabled(prev => prev.map((_, i) => i === index ? false : false)) }}
                                                src={item.product.image_url} alt="Ảnh" />
                                            <img className={`w-[500px] absolute top-[100%] left-0 ${previewEnabled[index] ? 'block' : 'hidden'}`}
                                                src={item.product.image_url} alt='Ảnh' />

                                        </td>
                                        <td className="pl-8 text-center cursor-pointer"
                                            onClick={() => { handleNavigate('/product/' + item.product.path); setIsOpen(false) }}>
                                            {item.product.name}
                                        </td>
                                        <td className="pl-8 text-center select-none">
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
                                        <td className="pl-8 text-center">
                                            <select name="cart_product_option" id="cart_product_option" value={item.product_option.id}
                                                onChange={(e) => handleChangeProductOption(e, index)}
                                            >
                                                {item.product.product_options.map((option) => {
                                                    return (
                                                        <option key={'cart-' + option.id} value={option.id}>
                                                            {option.name} - {formatNumberWithCommas(option.price)} {item.product.currency}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </td>
                                        <td className="pl-8 text-center">
                                            {formatNumberWithCommas(item.product_option.price * item.quantity)} {item.product.currency}
                                        </td>
                                        <td className="pl-8 text-center">
                                            <button className="text-[12px] bg-red-200 px-2 py-1 rounded-md"
                                                onClick={() => handleDeleteItem(index)}
                                            >
                                                <i className="fas fa-trash-alt" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {cart.deleted_items?.map((item, index) => (
                                    <tr key={item.product.id + '-' + item.product_option.id} className='px-[5px]'>

                                        <td className="pl-8 text-center opacity-35"
                                            onClick={() => handleNavigate(item.product.path)}>
                                            <img className='w-[50px] h-[50px] cursor-pointer'
                                                src={item.product.image_url} alt="Ảnh" />
                                        </td>
                                        <td className="pl-8 text-center cursor-pointer opacity-35"
                                            onClick={() => handleNavigate('/product/' + item.product.path)} >
                                            {item.product.name}
                                        </td>
                                        <td className="pl-8 text-center select-none opacity-35">
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
                                        <td className="pl-8 text-center">
                                            <span className='text-sm' > {item.product_option.name} - {item.product_option.price}</span>
                                        </td>
                                        <td className="pl-8 text-center opacity-35">
                                            {formatNumberWithCommas(item.product.price * item.quantity)} {item.product.currency}
                                        </td>
                                        <td className="pl-8 text-center">
                                            <IconButton
                                                onClick={() => handleRetreiveItem(index)}
                                                className='items-center justify-start'
                                                iconClassName='fa-solid fa-undo'
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )
            }
        </div >
    );
};

export default Cart;
