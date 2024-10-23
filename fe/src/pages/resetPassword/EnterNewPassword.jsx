import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../redux/actions/authActions';


const EnterNewPassword = () => {

    const dispatch = useDispatch();
    const initialState = { password: "" }
    const [userData, setUserData] = useState(initialState)
    const { password } = userData
    const [errors, setErrors] = useState({});

    const path = window.location.pathname;
    const token = path.split('/').reverse()[0];

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
        setErrors({ ...errors, [name]: "" });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = {};
        if (!password) {
            errors.password = "Vui lòng nhập mật khẩu của bạn";
        } else if (password.length < 6) {
            errors.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
        }

        if (Object.keys(errors).length === 0) {
            dispatch(changePassword({ token, password: userData.password }));
        } else {
            setErrors(errors);
        }
    }

    return (
        <div>
            <section className="vh-100">
                <div className="container-xxl h-100">
                    <div className="row d-flex flex-column align-items-center justify-content-between h-100">

                        <div></div>
                        {/* Main */}
                        <div className="d-flex">
                            <div className="d-flex align-items-center justify-content-between col-md-9 col-lg-6 col-xl-5">
                                <img src={require('../../images/code.png')} alt="Code" />
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1" >
                                <h2 style={{ color: "#2F56A6", textAlign: "center" }}>Quên mật khẩu</h2>

                                <form onSubmit={handleSubmit}>
                                    {/* email input */}
                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="InputNewPassword" style={{ fontWeight: "bold", color: "#2F56A6" }}>New password</label>
                                        <input type="password" id="InputNewPassword" onChange={handleChangeInput} value={password} name="password" className="form-control form-control-lg"
                                            placeholder="Nhập mật khẩu mới của bạn" />
                                        {errors.password && <small style={{ fontWeight: "bold" }} className="text-danger">{errors.password}</small>}
                                    </div>
                                    <div className="text-center mt-4 mb-4 pt-2">
                                        <button type="submit" className="btn btn-primary btn-lg"
                                            style={{ width: "100%" }} >Đổi mật khẩu</button>
                                    </div>
                                    <p className="small fw-bold mt-2 pt-1 mb-0">Bạn đã có tài khoản? <a href="/auth/login"
                                        className="link-danger">Đăng nhập ngay</a></p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EnterNewPassword;