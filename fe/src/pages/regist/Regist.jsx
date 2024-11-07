import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthdate: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const commonDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];
    const [suggestedEmails, setSuggestedEmails] = useState([]);

    const validateForm = (name, value) => {
        const newErrors = { ...errors };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-10]\d{9,11}$/;

        switch (name) {
            case "firstName":
                if (!value.trim()) {
                    newErrors.firstName = "First name is required";
                } else {
                    delete newErrors.firstName;
                }
                break;
            case "lastName":
                if (!value.trim()) {
                    newErrors.lastName = "Last name is required";
                } else {
                    delete newErrors.lastName;
                }
                break;
            case "email":
                if (!value.trim()) {
                    newErrors.email = "Email is required";
                } else if (!emailRegex.test(value)) {
                    newErrors.email = "Invalid email format";
                } else {
                    delete newErrors.email;
                }
                break;
            case "phone":
                if (!value) {
                    newErrors.phone = "Phone number is required";
                } else if (!phoneRegex.test(value.replace(/\D/g, ""))) {
                    newErrors.phone = "Invalid phone number";
                } else {
                    delete newErrors.phone;
                }
                break;
            case "birthdate":
                if (!value) {
                    newErrors.birthdate = "Birthdate is required";
                } else {
                    delete newErrors.birthdate;
                }
                break;
            case "password":
                if (!value) {
                    newErrors.password = "Password is required";
                } else if (value.length < 8) {
                    newErrors.password = "Password must be at least 8 characters long";
                } else {
                    delete newErrors.password;
                }
                break;

            case "confirmPassword":
                if (!value) {
                    newErrors.confirmPassword = "Please confirm your password";
                } else if (value !== formData.password) {
                    newErrors.confirmPassword = "Passwords do not match";
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        validateForm(name, value);

        if (name === "email" && !value.includes("@")) {
            const suggestions = commonDomains.map((domain) => value + domain);
            setSuggestedEmails(suggestions);
        } else {
            setSuggestedEmails([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                // Simulating API call
                await new Promise((resolve) => setTimeout(resolve, 2000));
                alert("Registration successful! Redirecting to login...");
                // Redirect to login page here
            } catch (error) {
                console.error("Registration failed:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEmailSuggestionClick = (email) => {
        setFormData({ ...formData, email });
        setSuggestedEmails([]);
    };

    return (
        <div className="min-h-[70vh] w-full bg-gradient-to-br from-[--tertiary-background-color] to-[--secondary-background-color] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-[--primary-text-color]">
                <div className="bg-[--primary-background-color] rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-3xl font-bold text-center mb-8">Create Your Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name Field */}
                            <div className="relative">
                                <label htmlFor="firstName" className="block text-sm font-medium">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                    aria-label="First Name"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                                )}
                            </div>

                            {/* Last Name Field */}
                            <div className="relative">
                                <label htmlFor="lastName" className="block text-sm font-medium">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.lastName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                    aria-label="Last Name"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="relative">
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                    aria-label="Email Address"
                                />
                                {suggestedEmails.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg">
                                        {suggestedEmails.map((email) => (
                                            <div
                                                key={email}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleEmailSuggestionClick(email)}
                                            >
                                                {email}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div className="relative">
                                <label htmlFor="phone" className="block text-sm font-medium">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                    aria-label="Phone Number"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                )}
                            </div>

                            {/* Birthdate Field */}
                            <div className="relative">
                                <label htmlFor="birthdate" className="block text-sm font-medium">
                                    Birthdate
                                </label>
                                <input
                                    type="date"
                                    id="birthdate"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.birthdate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                    aria-label="Birthdate"
                                />
                                {errors.birthdate && (
                                    <p className="mt-1 text-sm text-red-500">{errors.birthdate}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                        aria-label="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                        aria-label="Confirm Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    "Register"
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?
                                <button type="button" className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none">
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;