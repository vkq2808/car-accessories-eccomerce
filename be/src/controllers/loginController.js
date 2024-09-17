import jwt from 'jsonwebtoken';
import db from '../models/index';
import userService from '../services/userService';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail';

// controllers/loginController.js
const getLoginPage = (req, res) => {
    // Trả về trang login
    return res.render('login.ejs');
};


const handleLogin = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        console.log("Email and Password are required");
        return res.status(400).send("Email and Password are required");
    }

    let user = await userService.getUserInfoByEmail(email);

    if (user?.id) {
        let isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            let accessToken = jwt.sign({ email: user.email, id: user.id }, process.env.ACCESS_TOKEN_SERCET_KEY, { expiresIn: '1h' });
            let refreshToken = jwt.sign({ email: user.email, id: user.id }, process.env.REFRESH_TOKEN_SERCET_KEY, { expiresIn: '1d' });

            res.cookie

            return res.render("homepage.ejs")
        } else {
            return res.render("login.ejs", { error: "Incorrect email or password!" });
        }
    }
    return res.status(404).send("User not found");
}

const getRegisterPage = (req, res) => {
    return res.render('register.ejs');
}

const handleRegister = (req, res) => {

    let { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
        console.log("Email and Password are required");
        return res.status(400).send("Email and Password are required");
    }

    let user = userService.getUserInfoByEmail(email);
    if (user.id) {
        console.log("User already exists");
        return res.status(409).send("User already exists");
    }

    const token = jwt.sign({ email, password, firstName, lastName }, process.env.REGISTER_SECRET_KEY, { expiresIn: '20m' });

    const registerLink = `${process.env.CLIENT_URL}/auth/verify-email/${token}`;

    const mailOptions = {
        from: process.env.SMTP_EMAIL || 'vkq0919309031@gmail.com',
        to: req.body.email,
        subject: 'Link verify email',
        html: `<a href="${registerLink}">Click here to verify email</a>`
    };

    sendEmail(mailOptions);

    return res.status(200).send(token);
}


const handleVerifyEmail = async (req, res) => {
    const token = req.params.token;
    if (!token) {
        return res.status(209).json({ msg: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.REGISTER_SECRET_KEY);
        if (decoded) {
            let user = await userService.getUserInfoByEmail(decoded.email);
            console.log(user);
            if (user?.id) {
                return res.status(209).json({ msg: "Email already verified" });
            }

            let newUser = await userService.createNewUser({
                email: decoded.email,
                password: decoded.password,
                firstName: decoded.firstName,
                lastName: decoded.lastName
            });
            return res.status(201).json({ msg: "Email verified successfully", user: newUser });
        }
    } catch (error) {
        console.log(error);
        return res.status(203).json({ msg: "Token is invalid or expired" });
    }
}

const getEnterEmailPage = (req, res) => {
    res.render('enter-email.ejs');
}


let handleEnterEmailForResetingPassword = async (req, res) => {
    let data = await userService.getUserInfoByEmail(req.body.email);
    if (!data) {
        return res.send('Email không tồn tại');
    }

    const token = jwt.sign({ email: data.email }, process.env.TOKEN_SERCET_KEY, { expiresIn: '1h' });

    const resetLink = `${process.env.SERVER_URL || 'http://localhost:3000'}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.SMTP_EMAIL || 'vkq0919309031@gmail.com',
        to: req.body.email,
        subject: 'Link reset password',
        html: `<a href="${resetLink}">Click here to reset password</a>`
    };
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