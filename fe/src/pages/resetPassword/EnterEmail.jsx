import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../redux/action/authAction';


const EnterEmail = () => {

    const dispatch = useDispatch();
    const initialState = { email: "" }
    const [userData, setUserData] = useState(initialState)
    const { email } = userData
    const [errors, setErrors] = useState({});

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
        setErrors({ ...errors, [name]: "" });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra validation
        let errors = {};
        if (!email) {
            errors.email = "Vui lòng nhập email của bạn";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email không hợp lệ";
        }

        if (Object.keys(errors).length === 0) {
            dispatch(resetPassword({ email: userData.email }));
        } else {
            setErrors(errors);
        }
    }

    return (
        <div className='flex flex-col w-full h-auto items-center text-[#212529]'>
            <div className="body-box flex flex-row w-full justify-center items-center">
                <div className="regist-form-container flex flex-col p-4 mt-4 items-center w-[30%] mx-10">
                    <h2 className='form-title'>Đăng nhập</h2>

                    <form className='w-full flex justify-between mt-5' onSubmit={handleSubmit}>
                        <div className="first-col flex flex-col w-full">
                            <div className="form-outline mb-4 w-full">
                                <label className="form-label" htmlFor="InputEmail" style={{ fontWeight: "bold", color: "#2F56A6" }}>Email</label>
                                <input type="text" id="InputEmail" onChange={handleChangeInput} value={email} name="email" className="form-control form-control-lg"
                                    placeholder="Nhập email của bạn" />
                                {errors.email && <small style={{ fontWeight: "bold" }} className="text-danger">{errors.email}</small>}
                            </div>

                            <div className="text-center mt-4 mb-4 pt-2">
                                <button type="submit" className="btn btn-primary btn-lg"
                                    style={{ width: "60%" }} >Quên mật khẩu</button>
                            </div>
                            <p className="small fw-bold mt-2 pt-1 mb-0">Bạn chưa có tài khoản? <a href="/auth/regist"
                                className="link-danger">Đăng ký ngay</a></p>

                            <p className="small fw-bold mt-2 pt-1 mb-0">Quay lại trang đăng nhập? <a href="/auth/login"
                                className="link-danger">Tại đây</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default EnterEmail;