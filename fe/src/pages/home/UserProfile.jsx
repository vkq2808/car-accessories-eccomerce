import React, { useCallback, useEffect, useState } from "react";
import { FiCheck, FiEdit2, FiLoader, FiLock, FiSave, FiX } from "react-icons/fi";
import { BiUser, BiEnvelope, BiPhone, BiMapPin } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postDataAPI, putDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import OrderHistory from "./OrderHistory";
import { getUserInfo } from "../../redux/actions/authActions";
import { imgSrc } from "../../utils/imageSrc";

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [note, setNotes] = useState({});
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [imageUpload, setImageUpload] = useState(null);

    const [emailChecking, setEmailChecking] = useState(false);

    const [userData, setUserData] = useState({
        first_name: auth.user?.first_name || '',
        last_name: auth.user?.last_name || '',
        email: auth.user?.email || '',
        phone: auth.user?.phone || '',
        bio: "Passionate developer with a love for creating innovative solutions.",
        image_url: auth.user?.image_url || '',
        address: auth.user?.address || '',
    });

    const handleCheckEmailExist = async () => {
        setEmailChecking(true);
        if (!userData.email.trim()) return;
        if (auth.user?.email === userData.email) {
            setErrors((prev) => ({ ...prev, email: "" }));
            setNotes((prev) => ({ ...prev, email: "" }));
            setEmailChecking(false);
            return;
        }
        try {
            const res = await postDataAPI("auth/check-email", { email: userData.email }, auth.token);
            if (res.status === 200) {
                setErrors((prev) => ({ ...prev, email: "Email is already taken" }));
                setNotes((prev) => ({ ...prev, email: "" }));
                setEmailChecking(false);
                return false;
            }
        } catch (error) {
            if (error.response.status === 404) {
                setErrors((prev) => ({ ...prev, email: "" }));
                setNotes((prev) => ({ ...prev, email: "Email is available" }));
                setEmailChecking(false);
                return true;
            }
        }
    };

    const validateForm = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-10]\d{9,11}$/;
        const numberRegex = /^[0-9]+$/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const newErrors = {};
        // first_name
        if (!userData.first_name.trim()) newErrors.first_name = "First name is required";
        else if (userData.first_name.length < 2) newErrors.first_name = "First name is too short";
        else if (userData.first_name.length > 50) newErrors.first_name = "First name is too long";
        else if (specialCharRegex.test(userData.first_name)) newErrors.first_name = "First name cannot contain special characters";
        else if (numberRegex.test(userData.first_name)) newErrors.first_name = "First name cannot contain numbers";
        // last_name
        if (!userData.last_name.trim()) newErrors.last_name = "Last name is required";
        else if (userData.last_name.length < 2) newErrors.last_name = "Last name is too short";
        else if (userData.last_name.length > 50) newErrors.last_name = "Last name is too long";
        else if (specialCharRegex.test(userData.last_name)) newErrors.last_name = "Last name cannot contain special characters";
        else if (numberRegex.test(userData.last_name)) newErrors.last_name = "Last name cannot contain numbers";
        // email
        if (!userData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(userData.email)) {
            newErrors.email = "Invalid email format";
        } else {
            const res = await handleCheckEmailExist();
            if (!res && res !== undefined) newErrors.email = "Email is already taken";
        }
        // phone
        if (!userData.phone.trim()) newErrors.phone = "Phone is required";
        else if (!phoneRegex.test(userData.phone)) newErrors.phone = "Invalid phone number";
        // address
        if (userData.address.length > 100) newErrors.address = "Location is too long";
        // password
        if (userData.password && userData.password.length < 8) newErrors.password = "Password is too short";
        else if (userData.password && userData.password.length > 50) newErrors.password = "Password is too long";
        // confirmPassword
        if (userData.confirmPassword && userData.confirmPassword !== userData.password) newErrors.confirmPassword = "Passwords do not match";
        // image_url
        if (imageUpload && imageUpload.size > 5 * 1024 * 1024) newErrors.image_url = "Image size is too large";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (await validateForm()) {
            try {
                if (imageUpload) {

                    const formData = new FormData();
                    formData.append("file", imageUpload);

                    let res = await postDataAPI("upload/image", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    if (res.status !== 200) throw new Error(res.data.message || "Upload failed");
                    const image_url = res.data.url;

                    const data = { ...userData, image_url, id: auth.user.id };
                    res = await putDataAPI("user/update-info", data, auth.token);
                    if (res.status === 200) {
                        dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: "You updated your profile successfully" });
                        setIsEditing(false);
                    }
                } else {
                    const data = { ...userData, id: auth.user.id };
                    const res = await putDataAPI("user/update-info", data, auth.token);
                    if (res.status === 200) {
                        dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: "You updated your profile successfully" });
                        setIsEditing(false);
                    }
                }

                setUserData({ ...userData, password: "", confirmPassword: "", old_password: "" });
            } catch (err) {
                console.log(err)
                dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
            }
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUpload(file);
            setUserData({ ...userData, image_url: URL.createObjectURL(file || "") });
        }
    };
    const refreshUserData = useCallback(() => {
        setUserData({
            first_name: auth.user?.first_name || '',
            last_name: auth.user?.last_name || '',
            email: auth.user?.email || '',
            phone: auth.user?.phone || '',
            image_url: auth.user?.image_url || '',
            address: auth.user?.address || '',
        });
    }, [auth.user]);

    useEffect(() => {
        refreshUserData();
    }, [refreshUserData, auth.user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!auth.token) {
                dispatch({ type: "ERROR_ALERT", payload: "Bạn chưa đăng nhập" });
                navigate("/auth/login");
            }
        }, 3000);

        return () => clearTimeout(timer); // Clear timeout on cleanup
    }, [auth.token, dispatch, navigate]);

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

    return (
        <div className="min-h-[90vh] w-full bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center gap-10 flex-col md:flex-row">
            <div className="min-w-[500px] bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-cyan-600">
                    <button
                        onClick={() => setIsEditing((prev) => {
                            if (prev) refreshUserData();
                            return !prev;
                        })}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                        aria-label={isEditing ? "Cancel editing" : "Edit profile"}
                    >
                        {isEditing ? <FiX size={20} /> : <FiEdit2 size={20} />}
                    </button>
                </div>

                <div className="relative px-6 py-10 sm:px-10">
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                        <div className="relative group">
                            <img
                                src={imgSrc(userData.image_url)}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                onError={(e) => {
                                    e.target.src = "https://www.inprocorp.com/globalassets/color--finish-images/standard-solid/periwinkle.jpg?width=500&height=500&mode=crop";
                                }}
                            />
                            {isEditing && (
                                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full cursor-pointer group-hover:bg-opacity-70 transition-all duration-200">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        aria-label="Upload profile picture"
                                    />
                                    <span className="text-white text-sm">Change Photo</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="mt-16 space-y-6">
                        <div className="space-y-4">
                            <ProfileField
                                icon={<BiUser />}
                                value={userData.first_name}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, first_name: val })}
                                error={errors.first_name}
                                label="first_name"
                                placeholder={"First Name"}
                            />

                            <ProfileField
                                icon={<BiUser />}
                                value={userData.last_name}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, last_name: val })}
                                error={errors.last_name}
                                label="last_name"
                                placeholder={"Last Name"}
                            />

                            <ProfileField
                                icon={<BiEnvelope />}
                                value={userData.email}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, email: val })}
                                error={errors.email}
                                success={note.email}
                                handleCheck={handleCheckEmailExist}
                                label="Email"
                                placeholder={"Email"}
                                checkIcon={emailChecking ? <FiLoader /> : <FiCheck />}
                            />
                            <PasswordField
                                icon={<FiLock />}
                                value={userData.old_password}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, old_password: val })}
                                error={errors.old_password}
                                label="Old Password"
                            />

                            <PasswordField
                                icon={<FiLock />}
                                value={userData.password}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, password: val })}
                                error={errors.password}
                                label="Password"
                            />

                            <PasswordField
                                icon={<FiLock />}
                                value={userData.confirmPassword}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, confirmPassword: val })}
                                error={errors.confirmPassword}
                                label="Confirm Password"
                                className={isEditing ? "" : "hidden"}
                            />

                            <ProfileField
                                icon={<BiPhone />}
                                value={userData.phone}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, phone: val })}
                                error={errors.phone}
                                label="Phone"
                                placeholder={"Phone"}
                            />

                            <ProfileField
                                icon={<BiMapPin />}
                                value={userData.address}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, address: val })}
                                label="Location"
                                placeholder={"Location"}
                                error={errors.address}
                            />
                        </div>

                        {isEditing && (
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        refreshUserData();
                                        setErrors({});
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    aria-label="Cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                                    aria-label="Save changes"
                                >
                                    <FiSave />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {!isEditing && <OrderHistory />}
        </div>
    );
};

