import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { regist } from '../../redux/actions/authActions';

import './Regist.css';

const Regist = () => {

    const dispatch = useDispatch();
    const initialState = { email: "", password: "", firstName: "", lastName: "", phone: "", birth: "" }
    const [userData, setUserData] = useState(initialState)
    const { email, password, firstName, lastName, phone, birth } = userData
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

        if (!password) {
            errors.password = "Vui lòng nhập mật khẩu của bạn";
        } else if (password.length < 6) {
            errors.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
        }

        if (!firstName) {
            errors.firstName = "Vui lòng nhập họ của bạn";
        }

        if (!lastName) {
            errors.lastName = "Vui lòng nhập tên của bạn";
        }

        if (!phone) {
            errors.phone = "Vui lòng nhập số điện thoại của bạn";
        } else if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(phone)) {
            errors.phone = "Số điện thoại không hợp lệ";
        }

        if (!birth) {
            errors.birth = "Vui lòng nhập ngày sinh của bạn";
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || isNaN(new Date(birth).getTime())) {
            errors.birth = "Ngày sinh không hợp lệ. Định dạng đúng là YYYY-MM-DD";
        }

        if (Object.keys(errors).length === 0) {
            dispatch(regist({ email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, phone: userData.phone, birth: userData.birth }));
        } else {
            setErrors(errors);
        }
    }

    return (
        <div className='flex flex-col w-full h-auto items-center text-[#212529]'>
            <div className="body-box flex flex-row w-full justify-center items-center">
                <div className="regist-form-container flex flex-col p-4 mt-4 items-center w-[60%] mx-10">
                    <h2 className='form-title'>Đăng ký</h2>

                    <form className='w-full flex justify-between mt-5' onSubmit={handleSubmit}>
                        <div className="first-col flex flex-col w-[45%]">
                            <div className="form-outline mb-4 w-full">
                                <label className="form-label" htmlFor="InputEmail" style={{ fontWeight: "bold", color: "#2F56A6" }}>Email</label>
                                <input type="text" id="InputEmail" onChange={handleChangeInput} value={email} name="email" className="form-control form-control-lg"
                                    placeholder="Nhập email của bạn" />
                                {errors.email && <small style={{ fontWeight: "bold" }} className="text-danger">{errors.email}</small>}
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="InputPassword" style={{ fontWeight: "bold", color: "#2F56A6" }}>Mật khẩu</label>
                                <input type="password" id="InputPassword" onChange={handleChangeInput} value={password} name="password" className="form-control form-control-lg"
                                    placeholder="Nhập mật khẩu" />
                                {errors.password && <small style={{ fontWeight: "bold" }} className="text-danger">{errors.password}</small>}
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="InputFirstName" style={{ fontWeight: "bold", color: "#2F56A6" }}>Họ</label>
                                <input type="text" id="InputFirstName" onChange={handleChangeInput} value={firstName} name="firstName" className="form-control form-control-lg"
                                    placeholder="Nhập họ của bạn" />
                                {errors.firstName && <small style={{ fontWeight: "bold" }} className="text-danger">{errors.firstName}</small>}
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="InputLastName" style={{ fontWeight: "bold", color: "#2F56A6" }}>Tên</label>
                                <input type="text" id="InputLastName" onChange={handleChangeInput} value={lastName} name="lastName" className="form-control form-control-lg"
                                    placeholder="Nhập tên của bạn" />
                                {errors.lastName && <small style={{ fontWeight: "bold" }} className="text-danger">{errors.lastName}</small>}
                            </div>
                        </div>
                        <div className="second-col flex flex-col w-[45%]">
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="InputPhone" style={{ fontWeight: "bold", color: "#2F56A6" }}>Số điện thoại</label>
                                <input type="text" id="InputPhone" onChange={handleChangeInput} value={phone} name="phone" className="form-control form-control-lg"
                                    placeholder="Nhập số điện thoại của bạn" />
                                {errors.phone && <small style={{ fontWeight: "bold" }} className="text-danger">{errors.phone}</small>}
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="InputBirth" style={{ fontWeight: "bold", color: "#2F56A6" }}>Ngày sinh</label>
                                <input type="text" id="InputBirth" onChange={handleChangeInput} value={birth} name="birth" className="form-control form-control-lg"
                                    placeholder="YYYY-MM-DD" />
                                {errors.birth && <small style={{ fontWeight: "bold" }} className="text-danger">{errors.birth}</small>}
                            </div>

                            <div className="text-center mt-4 mb-4 pt-2">
                                <button type="submit" className="btn btn-primary btn-lg"
                                    style={{ width: "60%" }} >Đăng ký ngay</button>
                            </div>
                            <p className="small fw-bold mt-2 pt-1 mb-0">Bạn đã có tài khoản? <a href="/auth/login"
                                className="link-danger">Đăng nhập ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default Regist;