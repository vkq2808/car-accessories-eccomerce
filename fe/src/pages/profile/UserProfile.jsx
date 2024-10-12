import React from "react";
import Loading from "../../components/common/alert/Loading";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import './UserProfile.css';

const UserProfile = ({ isEditing = false }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [category, setCategory] = React.useState(1);

    React.useEffect(() => {
        if (!auth?.user) {
            navigate('/auth/login');
        }
    }, [auth, navigate]);

    const user = auth.user;

    const categoryList = [
        { name: "Thông tin cơ bản", value: 1 },
        { name: "Tài khoản", value: 2 },
        { name: "Địa chỉ", value: 3 },
        { name: "Bảo mật", value: 4 },
    ]

    const BasicInfo = () => {
        return (
            <div className="basic-info-container w-full h-full flex flex-col text-2xl">
                <div className="info-item flex w-full">
                    <div className="info-title">Họ và tên</div>
                    <div className="info-content">{user?.firstName + " " + user?.lastName}</div>
                </div>
                <div className="info-item flex w-full">
                    <div className="info-title">Email</div>
                    <div className="info-content">{user?.email}</div>
                </div>
                <div className="info-item flex w-full">
                    <div className="info-title">Số điện thoại</div>
                    <div className="info-content">{user?.phone}</div>
                </div>
                <div className="info-item flex w-full">
                    <div className="info-title">Ngày sinh</div>
                    <div className="info-content">{user?.birth}</div>
                </div>
                <div className="info-item flex w-full">
                    <div className="info-title">Giới tính</div>
                    <div className="info-content">
                        {user?.gender === "MALE" ? "Nam" : user?.gender === "FEMALE" ? "Nữ" : "Khác"}
                    </div>
                </div>
            </div>
        )
    }

    const AccountInfo = () => {
    }

    const AddressInfo = () => {

    }

    const SecurityInfo = () => {
    }

    let ProfilePage = () => {
        return (
            <div className="body-container flex flex-col w-full h-auto items-center">
                <div className="profile-container flex w-[80%] h-auto my-4 bg-[#242526] text-[#e4e6eb]">
                    <div className="avatar-category-container">
                        <div className="avatar-container flex justify-center items-center">
                            <img className="mx-20 w-[70%] max-w-[150px] h-auto" src={user?.imgSrc || "https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-18-512.png"} alt="Avatar" />
                        </div>
                        <div className="user-name w-full text-center">{user?.firstName + " " + user?.lastName}</div>
                        <div className="category-container flex flex-col w-full items-center mt-2">
                            {
                                categoryList.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setCategory(item.value)}
                                            className={`category-i w-full text-center ${category === item.value ? "active" : ""}`}
                                        >
                                            <div>{item.name}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="info-container flex flex-col w-[60%] justify-center items-center">
                        {category === 1 && <BasicInfo />}
                        {category === 2 && <AccountInfo />}
                        {category === 3 && <AddressInfo />}
                        {category === 4 && <SecurityInfo />}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {
                isLoading && <Loading />
            }
            {!isLoading && < ProfilePage />}
        </>
    )
}

export default UserProfile;