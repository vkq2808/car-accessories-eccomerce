import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { addProductToCart, CART_ACTION_TYPES, getCart, updateCart } from '../../../../redux/actions/cartActions';
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

    useEffect(() => {
        setPreviewEnabled(Array(cart.items?.length).fill(false));
    }, [cart]);
    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

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

    const handleDeleteItem = (index) => {
        let updateCartItems = cart.items.filter((item, i) => i !== index);
        let updateDeletedItems = [...cart.deleted_items, cart.items[index]];

        if (auth.token) {
            dispatch(updateCart({ token: auth.token, cart_items: updateCartItems }));
            dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { deleted_items: updateDeletedItems } });
        } else {
            dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { items: updateCartItems, deleted_items: updateDeletedItems } });
        }
    }

    const handleRetreiveItem = (index) => {
        let updateCartItems = [...cart.items, cart.deleted_items[index]];
        let updateDeletedItems = cart.deleted_items.filter((item, i) => i !== index);

        if (auth.token) {
            dispatch(addProductToCart({ token: auth.token, product: cart.deleted_items[index].product, quantity: cart.deleted_items[index].quantity }));
            dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { deleted_items: updateDeletedItems } });
        } else {
            dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: { items: updateCartItems, deleted_items: updateDeletedItems } });
        }
    }


    return (
        <div className="cart-container relative inline-flex">
            <IconButton
                iconClassName="fas fa-shopping-cart select-none"
                onClick={toggleCart}
                className={`select-none items-center justify-center ${isOpen ? 'text-[#002fff]' : ''}`}
                status={cart.items?.length > 0 ? { count: cart.items?.length } : null} />
            {isOpen && (
                <div style={{ border: "1px solid #ccc", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                    className="cart-dropdown absolute top-10 right-[-342px] md:right-0 bg-white p-[10px] w-[100vw] max-w-[888px]">
                    <div className='flex justify-between'>
                        <h5 className='text-[#333]'>Giỏ hàng</h5>
                        <div className='hover:text-blue-400 cursor-pointer'
                            onClick={() => nav('/cart/detail')}
                        >
                            Xem chi tiết
                        </div>
                    </div>
                    {cart.items?.length === 0 && cart.deleted_items?.length === 0 ? (
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
                                    <tr key={item.product.id} style={{ margin: "5px 0" }} className='select-none'>

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
                                            onClick={() => { nav('/product/' + item.product.path); setIsOpen(false) }}>
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
                                {cart.deleted_items?.map((item, index) => (
                                    <tr key={item.product.id} className='px-[5px]'>

                                        <td className="pl-8 text-center opacity-35"
                                            onClick={() => nav(item.product.path)}>
                                            <img className='w-[50px] h-[50px] cursor-pointer'
                                                src={item.product.imageUrl} alt="Ảnh" />
                                        </td>
                                        <td className="pl-8 text-center cursor-pointer opacity-35"
                                            onClick={() => { nav('/product/' + item.product.path); setIsOpen(false) }}>
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
