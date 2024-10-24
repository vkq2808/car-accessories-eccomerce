import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

// import Login from './pages/Login';
// import Regist from './pages/Regist';
import Loading from './components/common/alert/Loading.jsx'
import Alert from './components/common/alert/Alert';
import Dialog from './components/common/alert/Dialog';
import Footer from './components/common/footer/Footer.jsx';

// import SocketClient from './SocketClient'
import { getUserInfo, syncCartAndFollowing } from './redux/actions/authActions'
import { HomeRoute, CategoryRoute, LoginRoute, ProductRoute } from './router';
import { getCategories } from './redux/actions/categoryActions.js';
import { getProducts, PRODUCT_ACTION_TYPES } from './redux/actions/productActions.js';
import { CART_ACTION_TYPES } from './redux/actions/cartActions.js';
import { GLOBALTYPES } from './redux/actions/globalTypes.js';
import { getDataAPI } from './utils/fetchData.js';
// import { getCodeExerCises, getQueueCodeExercises } from './redux/action/codeExerciseAction'

function App() {

    const auth = useSelector(state => state.auth);
    const product = useSelector(state => state.product);
    const cart = useSelector(state => state.cart);
    const followings = useSelector(state => state.product.following);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    let cart_items;
    let following_items;

    if (!auth.token) {
        const firstLogin = localStorage.getItem('firstLogin');
        if (!firstLogin) {
            dispatch(getUserInfo());
        }
    } else {
        cart_items = JSON.parse(localStorage.getItem('cart_items'));
        following_items = JSON.parse(localStorage.getItem('following_items'));
    }

    useEffect(() => {
        if (cart_items?.length > 0 || following_items?.length > 0) {
            dispatch({
                type: GLOBALTYPES.DIALOG, payload: {
                    title: 'Thông báo',
                    children: (
                        <div className='flex justify-center flex-col'>
                            <div className='mb-2'>'Bạn có muốn khôi phục giỏ hàng và sản phẩm theo dõi không?'</div>
                            <div className='flex justify-between'>
                                <button className='btn btn-primary' onClick={() => {
                                    dispatch(syncCartAndFollowing(cart_items, following_items, auth.token));
                                    localStorage.removeItem('cart_items');
                                    localStorage.removeItem('following_items');
                                    dispatch({ type: GLOBALTYPES.DIALOG, payload: null })
                                }}>Có</button>
                                <button className='btn btn-danger' onClick={() => {
                                    localStorage.removeItem('cart_items');
                                    localStorage.removeItem('following_items');
                                    dispatch({ type: GLOBALTYPES.DIALOG, payload: null })
                                }}>Không</button>
                            </div>
                        </div>
                    ),
                    onClose: () => {
                        localStorage.removeItem('cart_items');
                        localStorage.removeItem('following_items');
                        dispatch({ type: GLOBALTYPES.DIALOG, payload: null })
                    }
                }
            })
        }
    }, [cart_items, following_items, dispatch, auth.token])

    useEffect(() => {
        if (!auth.token) {
            if (!localStorage.getItem('cart_items')) {
                dispatch({ type: CART_ACTION_TYPES.GET_CART_ITEMS_FROM_STORAGE, payload: JSON.parse(localStorage.getItem('cart_items')) });
            }
            if (!localStorage.getItem('following_items')) {
                dispatch({ type: PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS_FROM_STORAGE, payload: JSON.parse(localStorage.getItem('following_items')) });
            }
        }
        setIsLoading(false);
    }, [dispatch, auth.token]);

    useEffect(() => {
        if (!auth.token) {
            // Lưu dữ liệu giỏ hàng và sản phẩm theo dõi vào localStorage
            localStorage.setItem('following_items', JSON.stringify(followings));
            localStorage.setItem('cart_items', JSON.stringify(cart.items));
            return;
        }
    }, [cart, followings, auth]);

    useEffect(() => {
        if (cart.items && followings && product.list) {
            let updatedCartItems = [];
            Array.from(cart.items).forEach(item => {
                const productDetail = getDataAPI(`product/detail/${item.product.id}`)
                    .then(res => {
                        if (res.status === 200) {
                            return res.data.product;
                        }
                    })
                    .catch(err => console.log(err));
                updatedCartItems.push({ ...item, product: productDetail });
            });

            let updatedFollowingItems = [];
            Array.from(followings).forEach(item => {
                const productDetail = getDataAPI(`product/${item.product.id}`)
                    .then(res => {
                        if (res.status === 200) {
                            return res.data.product;
                        }
                    })
                    .catch(err => console.log(err));
                updatedFollowingItems.push({ ...item, product: productDetail });
            });

            // Chỉ dispatch nếu có sự thay đổi
            if (JSON.stringify(updatedCartItems) !== JSON.stringify(cart.items)) {
                dispatch({ type: CART_ACTION_TYPES.UPDATE_CART_ITEMS, payload: updatedCartItems });
            }

            if (JSON.stringify(updatedFollowingItems) !== JSON.stringify(followings)) {
                dispatch({ type: PRODUCT_ACTION_TYPES.UPDATE_FOLLOWING_PRODUCTS, payload: updatedFollowingItems });
            }
        }
    }, [dispatch, product.list, cart.items, followings]);


    useEffect(() => {
        dispatch(getCategories());
        dispatch(getProducts());
    }, [dispatch]);

    if (isLoading) {
        return <Loading />;
    }


    return (
        <Router>
            {/* <SocketClient>*/}
            <Dialog />
            <Alert />
            <div className='main w-full flex flex-col items-center justify-center'>
                <Routes>
                    <Route path='/auth/*' element={<LoginRoute />} />
                    <Route path='/product/*' element={<ProductRoute />} />
                    <Route path='/category/*' element={<CategoryRoute />} />
                    <Route path='/*' element={<HomeRoute />} />
                </Routes>
                <Footer />
            </div>
            {/* </SocketClient> */}
        </Router>
    );
}

export default App;