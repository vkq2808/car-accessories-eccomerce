import React, { useEffect, useState } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { BiUser, BiEnvelope, BiPhone, BiMapPin } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        first_name: auth.user?.first_name || '',
        last_name: auth.user?.last_name || '',
        email: auth.user?.email || '',
        phone: auth.user?.phone || '',
        bio: "Passionate developer with a love for creating innovative solutions.",
        image_url: auth.user?.image_url || '',
        location: auth.user?.location || '',
    });

    useEffect(() => {
        if (!auth.user) {
            navigate("/auth/login", { state: { from: "/profile" } });
        }
    }, [auth.user, navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!userData.name.trim()) newErrors.name = "Name is required";
        if (!userData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!userData.phone.trim()) newErrors.phone = "Phone is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            setIsEditing(false);
            console.log("Saving user data:", userData);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUserData((prev) => ({ ...prev, image_url: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    if (!auth.user) return null;

    return (
        <div className="min-h-[90vh] bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                    <button
                        onClick={() => setIsEditing((prev) => !prev)}
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
                                src={userData.image_url}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                onError={(e) => {
                                    e.target.src = "https://www.inprocorp.com/globalassets/color--finish-images/standard-solid/periwinkle.jpg?width=500&height=500&mode=crop";
                                }}
                            />
                            {isEditing && (
                                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer group-hover:bg-opacity-70 transition-all duration-200">
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
                            />

                            <ProfileField
                                icon={<BiUser />}
                                value={userData.last_name}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, last_name: val })}
                                error={errors.last_name}
                                label="last_name"
                            />

                            <ProfileField
                                icon={<BiEnvelope />}
                                value={userData.email}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, email: val })}
                                error={errors.email}
                                label="Email"
                            />

                            <ProfileField
                                icon={<BiPhone />}
                                value={userData.phone}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, phone: val })}
                                error={errors.phone}
                                label="Phone"
                            />

                            <ProfileField
                                icon={<BiMapPin />}
                                value={userData.location}
                                isEditing={isEditing}
                                onChange={(val) => setUserData({ ...userData, location: val })}
                                label="Location"
                            />
                        </div>

                        <BioField
                            value={userData.bio}
                            isEditing={isEditing}
                            onChange={(val) => setUserData({ ...userData, bio: val })}
                        />

                        {isEditing && (
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
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
        </div>
    );
};

const ProfileField = ({ icon, value, isEditing, onChange, error, label }) => (
    <div className="flex items-center space-x-4">
        {icon}
        {isEditing ? (
            <div className="flex-1">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${error ? "border-red-500" : "border-gray-300"}`}
                    aria-label={label}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        ) : (
            <p className="text-gray-600">{value}</p>
        )}
    </div>
);

const BioField = ({ value, isEditing, onChange }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        {isEditing ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows="4"
                aria-label="Bio"
            />
        ) : (
            <p className="text-gray-600">{value}</p>
        )}
    </div>
);

export default UserProfile;
