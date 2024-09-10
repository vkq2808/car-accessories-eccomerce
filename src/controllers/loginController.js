// controllers/loginController.js
const handleLogin = (req, res) => {
    // Logic xử lý đăng nhập
    res.send('Login handler');
};

const handleRegister = (req, res) => {
    // Logic xử lý đăng ký
    res.send('Register handler');
};

const handleForgotPassword = (req, res) => {
    // Logic xử lý quên mật khẩu
    res.send('Forgot Password handler');
};

export default {
    handleLogin,
    handleRegister,
    handleForgotPassword
};