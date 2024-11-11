import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconButton from "../../button/IconButton";
import { formatNumberWithCommas } from "../../../../utils/stringUtils";
import { getFollowingProducts, PRODUCT_ACTION_TYPES, unfollowProduct } from "../../../../redux/actions/productActions";


const Following = () => {
    const auth = useSelector(state => state.auth);
    const followings = useSelector(state => state.product.following);
    const dispatch = useDispatch();
    const nav = useNavigate();

    const [previewEnabled, setPreviewEnabled] = useState(Array(followings?.length).fill(false));
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (auth.token) {
            dispatch(getFollowingProducts(auth.token));
        }
    }, [dispatch, auth]);

    const toggleFollowing = () => {
        setIsOpen(!isOpen);
    }

    const handleDeleteItem = (index) => {
        if (auth.token) {
            dispatch(unfollowProduct({ token: auth.token, product: followings[index].product }));
        } else {
            dispatch({ type: PRODUCT_ACTION_TYPES.UNFOLLOW_PRODUCT, payload: { product: followings[index].product } });
        }
    }
    useEffect(() => {
        localStorage.setItem('following_items', JSON.stringify(followings));
    }, [followings]);

    return (
        <div className="cart-container relative inline-flex">
            <IconButton
                iconClassName="fas fa-heart"
                onClick={toggleFollowing}
                className={`items-center justify-center ${isOpen ? 'text-[#002fff]' : ''}`}
                status={followings?.length > 0 ? { count: followings?.length } : null} />
            {isOpen && (
                <div style={{ border: "1px solid #ccc", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                    className="cart-dropdown absolute top-10 right-[-342px] md:right-0 bg-white p-[10px] w-[100vw] max-w-[768px]">
                    <div className='flex justify-between'>
                        <h5 className="text-[#333]">Sản phẩm/ dịch vụ đang theo dõi</h5>
                        <div className='hover:text-blue-400 cursor-pointer'
                            onClick={() => nav('/user/following')}
                        >
                            Xem chi tiết
                        </div>
                    </div>
                    {(followings?.length === 0 || !followings) ? (
                        <div className="flex items-center justify-center h-32 w-full text-lg">
                            <p>Bạn chưa theo dõi sản phẩm nào</p>
                        </div>
                    ) : (
                        <table style={{ listStyleType: 'none', padding: 0 }}>
                            <thead>
                                <tr>
                                    <td className="pl-8 text-center">Ảnh</td>
                                    <td className="pl-8 text-center">Tên sản phẩm/ dịch vụ</td>
                                    <td className="pl-8 text-center">Đơn giá</td>
                                    <td className="pl-8 text-center"></td>
                                </tr>
                            </thead>
                            <tbody>
                                {followings?.map((item, index) => (
                                    <tr key={index} style={{ margin: "5px 0" }}>

                                        <td className="pl-8 text-center "
                                            onClick={() => nav(item.path)}>
                                            <img className='w-[50px] h-[50px] cursor-pointer'
                                                onMouseEnter={() => { setPreviewEnabled(prev => prev.map((_, i) => i === index ? true : false)) }}
                                                onMouseLeave={() => { setPreviewEnabled(prev => prev.map((_, i) => i === index ? false : false)) }}
                                                src={item.product.image_url} alt="Ảnh" />
                                            <img className={`w-[500px] absolute top-[100%] left-0 ${previewEnabled[index] ? 'block' : 'hidden'}`}
                                                src={item.product.image_url} alt='Ảnh' />

                                        </td>
                                        <td className="pl-8 text-center cursor-pointer"
                                            onClick={() => nav('/product/' + item.product.path)}>
                                            {item.product.name}
                                        </td>
                                        <td className="pl-8 text-center">
                                            {formatNumberWithCommas(item.product.price)} {item.product.currency}
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

export default Following;
