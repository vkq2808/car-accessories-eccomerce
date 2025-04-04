import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../../../redux/actions/authActions';
import Loading from '../../../components/common/alert/Loading';
import { useNavigate } from 'react-router-dom';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const redirecting = useSelector(state => state.auth.redirecting);
    const [timer, setTimer] = useState(5);
    const [isLoading, setIsLoading] = useState(true); // Đặt mặc định là true
    const [result, setResult] = useState('');

    const dispatch = useDispatch();

    const path = window.location.pathname;
    const [token] = useState(path.split('/').reverse()[0]);

    useEffect(() => {
        // Chờ kết quả từ verifyEmail
        dispatch(verifyEmail({ token, setIsLoading, setResult }));
    }, [dispatch, token]);

    useEffect(() => {
        if (!redirecting) return;

        const countdown = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    clearInterval(countdown);
                    dispatch({ type: GLOBALTYPES.REDIRECTING, payload: false });
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [redirecting, dispatch, navigate]);

    // Kiểm tra điều kiện render khi đang tải hoặc xác thực email
    if (isLoading) {
        return <Loading />;
    }

    // Kiểm tra khi đang chuyển hướng
    if (redirecting) {
        return (
            <div className='flex flex-col w-full h-[60dvh] items-center justify-center'>
                <h1>{result}</h1>
                <h4>Bạn sẽ được đưa về trang chủ trong {timer} giây nữa </h4>
            </div>
        );
    }

    return (
        <div className='flex flex-col w-full h-auto items-center text-[#212529] min-h-[70vh] pt-10 bg-[--primary-background-color]'>
            <div className="body-box flex flex-row w-full justify-between items-center px-20">
                <div className="w-1/2 h-auto">
                    <div className="flex flex-col items-start">
                        {!isLoading && !redirecting &&
                            <a href="/auth/login" className="text-2xl text-blue-500">Go to login page</a>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
};

export default VerifyEmail;
