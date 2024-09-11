import jwt from 'jsonwebtoken';
import db from '../models/index';
import userService from '../services/userService';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

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

    const token = jwt.sign({ email: req.body.email, }, process.env.TOKEN_SERCET_KEY, { expiresIn: '1h' });
};

const getEnterEmailPage = (req, res) => {
    res.render('enter-email.ejs');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL || 'vkq0919309031@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'sylb kytt itvg issz'
    }
});


let handleEnterEmailForResetingPassword = async (req, res) => {
    let data = await userService.getUserInfoByEmail(req.body.email);
    if (!data) {
        return res.send('Email không tồn tại');
    }

    const token = jwt.sign({ email: data.email }, process.env.TOKEN_SERCET_KEY, { expiresIn: '1h' });

    const resetLink = `${process.env.FRONT_END_URL || 'http://localhost:3000'}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL || 'vkq0919309031@gmail.com',
        to: req.body.email,
        subject: 'Link reset password',
        html: `<a href="${resetLink}">Click here to reset password</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.send('Error');
        } else {
            console.log('Email sent: ' + info.response);
            return res.send('Email sent');
        }
    });

    res.send('Email sent');
};

const getResetPasswordPage = (req, res) => {
    let token = req.params.token;
    jwt.verify(token, process.env.TOKEN_SERCET_KEY, async (err, decoded) => {
        if (err) {
            return res.render('error.ejs');
        }
        let data = await userService.getUserInfoByEmail(decoded.email);
        if (!data) {
            return res.render('error.ejs');
        }
        return res.render('resetPassword.ejs', {
            token: token,
            email: data.email
        });
    });
}

let handleResetPassword = async (req, res) => {
    let token = req.params.token;
    wt.verify(token, process.env.TOKEN_SERCET_KEY, async (err, decoded) => {
        if (err) {
            return res.send('Token không hợp lệ');
        }
        let data = await userService.getUserInfoByEmail(decoded.email);
        if (!data) {
            return res.send('Email không tồn tại');
        }
        return res.render('resetPassword.ejs', {
            email: data.email
        });
    }
    );
    res.redirect('/login');
}

export default {
    getLoginPage,
    handleLogin,
    getRegisterPage,
    handleRegister,
    getEnterEmailPage,
    handleEnterEmailForResetingPassword,
    getResetPasswordPage,
    handleResetPassword
};