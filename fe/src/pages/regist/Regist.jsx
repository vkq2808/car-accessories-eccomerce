import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { regist } from "../../redux/action/authAction";
import { useDispatch } from "react-redux";

const Regist = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        birth: "",
        gender: ""
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateName = (name) => {
        return /^[\p{L}\s]+$/u.test(name);
    };


    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation
        if (name === "name") {
            setErrors({ ...errors, name: validateName(value) ? "" : "Name should only contain alphabets and spaces" });
        } else if (name === "email") {
            setErrors({ ...errors, email: validateEmail(value) ? "" : "Invalid email format" });
        } else if (name === "confirmPassword") {
            setErrors({ ...errors, confirmPassword: value === formData.password ? "" : "Passwords do not match" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setErrors({});
        // Form validation
        const nameValid = validateName(formData.name);
        const emailValid = validateEmail(formData.email);
        const passwordValid = formData.password.length >= 6;
        const confirmPasswordValid = formData.confirmPassword === formData.password;

        let invalid = {}
        if (!nameValid) {
            invalid.name = "Name should only contain alphabets and spaces"
        } else if (!emailValid) {
            invalid.email = "Invalid email format"
        } else if (!passwordValid) {
            invalid.password = "Password should be at least 6 characters"
        } else if (!confirmPasswordValid) {
            invalid.confirmPassword = "Passwords do not match"
        }

        setErrors(invalid);

        if (Object.keys(invalid).length === 0) {
            dispatch(regist(formData)).then(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Join Our Social Network</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.name ? 'border-red-500' : ''}`}
                            required
                            aria-describedby="nameError"
                        />
                        {errors.name && <p id="nameError" className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.email ? 'border-red-500' : ''}`}
                            required
                            aria-describedby="emailError"
                        />
                        {errors.email && <p id="emailError" className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-4">
                            {showPassword ?
                                <FaEyeSlash className="h-5 w-5 text-gray-400" onClick={() => setShowPassword(!showPassword)} /> :
                                <FaEye className="h-5 w-5 text-gray-400" onClick={() => setShowPassword(!showPassword)} />}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            required
                            aria-describedby="confirmPasswordError"
                        />
                        {errors.confirmPassword && <p id="confirmPasswordError" className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                        <label htmlFor="birth" className="block text-sm font-medium text-gray-700">Birth Date</label>
                        <input
                            type="date"
                            id="birth"
                            name="birth"
                            value={formData.birth}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            {loading ? (
                                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-3" />
                            ) : (
                                "Register"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Regist;
