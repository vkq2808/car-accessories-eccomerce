import jwt from 'jsonwebtoken';
import db from '../models/index';
import userService from '../services/userService';
import bcrypt from 'bcryptjs';

// controllers/loginController.js
const getLoginPage = (req, res) => {
    // Trả về trang login
    return res.render('login.ejs');
};

const handleLogin = async (req, res) => {
    let data = await userService.getUserInfoByEmail(req.body.email);
    if (!data) {
        return res.send('Email không tồn tại');
    }

    const matchedPassword = bcrypt.compareSync(req.body.password, data.password);
    if (!matchedPassword) {
        return res.send('Mật khẩu không đúng');
    }

    const token = jwt.sign({ email: data.email }, process.env.TOKEN_SERCET_KEY, { expiresIn: '1h' });

    res.cookie('token', token, { maxAge: 900000, httpOnly: true, secure: false });

    return res.redirect('/home');
}

const getRegisterPage = (req, res) => {
    return res.render('register.ejs');
}

let handleRegister = async (req, res) => {
    let data = await userService.getUserInfoByEmail(req.body.email);
    if (data) {
        console.log(data)
        return res.send('Email đã tồn tại');
    }
    userService.createNewUser(req.body);
    return res.redirect('/login');
};

const handleForgotPassword = (req, res) => {
    // Logic xử lý quên mật khẩu
    res.send('Forgot Password handler');
};

export default {
    getLoginPage,
    handleLogin,
    getRegisterPage,
    handleRegister,
    handleForgotPassword
};