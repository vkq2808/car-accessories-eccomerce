import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const CheckoutForm = ({ formData, setFormData }) => {

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const emailDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];

  const validateForm = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required";
        } else if (value.length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Invalid email format";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        const phoneRegex = /^\+?[1-10]\d{9,11}$/;
        if (!value) {
          newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(value.replace(/\D/g, ""))) {
          newErrors.phone = "Invalid phone number";
        } else {
          delete newErrors.phone;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, "");
    if (phone.length <= 4) return phone;
    if (phone.length <= 7) return `${phone.slice(0, 3)}-${phone.slice(3)}`;
    return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData({ ...formData, [name]: formatPhoneNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    validateForm(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateForm(name, formData[name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields
    Object.keys(formData).forEach(key => validateForm(key, formData[key]));

    if (Object.keys(errors).length === 0) {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Form submitted:", formData);
        setFormData({ name: "", email: "", phone: "", note: "" });
      } catch (error) {
        console.error("Submission error:", error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[--secondary-background-color] to-[--tertiary-background-color] p-6 mr-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6 transition-all duration-300 transform hover:scale-[1.02]">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-8">Checkout Form</h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded-lg border ${errors.name && touched.name ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none`}
                aria-label="Name"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && touched.name && (
                <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded-lg border ${errors.email && touched.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none`}
                aria-label="Email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                list="email-suggestions"
              />
              <datalist id="email-suggestions">
                {emailDomains.map((domain) => (
                  <option key={domain} value={`${formData.email.split("@")[0]}${domain}`} />
                ))}
              </datalist>
              {errors.email && touched.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="123-456-7890"
                className={`w-full px-4 py-2 rounded-lg border ${errors.phone && touched.phone ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none`}
                aria-label="Phone number"
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && touched.phone && (
                <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Note Field */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                Note
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none resize-none"
                aria-label="Note"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin h-5 w-5" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;