import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import Alert from './components/common/alert/Alert';
import Dialog, { SyncCartAndFollowingTemplate } from './components/common/alert/Dialog';
import Footer from './components/common/footer/Footer.jsx';

// import SocketClient from './SocketClient'
import { HomeRoute, CategoryRoute, LoginRoute, ProductRoute, ShopRoute, AdminRoute } from './router';
import { GLOBALTYPES } from './redux/actions/globalTypes.js';
import { getUserInfo } from './redux/actions/authActions.js';

function App() {

    const auth = useSelector(state => state.auth);
    const theme = useSelector((state) => state.settings.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
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
                    <Route path='/admin/*' element={<AdminRoute />} />
                    <Route path='/*' element={<HomeRoute />} />
                </Routes>
                <Footer />
            </div>
            {/* </SocketClient> */}
        </Router>
    );
}

export default App;