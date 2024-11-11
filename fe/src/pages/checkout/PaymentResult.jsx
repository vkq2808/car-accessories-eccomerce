import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postDataAPI } from '../../utils/fetchData';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { payment_method_codes } from '../../constants/constants';

const PaymentResultPage = ({ method_code }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);
  const [redirecting, setRedirecting] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    switch (method_code) {
      case payment_method_codes.MOMO:
        setResult("Thanh toán qua Momo");
        setRedirecting(true);
        break;
      case payment_method_codes.VN_PAY:
        const queryParams = new URLSearchParams(location.search);
        const paramsObject = Object.fromEntries(queryParams.entries());

        postDataAPI(`order/confirm-payment/vnpay`, paramsObject)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: "Thanh toán thành công" });
              setResult("Thanh toán thành công qua VNPay");
              setRedirecting(true);
            } else {
              dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg });
              setResult("Thanh toán thất bại");
              setRedirecting(true);
            }
          })
          .catch((err) => {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.msg });
            setResult("Thanh toán thất bại");
            setRedirecting(true);
          });
        break;
      case payment_method_codes.COD:
        setResult("Thanh toán khi nhận hàng");
        setRedirecting(true);
        break;
      default:
        setResult("Phương thức thanh toán không hợp lệ" + method_code);
        setRedirecting(true);
        break;
    }
  }, [method_code, location.search, dispatch]);

  useEffect(() => {
    if (redirecting) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
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
    }
  }, [redirecting, dispatch, navigate]);



  return (
    <div className="min-h-[70vh] w-full bg-gradient-to-br from-[--tertiary-background-color] to-[--secondary-background-color] py-12 px-4 sm:px-6 lg:px-8">
      {redirecting ? (
        <div className="flex flex-col w-full h-[60dvh] items-center justify-center text-[--primary-text-color]">
          <h1>{result}</h1>
          <h4>Bạn sẽ được đưa về trang chủ trong {timer} giây nữa</h4>
        </div>
      ) : (
        <h1>Payment Result Page</h1>
      )}
    </div>
  );
}

export default PaymentResultPage;