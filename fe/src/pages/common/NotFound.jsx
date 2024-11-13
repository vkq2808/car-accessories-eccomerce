import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const NotFound = () => {
  const [timer, setTimer] = useState(5); // Thời gian chờ
  const [redirecting, setRedirecting] = useState(true); // Điều kiện cho việc redirect
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!redirecting) return;

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(countdown);
          setRedirecting(false);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Thêm một setTimeout để timeout trong trường hợp cần dừng ngay sau một thời gian nhất định (5 giây)
    const timeout = setTimeout(() => {
      if (redirecting) {
        clearInterval(countdown);
        setRedirecting(false);
        navigate('/');
      }
    }, 5000); // Timeout sau 5 giây

    return () => {
      clearInterval(countdown);
      clearTimeout(timeout);
    };
  }, [redirecting, dispatch, navigate]);

  return (
    <div className="flex items-center h-[calc(100vh-50px)] justify-center w-full text-center">
      <div className="max-w-lg w-full flex flex-col items-center justify-center rounded-lg shadow-lg shadow-[--tertiary-background-color] p-8">
        <img
          src="https://via.placeholder.com/150"
          alt="Not Found"
          className="mx-auto mb-6 w-24 h-24"
        />
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-lg mb-6">Oops! Trang bạn tìm không tồn tại.</p>
        <p className="mb-4">Chuyển hướng trong {timer} giây...</p> {/* Hiển thị countdown */}
        <Link
          to="/"
          className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
        >
          Quay lại Trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
