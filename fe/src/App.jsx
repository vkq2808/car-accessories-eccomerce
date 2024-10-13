import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

// import Login from './pages/Login';
// import Regist from './pages/Regist';
import LoginRoute from './router/loginRoute.jsx';
import Loading from './components/common/alert/Loading.jsx'
import Alert from './components/common/alert/Alert';
import Footer from './components/common/footer/Footer.jsx';

// import SocketClient from './SocketClient'
import { getUserInfo } from './redux/action/authAction'
import HomeRoute from './router/homeRoute.jsx';
import ProductRoute from './router/productRoute.jsx';
// import { getCodeExerCises, getQueueCodeExercises } from './redux/action/codeExerciseAction'

function App() {

    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserInfo()).then(() => {
            setIsLoading(false)
        })
    }, [dispatch])



    if (isLoading) {
        return <Loading />;
    }


    return (
        <Router>
            {/* <SocketClient>*/}
            <Alert />
            <div className='main'>
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