const ProfileField = ({ icon, value, isEditing, onChange, error, label, handleCheck, checkIcon, success, placeholder }) => (
    <div className="flex flex-col justify-center">
        <div className="flex items-center space-x-4">
            {icon}
            {isEditing ? (
                <div className="flex-1">
                    <div className="flex">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${error ? "border-red-500" : "border-gray-300"}`}
                            aria-label={label}
                            placeholder={placeholder}
                        />
                        {handleCheck && <button className={`p-2 ml-3 rounded-full hover:bg-cyan-200 ${success ? "text-green-600" : ""}`} onClick={handleCheck}>
                            {checkIcon || <FiCheck />}
                        </button>}
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">{value}</p>
            )}
        </div>

        {isEditing && success && <p className="text-green-500 text-xs mt-1">{success}</p>}
        {isEditing && error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const PasswordField = ({ icon, value, isEditing, onChange, error, label, className }) => (
    <div className={`flex flex-col justify-center ${className}`}>
        <div className="flex items-center space-x-4">
            {icon}
            {isEditing ? (
                <div className="flex-1">
                    <input
                        type="password"
                        autoComplete="new-password"
                        autoCorrect="off"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${error ? "border-red-500" : "border-gray-300"}`}
                        aria-label={label}
                        placeholder={label}
                    />
                </div>
            ) : (
                <p className="text-gray-600">••••••••</p>
            )}
        </div>
        {isEditing && error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export default UserProfile;