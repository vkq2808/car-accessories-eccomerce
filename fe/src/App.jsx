import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

// import Login from './pages/Login';
// import Regist from './pages/Regist';
import Home from './pages/home/Home';
import LoginRoute from './router/loginRoute';
import Loading from './components/common/alert/Loading.jsx'
import Alert from './components/common/alert/Alert';
import Headroom from 'react-headroom';
import Header from './components/common/header/Header.jsx';
import CommonSideBar from './components/common/sideBar/CommonSideBar.jsx';
import Footer from './components/common/footer/Footer.jsx';

// import SocketClient from './SocketClient'
import { getUserInfo } from './redux/action/authAction'
import HomeRoute from './router/homeRoute.js';
// import { getCodeExerCises, getQueueCodeExercises } from './redux/action/codeExerciseAction'

function App() {

    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const auth = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(getUserInfo()).then(() => {
            setIsLoading(false)
            console.log(auth)
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
                <div
                    onClick={() => setIsSideBarOpen(false)}
                    className={`BodyCover flex flex-row ${isSideBarOpen ? '' : 'hidden'}`}>
                </div>
                <div className={`SideBar pt-5 flex flex-col ${isSideBarOpen ? '' : 'hidden'}`}>
                    <CommonSideBar setIsSideBarOpen={setIsSideBarOpen} />
                </div>
                <Headroom className="Headroom w-full z-[101]" disable={isSideBarOpen} >
                    <Header setIsSideBarOpen={setIsSideBarOpen} />
                </Headroom>

                <Routes>
                    <Route path='/auth/*' element={<LoginRoute />} />
                    <Route exact path='/' Component={Home} />
                    <Route path='/*' element={<HomeRoute />} />
                    <Route path='/*' element={<h1>404 Not Found</h1>} />
                </Routes>

                <Footer />
            </div>
            {/* </SocketClient> */}
        </Router>
    );
}

export default App;