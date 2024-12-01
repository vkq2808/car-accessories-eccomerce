import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import Alert from './components/common/alert/Alert';
import Dialog, { SyncCartAndFollowingTemplate } from './components/common/alert/Dialog';

// import SocketClient from './SocketClient'
import { HomeRoute, CategoryRoute, LoginRoute, ProductRoute, ShopRoute, AdminRoute } from './router';
import { GLOBALTYPES } from './redux/actions/globalTypes.js';
import { getUserInfo } from './redux/actions/authActions.js';
import { getDataAPI } from './utils/fetchData.js';
import { ServerClosed } from './pages';

function App() {

    const auth = useSelector(state => state.auth);
    const settings = useSelector((state) => state.settings);
    const dispatch = useDispatch();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
        localStorage.setItem('theme', settings.theme);
    }, [settings.theme]);

    useEffect(() => {
        let intervalId;

        if (settings.serverError) {
            const checkServerStatus = async () => {
                try {
                    const res = await getDataAPI('auth/public-key');
                    if (res.data?.length > 0) {
                        dispatch({ type: GLOBALTYPES.SERVER_ERROR, payload: false });
                    }
                } catch (err) {
                    console.log(err);
                }
            };

            checkServerStatus();
            intervalId = setInterval(checkServerStatus, 10000);
        }

        return () => clearInterval(intervalId);
    }, [dispatch, settings.serverError]);

    useEffect(() => {
        if (auth.token) {
            let cart_items = JSON.parse(localStorage.getItem('cart') || {}).cart_items || [];
            let following_items = JSON.parse(localStorage.getItem('following_items') || '[]');
            console.log(cart_items, following_items);
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
        if (auth.token)
            dispatch(getUserInfo());
        else
            dispatch({ type: GLOBALTYPES.AUTH, payload: { token: localStorage.getItem("access_token") } });
    }, [dispatch, auth.token]);


    return (
        <Router>
            {/* <SocketClient>*/}
            <Dialog />
            <Alert />
            <div className='main w-full min-h-screen flex flex-col justify-start items-stretch bg-[--primary-background-color] text-[--primary-text-color]'>
                {(!settings.serverError && <Routes>
                    <Route path='/auth/*' element={<LoginRoute />} />
                    <Route path='/product/*' element={<ProductRoute />} />
                    <Route path='/category/*' element={<CategoryRoute />} />
                    <Route path='/cart/*' element={<ShopRoute />} />
                    <Route path='/admin/*' element={<AdminRoute />} />
                    <Route path='/*' element={<HomeRoute />} />
                </Routes>)
                }{settings.serverError &&
                    <Routes >
                        < Route path='/*' element={<ServerClosed />} />
                    </Routes>
                }
            </div>
            {/* </SocketClient> */}
        </Router >
    );
}

export default App;