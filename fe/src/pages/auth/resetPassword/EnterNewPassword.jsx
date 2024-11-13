import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";
import { resetPassword } from "../../../redux/actions/authActions";

const EnterNewPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const redirecting = useSelector((state) => state.auth.redirecting);
    const [result, setResult] = useState('');
    const [timer, setTimer] = useState(5);


    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState("");

    const validatePassword = (password) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (strongRegex.test(password)) return "strong";
        if (mediumRegex.test(password)) return "medium";
        return "weak";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            setPasswordStrength(validatePassword(value));
        }

        if (name === "confirmPassword") {
            if (value !== formData.password) {
                setErrors({ ...errors, confirmPassword: "Passwords do not match" });
            } else {
                const newErrors = { ...errors };
                delete newErrors.confirmPassword;
                setErrors(newErrors);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordStrength === "weak") {
            setErrors({ ...errors, password: "Password is too weak" });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors({ ...errors, confirmPassword: "Passwords do not match" });
            return;
        }

        setLoading(true);
        try {
            const token = window.location.pathname.split("/").reverse[0];
            dispatch(resetPassword({ token: token, password: formData.password }, setResult));
        } catch (error) {
            console.error("Reset failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!redirecting) return;

        const countdown = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    clearInterval(countdown);
                    dispatch({ type: GLOBALTYPES.REDIRECTING, payload: false });
                    navigate('/auth/login');
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
        <div className="min-h-[70vh] w-full flex items-center justify-center bg-gradient-to-br from-[--primary-background-color] to-[--tertiary-background-color] p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-gray-600">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="block w-full px-3 py-2 border  border-[--quaternary-text-color] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.password}
                                onChange={handleInputChange}
                                aria-label="New password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                        </div>
                        {passwordStrength && (
                            <div className="mt-1 flex items-center">
                                <div className={`h-2 flex-1 rounded ${{
                                    weak: "bg-red-300",
                                    medium: "bg-yellow-300",
                                    strong: "bg-green-300"
                                }[passwordStrength]}`}></div>
                                <span className="ml-2 text-sm text-gray-600 capitalize">{passwordStrength}</span>
                            </div>
                        )}
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <FaTimes className="mr-1" /> {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="block w-full px-3 py-2 border border-[--quaternary-text-color] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                aria-label="Confirm password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <FaTimes className="mr-1" /> {errors.confirmPassword}
                            </p>
                        )}
                        {!errors.confirmPassword && formData.confirmPassword && formData.confirmPassword === formData.password && (
                            <p className="mt-1 text-sm text-green-600 flex items-center">
                                <FaCheck className="mr-1" /> Passwords match
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition duration-200 ease-in-out hover:scale-105"
                    >
                        {loading ? (
                            <BiLoaderAlt className="animate-spin h-5 w-5" />
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnterNewPassword;