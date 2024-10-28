import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { CART_ACTION_TYPES, getCart, updateCart } from '../../../../redux/actions/cartActions';
import { formatNumberWithCommas } from '../../../../utils/stringUtils';
import { useNavigate } from 'react-router-dom';
import IconButton from '../../button/IconButton';


const Cart = () => {
    const cart = useSelector(state => state.cart);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [previewEnabled, setPreviewEnabled] = useState(Array(cart.items?.length).fill(false));

    useEffect(() => {
        if (auth.token) {
            dispatch(getCart(auth.token));
        }
    }, [dispatch, auth]);

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
        let updateCartItems = cart.items.filter((item, i) => i !== index);

        if (auth.token) {
            dispatch(updateCart({ token: auth.token, cart_items: updateCartItems }));
        } else {
            dispatch({ type: CART_ACTION_TYPES.UPDATE_CART_ITEMS, payload: updateCartItems });
        }
    }


    return (
        <div className="cart-container relative inline-flex">
            <IconButton
                iconClassName="fas fa-shopping-cart"
                onClick={toggleCart}
                className={`${isOpen ? 'text-[#002fff]' : ''}`}
                status={cart.items?.length > 0 ? { count: cart.items?.length } : null} />
            {isOpen && (
                <div style={{ border: "1px solid #ccc", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                    className="cart-dropdown absolute top-10 right-[-342px] md:right-0 bg-white p-[10px] w-[100vw] max-w-[768px]">
                    <div className='flex justify-between'>
                        <h5 className='text-[#333]'>Giỏ hàng</h5>
                        <div className='hover:text-blue-400 cursor-pointer'
                            onClick={() => nav('/cart/detail')}
                        >
                            Xem chi tiết
                        </div>
                    </div>
                    {cart.items?.length === 0 ? (
                        <div className="flex items-center justify-center h-32 w-full text-lg">
                            <p>Giỏ hàng của bạn trống rỗng</p>
                        </div>
                    ) : (
                        <table style={{ listStyleType: 'none', padding: 0 }}>
                            <thead>
                                <tr>
                                    <td className="pl-8 text-center">Ảnh</td>
                                    <td className="pl-8 text-center">Tên sản phẩm/ dịch vụ</td>
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
