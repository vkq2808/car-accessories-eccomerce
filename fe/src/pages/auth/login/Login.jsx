import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../../redux/actions/authActions";

const LoginPage = () => {
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [emailSuggestions, setEmailSuggestions] = useState([]);

    useEffect(() => {
        if (auth.token) {
            const redirect = location.state?.from || "/";
            navigate(redirect);
        }
    }, [auth, location, navigate]);

    const commonDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!value.includes("@")) {
            const suggestions = commonDomains.map((domain) => value + domain);
            setEmailSuggestions(suggestions);
        } else {
            setEmailSuggestions([]);
        }

        if (!validateEmail(value) && value) {
            setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
        } else {
            setErrors((prev) => ({ ...prev, email: "" }));
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (value.length < 8 && value) {
            setErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters" }));
        } else {
            setErrors((prev) => ({ ...prev, password: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email) || password.length < 8) return;

        setLoading(true);
        // Simulate API call
        dispatch(login({ email, password }));
        const redirect = location.state?.from === "/auth/regist" ? "/" : location.state?.from || "/";
        navigate(redirect);
        setLoading(false);
    };

    return (
        <div className="min-h-[70vh] w-full flex items-center justify-center text-[--primary-text-color] bg-gradient-to-br from-[--secondary-background-color] to-[--tertiary-background-color] p-4">
            <div className="w-full max-w-4xl flex flex-col-reverse md:flex-row bg-[--primary-background-color] rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none`}
                                placeholder="Enter your email"
                                aria-label="Email Address"
                                aria-invalid={errors.email ? "true" : "false"}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1" role="alert">
                                    {errors.email}
                                </p>
                            )}
                            {emailSuggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg">
                                    {emailSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setEmail(suggestion);
                                                setEmailSuggestions([]);
                                            }}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none`}
                                    placeholder="Enter your password"
                                    aria-label="Password"
                                    aria-invalid={errors.password ? "true" : "false"}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute flex items-center px-[1px] bg-inherit border-none right-3 top-1/2 -translate-y-1/2 "
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1" role="alert">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || Object.values(errors).some((error) => error)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <FaSpinner className="animate-spin mr-2" />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <button className="bg-[--primary-background-color] text-blue-600 cursor-pointer border-none hover:text-blue-800 text-sm font-medium transition-colors"
                            onClick={() => navigate("/auth/forgot-password")}
                        >
                            Forgot Password?
                        </button>
                        <button
                            onClick={() => navigate("/auth/regist")}
                            className="bg-[--primary-background-color] text-blue-600 cursor-pointer border-none hover:text-blue-800 text-sm font-medium transition-colors">
                            Create an Account
                        </button>
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-[--primary-background-color] p-8 flex items-center justify-center">
                    <img
                        src={process.env.REACT_APP_API_URL + "/file/assest/login-illu.png"}
                        alt="Login illustration"
                        className="max-w-[80%] h-auto rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;