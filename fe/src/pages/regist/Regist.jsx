import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { regist } from "../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const RegistrationForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const redirecting = useSelector((state) => state.auth.redirecting);

    // Các biến trạng thái
    const [timer, setTimer] = useState(5);
    const [result, setResult] = useState('');
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        birth: "",
        password: "",
        confirm_password: ""
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedEmails, setSuggestedEmails] = useState([]);

    // Các domain email phổ biến
    const commonDomains = useMemo(() => ["@gmail.com", "@yahoo.com", "@outlook.com", "@student.hcmute.edu.vn"], []);

    const validateForm = useCallback((name = "all", value) => {
        const newErrors = { ...errors };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-10]\d{9,11}$/;
        const allFields = ["first_name", "last_name", "email", "phone", "birth", "password", "confirm_password"];

        const validateField = (fieldName, fieldValue) => {
            switch (fieldName) {
                case "first_name":
                    newErrors.first_name = fieldValue.trim() ? "" : "First name is required";
                    break;
                case "last_name":
                    newErrors.last_name = fieldValue.trim() ? "" : "Last name is required";
                    break;
                case "email":
                    newErrors.email = !fieldValue.trim() ? "Email is required" :
                        !emailRegex.test(fieldValue) ? "Invalid email format" : "";
                    break;
                case "phone":
                    newErrors.phone = !fieldValue ? "Phone number is required" :
                        !phoneRegex.test(fieldValue.replace(/\D/g, "")) ? "Invalid phone number" : "";
                    break;
                case "birth":
                    const parsedDate = Date.parse(fieldValue);
                    newErrors.birth = isNaN(parsedDate) ? "Invalid birthdate" : "";
                    break;
                case "password":
                    newErrors.password = !fieldValue ? "Password is required" :
                        fieldValue.length < 8 ? "Password must be at least 8 characters long" : "";
                    break;
                case "confirm_password":
                    newErrors.confirm_password = !fieldValue ? "Please confirm your password" :
                        fieldValue !== formData.password ? "Passwords do not match" : "";
                    break;
                default:
                    break;
            }
        };

        if (name === "all") {
            allFields.forEach(field => validateField(field, formData[field]));
        } else {
            validateField(name, value);
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => !error); // Kiểm tra nếu không có lỗi nào
    }, [errors, formData]);

    // Hàm thay đổi giá trị form
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

        // Gợi ý email
        if (name === "email" && !value.includes("@")) {
            setSuggestedEmails(commonDomains.map((domain) => value + domain));
        } else {
            setSuggestedEmails([]);
        }

        validateForm(name, value);
    }, [commonDomains, validateForm]);

    const handleEmailSuggestionClick = (suggestedEmail) => {
        setFormData((prevFormData) => ({ ...prevFormData, email: suggestedEmail }));
        setSuggestedEmails([]);
        validateForm("email", suggestedEmail);
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm(); // Kiểm tra tất cả các trường
        if (isFormValid) {
            setIsLoading(true);
            try {
                dispatch(regist(formData, setResult));
            } catch (error) {
                console.error("Registration failed:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    // Chuyển hướng sau khi đăng ký thành công
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
                <div className="max-w-4xl mx-auto text-[--primary-text-color]">
                    <div className="bg-[--primary-background-color] rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-center mb-8">Create Your Account</h2>
                        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col w-full">
                            {/* Tạo các trường nhập liệu */}
                            <div className="flex w-full">
                                <div className="flex-col w-1/2 p-6">
                                    {["email", "phone", "password", "confirm_password"].map((field, index) => (
                                        <div key={index} className="relative">
                                            <label htmlFor={field} className="block text-sm font-medium capitalize">
                                                {field.replace("_", " ")}
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <div className="flex items-center relative">
                                                <input
                                                    type={field.includes("password") ? (field === "password" ? (showPassword ? "text" : "password") : (showConfirmPassword ? "text" : "password")) : ("text")}
                                                    id={field}
                                                    name={field}
                                                    max={field === "birth" ? new Date().toISOString().split("T")[0] : ""}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full px-3 py-[8px] border ${errors[field] ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm`}
                                                    aria-label={field.replace("_", " ")}
                                                />
                                                {field.includes("password") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => (field === "password" ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword))}
                                                        className="absolute bg-inherit inset-y-0 mt-1 rounded-full right-0 flex items-center px-[10px] text-gray-500"
                                                    >
                                                        {field === "password" ? (showPassword ? <FaEyeSlash /> : <FaEye />) : (showConfirmPassword ? <FaEyeSlash /> : <FaEye />)}
                                                    </button>
                                                )}
                                                {field === 'email' && suggestedEmails.length > 0 && (
                                                    <ul className="absolute top-[55px] bg-white text-black border border-gray-300 w-full rounded-lg mt-1 max-h-40 overflow-y-auto z-10">
                                                        {suggestedEmails.map((suggestion, index) => (
                                                            <li
                                                                key={index}
                                                                onClick={() => handleEmailSuggestionClick(suggestion)}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                            >
                                                                {suggestion}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-col w-1/2 p-6">
                                    {["first_name", "last_name", "birth"].map((field, index) => (
                                        <div key={index} className="relative">
                                            <label htmlFor={field} className="block text-sm font-medium capitalize">
                                                {field.replace("_", " ")}
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <div className="flex items-center relative">
                                                <input
                                                    type={(field === "birth" ? "date" : "text")}
                                                    id={field}
                                                    name={field}
                                                    max={field === "birth" ? new Date().toISOString().split("T")[0] : ""}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full px-3 py-[8px] border ${errors[field] ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm`}
                                                    aria-label={field.replace("_", " ")}
                                                />
                                            </div>

                                            {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isLoading ? <FaSpinner className="animate-spin mr-2" /> : "Register"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrationForm;
