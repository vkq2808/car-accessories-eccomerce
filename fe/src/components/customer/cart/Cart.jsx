import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCart, updateCart } from '../../../redux/actions/cartActions';
import { formatNumberWithCommas } from '../../../utils/stringProcess';
import { useNavigate } from 'react-router-dom';


const Cart = () => {
    const cart = useSelector(state => state.cart);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [previewEnabled, setPreviewEnabled] = useState(Array(cart.items.length).fill(false));

    useEffect(() => {
        if (auth?.token) {
            dispatch(getCart(auth?.token));
        } else {
            const savedItems = localStorage.getItem('cart_items');
            if (savedItems) {
                dispatch({
                    type: 'UPDATE_CART_ITEMS',
                    payload: JSON.parse(savedItems)
                });
            }
        }
    }, [dispatch, auth]);

    useEffect(() => {
        if (!auth?.token && cart.items.length > 0) {
            localStorage.setItem('cart_items', JSON.stringify(cart.items));
        }
    }, [cart.items, auth?.token]);

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const handleIncreaseQuantity = (index) => {
        if (cart.items[index].quantity < cart.items[index].product.quantity) {
            cart.items[index].quantity += 1;
            if (auth.token) {
                dispatch(updateCart({ token: auth.token, cart_items: cart.items }));
            }
        }
    }
    const handleDecreaseQuantity = (index) => {
        if (cart.items[index].quantity > 1) {
            cart.items[index].quantity -= 1;
            if (auth.token) {
                dispatch(updateCart({ token: auth.token, cart_items: cart.items }));
            }
        }
    }

    const handleDeleteItem = (index) => {
        cart.items.splice(index, 1);
        if (auth.token) {
            dispatch(updateCart({ token: auth.token, cart_items: cart.items }));
        }
    }

    return (
        <div className="cart-container relative inline-block">
            <div className="cart-icon fas fa-shopping-cart cursor-pointer text-[24px] select-none"
                onClick={toggleCart} onDoubleClick={() => { }}
            >
            </div>
            {isOpen && (
                <div style={{ border: "1px solid #ccc", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                    className="cart-dropdown absolute right-[-342px] md:right-0 bg-white p-[10px] w-[100vw] max-w-[768px]">
                    <div className='flex justify-between'>
                        <h3>Giỏ hàng</h3>
                        <div className='hover:text-blue-400 cursor-pointer'
                            onClick={() => nav('/cart')}
                        >
                            Xem chi tiết
                        </div>
                    </div>
                    {cart.items?.length === 0 ? (
                        <p>Giỏ hàng của bạn đang trống</p>
                    ) : (
                        <table style={{ listStyleType: 'none', padding: 0 }}>
                            <thead>
                                <tr>
                                    <td className="pl-8 text-center">Ảnh</td>
                                    <td className="pl-8 text-center">Tên sản phẩm</td>
                                    <td className="pl-8 text-center">Số lượng</td>
                                    <td className="pl-8 text-center">Tổng tiền</td>
                                    <td className="pl-8 text-center"></td>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.items?.map((item, index) => (
                                    <tr key={index} style={{ margin: "5px 0" }}>

                                        <td className="pl-8 text-center "
                                            onClick={() => nav(item.product.path)}>
                                            <img className='w-[50px] h-[50px] cursor-pointer'
                                                onMouseEnter={() => { setPreviewEnabled(prev => prev.map((_, i) => i === index ? true : false)) }}
                                                onMouseLeave={() => { setPreviewEnabled(prev => prev.map((_, i) => i === index ? false : false)) }}
                                                src={item.product.imageUrl} alt="Ảnh" />
                                            <img className={`w-[500px] absolute top-[100%] left-0 ${previewEnabled[index] ? 'block' : 'hidden'}`}
                                                src={item.product.imageUrl} alt='Ảnh' />

                                        </td>
                                        <td className="pl-8 text-center cursor-pointer"
                                            onClick={() => nav('/product/' + item.product.path)}>
                                            {item.product.name}
                                        </td>
                                        <td className="pl-8 text-center select-none">
                                            <button className="text-[12px] bg-gray-200 px-2 py-1 rounded-md"
                                                onClick={() => handleDecreaseQuantity(index)}
                                            >
                                                <i className="fas fa-minus" />
                                            </button>
                                            {item.quantity}
                                            <button className="text-[12px] bg-gray-200 px-2 py-1 rounded-md"
                                                onClick={() => handleIncreaseQuantity(index)}
                                            >
                                                <i className="fas fa-plus" />
                                            </button>
                                        </td>
                                        <td className="pl-8 text-center">
                                            {formatNumberWithCommas(item.product.price * item.quantity)} {item.product.currency}
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
