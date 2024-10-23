import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/authActions';

import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const initialState = { email: "", password: "" }

    const [userData, setUserData] = useState(initialState)
    const { email, password } = userData
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();

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

        if (Object.keys(errors).length === 0) {
            dispatch(login({ email: userData.email, password: userData.password }));
        }
        else {
            setErrors(errors);
        }
    }

    React.useEffect(() => {
        if (auth.token)
            navigate("/")
        else {
            localStorage.removeItem("isLoggedIn")
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
        }
    }, [auth.token, navigate])


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

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="InputPassword" style={{ fontWeight: "bold", color: "#2F56A6" }}>Mật khẩu</label>
                                <input type="password" id="InputPassword" onChange={handleChangeInput} value={password} name="password" className="form-control form-control-lg"
                                    placeholder="Nhập mật khẩu" />
                                {errors.password && <small style={{ fontWeight: "bold" }} className="text-danger">{errors.password}</small>}
                            </div>

                            <div className="text-center mt-4 mb-4 pt-2">
                                <button type="submit" className="btn btn-primary btn-lg"
                                    style={{ width: "60%" }} >Đăng nhập</button>
                            </div>
                            <p className="small fw-bold mt-2 pt-1 mb-0">Bạn chưa có tài khoản? <a href="/auth/regist"
                                className="link-danger">Đăng ký ngay</a></p>

                            <p className="small fw-bold mt-2 pt-1 mb-0">Quên mật khẩu? <a href="/auth/forgot-password"
                                className="link-danger">Tại đây</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default Login;