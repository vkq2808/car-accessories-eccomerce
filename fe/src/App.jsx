import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import Alert from './components/common/alert/Alert';
import Dialog, { SyncCartAndFollowingTemplate } from './components/common/alert/Dialog';
import Footer from './components/common/footer/Footer.jsx';

// import SocketClient from './SocketClient'
import { HomeRoute, CategoryRoute, LoginRoute, ProductRoute, ShopRoute } from './router';
import { PRODUCT_ACTION_TYPES } from './redux/actions/productActions.js';
import { CART_ACTION_TYPES } from './redux/actions/cartActions.js';
import { GLOBALTYPES } from './redux/actions/globalTypes.js';
import { getUserInfo } from './redux/actions/authActions.js';

function App() {

    const auth = useSelector(state => state.auth);
    const cart = useSelector(state => state.cart);
    const theme = useSelector((state) => state.theme.theme);
    const followings = useSelector(state => state.product.following);
    const dispatch = useDispatch();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        if (auth.token) {
            let cart_items = JSON.parse(localStorage.getItem('cart_items') || '[]');
            let following_items = JSON.parse(localStorage.getItem('following_items') || '[]');
            if (cart_items?.length > 0 || following_items?.length > 0) {
                dispatch({
                    type: GLOBALTYPES.DIALOG, payload: {
                        title: 'Thông báo',
                        children: SyncCartAndFollowingTemplate(cart_items, following_items, auth.token, dispatch),
                        onClose: () => {
                            localStorage.removeItem('cart_items');
                            localStorage.removeItem('following_items');
                            dispatch({ type: GLOBALTYPES.DIALOG, payload: null });
                        }
                    }
                })
            }
        }
    }, [auth, dispatch]);

    useEffect(() => {
        if (!followings) {
            dispatch({ type: PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS, payload: [] });
            localStorage.setItem('following_items', JSON.stringify([]));
        }
        else {
            localStorage.setItem('following_items', JSON.stringify(followings));
        }
        if (!cart.items) {
            dispatch({ type: CART_ACTION_TYPES.CLEAR_CART });
            localStorage.setItem('cart_items', JSON.stringify([]));
        } else {
            localStorage.setItem('cart_items', JSON.stringify(cart.items));
        }
    }, [cart, followings, dispatch]);

    useEffect(() => {
        dispatch(getUserInfo());
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