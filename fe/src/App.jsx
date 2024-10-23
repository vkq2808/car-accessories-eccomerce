import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

// import Login from './pages/Login';
// import Regist from './pages/Regist';
import LoginRoute from './router/loginRoute.jsx';
import Loading from './components/common/alert/Loading.jsx'
import Alert from './components/common/alert/Alert';
import Footer from './components/common/footer/Footer.jsx';

// import SocketClient from './SocketClient'
import { getUserInfo } from './redux/actions/authActions'
import HomeRoute from './router/homeRoute.jsx';
import ProductRoute from './router/productRoute.jsx';
import { getCategories } from './redux/actions/categoryActions.js';
// import { getCodeExerCises, getQueueCodeExercises } from './redux/action/codeExerciseAction'

function App() {

    const auth = useSelector(state => state.auth);
    const cart = useSelector(state => state.cart);
    const following = useSelector(state => state.product.following);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch, auth]);

    useEffect(() => {
        if (!auth.token) {
            localStorage.setItem('following_items', JSON.stringify(following));
            localStorage.setItem('cart_items', JSON.stringify(cart.items));
            return;
        }
    }, [cart, following]);

    if (isLoading) {
        return <Loading />;
    }


    return (
        <Router>
            {/* <SocketClient>*/}
            <Alert />
            <div className='main w-full flex flex-col items-center justify-center'>
                <Routes>
                    <Route path='/auth/*' element={<LoginRoute />} />
                    <Route path='/product/*' element={<ProductRoute />} />
                    <Route path='/*' element={<HomeRoute />} />
                </Routes>
                <Footer />
            </div>
            {/* </SocketClient> */}
        </Router>
    );
}

export default App;