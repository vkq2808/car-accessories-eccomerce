import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postDataAPI } from "../../../utils/fetchData";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";
import { useNavigate } from "react-router-dom";
import { payment_method_codes, payment_methods } from "../../../constants/constants";
import { finishInformation } from "../../../redux/actions/orderActions";

const PaymentMethodSelector = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [bankCode, setBankCode] = useState(null);
  const order = useSelector((state) => state.order);
  const cart = useSelector((state) => state.cart);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const navigate = useNavigate();

  const [redirecting, setRedirecting] = useState(false);
  const [timer, setTimer] = useState(5);
  const [result, setResult] = useState("");

  const paymentMethods = payment_methods;

  const handleNext = () => {
    postDataAPI("order", { order_items: order.order_items, info: order.info, payment_method: selectedMethod?.id, bank_code: bankCode?.code || null, total_amount: order.total_amount }, auth.token)
      .then((res) => {
        dispatch(finishInformation({ is_cart: order.is_cart, cart_id: cart.id }));
        switch (selectedMethod.id) {
          case payment_method_codes.MOMO:
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: "Momo payment is not supported yet" });
            break;
          case payment_method_codes.VN_PAY:
            postDataAPI("order/create-payment-url/vnpay", { order_id: res.data.order.id, amount: order.total_amount, bankCode: bankCode.code, locale: 'vn' }, auth.token)
              .then((res) => {
                window.open(res.data.paymentUrl, "_self");
              })
              .catch((err) => {
                dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
              })
              .finally(() => {
                setIsProcessing(false);
              });
            break;
          case payment_method_codes.COD:
            setResult("Đơn hàng của bạn đã được chúng tôi xem xét, vui lòng kiểm tra email để biết thêm chi tiết");
            setRedirecting(true);
            break;
          default:
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: "Invalid payment method" });
            break;
        }
        setIsProcessing(false);
      })
      .catch((err) => {
        console.log(err)
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
        setIsProcessing(false);
        return;
      });
  }

  useEffect(() => {
    if (!order.order_items || order.order_items.length === 0) {
      setResult("Your order is empty");
      setRedirecting(true);
    } else {
      console.log(order);
    }
  }, [order, navigate, dispatch]);

  const handlePaymentSelection = (methodId) => {
    setError("");
    setIsProcessing(true);
    const selected = paymentMethods.find((method) => method.id === methodId)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedMethod(selected);
    }, 300);
  };

  const handleBankSelection = (code) => {
    setBankCode(selectedMethod.banks.find((bank) => bank.code === code));
  };

  const handleSubmit = () => {
    if (!selectedMethod || (selectedMethod.id !== payment_method_codes.COD && !bankCode)) {
      setError("Please select a payment method");
      return;
    }
    setIsProcessing(true);
    setShowPaymentConfirmation(true);
  };

  useEffect(() => {
    if (redirecting) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setTimeout(() => {
              navigate("/");
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [redirecting, dispatch, navigate]);


  return (
    <div className="min-h-[70vh] max-w-3xl flex flex-col justify-center items-center mx-auto p-6">
      {redirecting ? (
        <div className="flex flex-col w-full h-[60dvh] items-center justify-center text-[--primary-text-color]">
          <h1>{result}</h1>
          <h4>Bạn sẽ được đưa về trang chủ trong {timer} giây nữa</h4>
        </div>
      ) : showPaymentConfirmation ? (
        <PaymentConfirmation method_code={selectedMethod.id} handleNext={handleNext} setShowPaymentConfirmation={setShowPaymentConfirmation} setSelectedMethod={setSelectedMethod} />
      ) : (<>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose Payment Method</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handlePaymentSelection(method.id)}
              className={`
              relative p-6 rounded-lg border-2 transition-all duration-300
              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${selectedMethod?.id === method.id
                  ? "border-blue-500 bg-blue-50 outline-none ring-2 ring-offset-2 ring-blue-500"
                  : "border-gray-200 hover:border-blue-300"}
            `}
              aria-label={`Select ${method.name} as payment method`}
              disabled={isProcessing}
            >
              <div className="flex flex-col items-center space-y-3">
                {method.icon}
                <span className="font-semibold text-gray-800">{method.name}</span>
                <span className="text-sm text-gray-500">{method.description}</span>
              </div>

              {selectedMethod?.id === method.id && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
        {(selectedMethod?.id === "vnpay" || selectedMethod?.id === "momo") && (
          <div className="mt-6">
            <label htmlFor="bank" className="block text-sm font-semibold text-gray-800">Select Bank</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {selectedMethod.banks?.map((bank) => (
                <button
                  key={bank.code}
                  onClick={() => handleBankSelection(bank.code)}
                  className={`
              relative p-6 rounded-lg border-2 transition-all duration-300
              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${bankCode?.code === bank.code
                      ? "border-blue-500 bg-blue-50 outline-none ring-2 ring-offset-2 ring-blue-500"
                      : "border-gray-200 hover:border-blue-300"}
            `}
                  aria-label={`Select ${bank.name} as payment bank`}
                  disabled={isProcessing}
                >
                  <div className="flex flex-col items-center space-y-3">
                    {bank.logo && <img src={bank.logo} alt={bank.name} className="w-12 h-12 object-contain" />}
                    <span className="font-semibold text-gray-800">{bank.name}</span>
                  </div>

                  {bankCode?.code === bank.code && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 text-center text-gray-600">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="ml-2">Processing...</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          disabled={isProcessing || !selectedMethod}
        >
          Proceed to Payment
        </button>
      </>)}
    </div>

  );
};

const PaymentConfirmation = ({ method_code, setShowPaymentConfirmation, handleNext, setSelectedMethod }) => {
  const [checked, setChecked] = useState(false);
  const Content = ({ method_code }) => {
    switch (method_code) {
      case payment_method_codes.VN_PAY:
        return (
          <div className="w-full">
            <h2 className="text-center w-full text-2xl font-bold mb-6 text-gray-800">VN Pay</h2>
            <p>You can not cancel the order if you choose this payment method</p>
          </div>
        );
      case payment_method_codes.MOMO:
        return (
          <div className="w-full">
            <h2 className="text-center w-full text-2xl font-bold mb-6 text-gray-800">Momo</h2>
          </div>
        );
      case payment_method_codes.COD:
        return (
          <div className="w-full">
            <h2 className="text-center w-full text-2xl font-bold mb-6 text-gray-800">COD</h2>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center">
      <div className="flex flex-col bg-[--primary-background-color] text-[--primary-text-color] p-4">
        <div className="content mb-4">
          <Content method_code={method_code} />
          <p className="text-gray-600">Please confirm your payment method</p>
        </div>
        <div className="flex">

          <input type="checkbox" value={checked} onChange={(e) => setChecked(!checked)} />
          <label className="ml-2">I confirm that I want to proceed with this payment method</label>
        </div>
        <div className="buttons flex">
          <div className="w-1/2 text-center">
            <button disabled={!checked} className="p-4 disabled:bg-gray-200 disabled:hover:bg-gray-300 bg-blue-500 hover:bg-blue-700 hover:scale-105 transition-all"
              onClick={handleNext}>
              Confirm
            </button>
          </div>
          <div className="w-1/2 text-center ">
            <button
              onClick={() => { setShowPaymentConfirmation(false); setSelectedMethod(null) }}
              className="p-4 bg-red-500 hover:bg-red-700 hover:scale-105 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodSelector;