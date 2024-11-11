import { useEffect, useState } from "react";
import { BsEnvelope } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { requestResetPassword } from "../../redux/actions/authActions";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const commonDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@student.hcmute.edu.vn"];

const PasswordResetPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dispatch = useDispatch();
    const redirecting = useSelector((state) => state.auth.redirecting);
    const [timer, setTimer] = useState(5);
    const [result, setResult] = useState("");

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (value.includes("@")) {
            setError("");
            return;
        }

        const filtered = commonDomains.map((domain) => value + domain);
        setSuggestions(filtered);
        setShowSuggestions(true);

        if (!value) {
            setError("");
            setShowSuggestions(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            dispatch(requestResetPassword({ email }, setResult));
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setEmail(suggestion);
        setShowSuggestions(false);
    };

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
        <div className="min-h-[60vh] w-full flex items-center justify-center bg-gradient-to-br from-[--primary-background-color] to-[--tertiary-background-color] p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-gray-600">Enter your email to reset your password</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BsEnvelope className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                className={`block w-full pl-10 pr-3 py-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out`}
                                placeholder="Enter your email"
                                aria-label="Email address for password reset"
                                aria-invalid={error ? "true" : "false"}
                                aria-describedby={error ? "email-error" : undefined}
                            />
                        </div>
                        {error && (
                            <p
                                className="mt-2 text-sm text-red-600"
                                id="email-error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                                <ul className="max-h-48 overflow-auto rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>

                <div className="text-center mt-4 cursor-pointer"
                    onClick={() => navigate("/auth/login")}
                >
                    <span
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                        Back to Login
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetPage;