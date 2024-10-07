import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaCalendar, FaGlobe, FaCamera, FaSpinner } from "react-icons/fa";

const RegistPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        dateOfBirth: "",
        country: "",
        profilePicture: null
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const countries = ["USA", "Canada", "UK", "Australia", "Germany", "France", "Japan", "Brazil"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profilePicture: URL.createObjectURL(file) });
        }
    };

    const validateField = (name, value) => {
        let newErrors = { ...errors };

        switch (name) {
            case "username":
                if (!value.trim()) {
                    newErrors.username = "Username is required";
                } else {
                    delete newErrors.username;
                }
                break;
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    newErrors.email = "Invalid email format";
                } else {
                    delete newErrors.email;
                }
                break;
            case "password":
                if (value.length < 8) {
                    newErrors.password = "Password must be at least 8 characters long";
                } else {
                    delete newErrors.password;
                }
                break;
            case "dateOfBirth":
                if (!value) {
                    newErrors.dateOfBirth = "Date of birth is required";
                } else {
                    delete newErrors.dateOfBirth;
                }
                break;
            case "country":
                if (!value) {
                    newErrors.country = "Please select a country";
                } else {
                    delete newErrors.country;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert("Registration submitted!");
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508615039623-a25605d2b022?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="username" className="sr-only">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.username ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out`}
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    aria-invalid={errors.username ? "true" : "false"}
                                    aria-describedby="username-error"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600" id="username-error">{errors.username}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out`}
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-invalid={errors.email ? "true" : "false"}
                                    aria-describedby="email-error"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600" id="email-error">{errors.email}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out`}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    aria-invalid={errors.password ? "true" : "false"}
                                    aria-describedby="password-error"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600" id="password-error">{errors.password}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dateOfBirth" className="sr-only">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCalendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    required
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out`}
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    aria-invalid={errors.dateOfBirth ? "true" : "false"}
                                    aria-describedby="dateOfBirth-error"
                                />
                            </div>
                            {errors.dateOfBirth && (
                                <p className="mt-2 text-sm text-red-600" id="dateOfBirth-error">{errors.dateOfBirth}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="country" className="sr-only">Country</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaGlobe className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <select
                                    id="country"
                                    name="country"
                                    required
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.country ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out`}
                                    value={formData.country}
                                    onChange={handleChange}
                                    aria-invalid={errors.country ? "true" : "false"}
                                    aria-describedby="country-error"
                                >
                                    <option value="">Select a country</option>
                                    {countries.map((country) => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.country && (
                                <p className="mt-2 text-sm text-red-600" id="country-error">{errors.country}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <div className="mt-1 flex items-center">
                                {formData.profilePicture ? (
                                    <img src={formData.profilePicture} alt="Profile Preview" className="h-12 w-12 rounded-full object-cover" />
                                ) : (
                                    <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                        <FaCamera className="h-full w-full text-gray-300" aria-hidden="true" />
                                    </span>
                                )}
                                <label
                                    htmlFor="profilePicture"
                                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition duration-300 ease-in-out"
                                >
                                    Change
                                </label>
                                <input
                                    id="profilePicture"
                                    name="profilePicture"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                            disabled={loading}
                        >
                            {loading ? (
                                <FaSpinner className="h-5 w-5 animate-spin" />
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

export default RegistPage;