import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

import Alert from './components/common/alert/Alert';
import Dialog, { SyncCartAndFollowingTemplate } from './components/common/alert/Dialog';
import Footer from './components/common/footer/Footer.jsx';

// import SocketClient from './SocketClient'
import { HomeRoute, CategoryRoute, LoginRoute, ProductRoute, ShopRoute } from './router';
import { getCategories } from './redux/actions/categoryActions.js';
import { PRODUCT_ACTION_TYPES, SynCartAndFollowingProducts } from './redux/actions/productActions.js';
import { CART_ACTION_TYPES } from './redux/actions/cartActions.js';
import { GLOBALTYPES } from './redux/actions/globalTypes.js';

function App() {

    const auth = useSelector(state => state.auth);
    const cart = useSelector(state => state.cart);
    const followings = useSelector(state => state.product.following);
    const hassSynced = useRef(false);
    const dispatch = useDispatch();

    const cartItemsRef = useRef(null);
    const followingItemsRef = useRef(null);

    useEffect(() => {
        if (!auth.token) {
            cartItemsRef.current = JSON.parse(localStorage.getItem('cart_items'));
            followingItemsRef.current = JSON.parse(localStorage.getItem('following_items'));
        } else {
            if (cartItemsRef.current?.length > 0 || followingItemsRef.current?.length > 0) {
                dispatch({
                    type: GLOBALTYPES.DIALOG, payload: {
                        title: 'Thông báo',
                        children: SyncCartAndFollowingTemplate(cartItemsRef.current, followingItemsRef.current, auth.token),
                        onClose: () => {
                            localStorage.removeItem('cart_items');
                            localStorage.removeItem('following_items');
                            dispatch({ type: GLOBALTYPES.DIALOG, payload: null });
                        }
                    }
                })
            }
        }
    }, [auth.token, dispatch]);


    useEffect(() => {
        if (!hassSynced) {
            if (localStorage.getItem('cart_items')) {
                dispatch({ type: CART_ACTION_TYPES.GET_CART_ITEMS_FROM_STORAGE, payload: JSON.parse(localStorage.getItem('cart_items')) });
            }
            if (localStorage.getItem('following_items')) {
                dispatch({ type: PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS_FROM_STORAGE, payload: JSON.parse(localStorage.getItem('following_items')) });
            }

            dispatch(SynCartAndFollowingProducts({ cart_items: cart.items, followings }));
            hassSynced.current = true;
        }
    });



    useEffect(() => {
        if (!followings)
            dispatch({ type: PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS, payload: [] });
        localStorage.setItem('following_items', JSON.stringify(followings));
        if (!cart.items)
            dispatch({ type: CART_ACTION_TYPES.CLEAR_CART });
        localStorage.setItem('cart_items', JSON.stringify(cart.items));
    }, [cart, followings, dispatch]);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

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
                    <Route path='/cart/*' element={<ShopRoute />} />
                    <Route path='/*' element={<HomeRoute />} />
                </Routes>
                <Footer />
            </div>
            {/* </SocketClient> */}
        </Router>
    );
}

export default App;