import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userService from "../services/userService";

import sendEmail from "../utils/sendEmail";

const USER_ROLE = "USER";

const handleLogin = async (req, res) => {
    let { email, password } = req.body;

    console.log("Email: ", email);
    console.log("Password: ", password);

    if (!email || !password) {
        console.log("Email and Password are required");
        return res.status(208).send("Email and Password are required");
    }

    try {
        const userLogin = await userService.getUserInfoByEmail(email);

        if (userLogin) {
            let isPasswordCorrect = await bcrypt.compare(password, userLogin.hashed_password);
            if (isPasswordCorrect) {
                let accessToken = jwt.sign({ email: userLogin.email, id: userLogin.id }, process.env.ACCESS_TOKEN_SERCET_KEY, { expiresIn: '1h' });
                let refreshToken = jwt.sign({ email: userLogin.email, id: userLogin.id }, process.env.REFRESH_TOKEN_SERCET_KEY, { expiresIn: '1d' });
                return res.json({ msg: "Login success", user: userLogin, accessToken, refreshToken });
            } else {
                return res.status(207).send({ msg: "Email or Password is incorrect" });
            }
        } else {
            console.log("User not found");
            return res.status(207).send({ msg: "Email or Password is incorrect" });
        }
    } catch (err) {
        console.error('Có lỗi xảy ra:', err);
        return res.status(500).send("Internal Server Error");
    }
}


const handleRegister = async (req, res) => {

    let { email, password, firstName, lastName } = req.body;
    if (!email || !email) {
        console.log("Email and Password are required");
        return res.status(207).send({ msg: "Email và mật khẩu là bắt buộc" });
    }

    let checkUserExist = await userService.getUserInfoByEmail(email);
    if (checkUserExist) {
        console.log("User already exists");
        return res.status(207).send({ msg: "Email đã tồn tại" });
    } else {
        console.log('Email hợp lệ để đăng ký.');
    }

    const token = jwt.sign({ email, password, firstName: firstName.trim(), lastName: lastName.trim(), role: USER_ROLE }, process.env.REGISTER_SECRET_KEY, { expiresIn: '20m' });

    const registerLink = `${process.env.CLIENT_URL}/auth/verify-email/${token}`;

    const mailOptions = {
        from: process.env.SMTP_EMAIL || 'vkq0919309031@gmail.com',
        to: req.body.email,
        subject: 'Link verify email',
        html: `<a href="${registerLink}">Click here to verify email</a>`
    };

    sendEmail(mailOptions);

    return res.status(200).send({ msg: "Email sent to verify email" });
}

const handleVerifyEmail = async (req, res) => {
    const token = req.params.token;
    if (!token) {
        return res.status(209).json({ msg: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.REGISTER_SECRET_KEY);
        if (decoded) {
            let checkUserVerified = await userService.getUserInfoByEmail(decoded.email);
            if (checkUserVerified) {
                console.log("Email already verified");
                return res.status(209).json({ msg: "Email already verified" });
            }

            let newUser = await userService.createNewUser({
                email: decoded.email,
                password: decoded.password,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                role: decoded.role
            });
            return res.status(201).json({ msg: "Email verified successfully", user: newUser });
        }
    } catch (error) {
        console.log(error);
        return res.status(203).json({ msg: "Token is invalid or expired" });
    }
}

const handleEnterEmailForResetingPassword = async (req, res) => {
    let { email } = req.body;
    if (!email) {
        return res.status(209).json({ msg: "Email is required" });
    }

    let user = userService.getUserInfoByEmail(email);
    if (!user) {
        return res.status(207).json({ msg: "Email not found" });
    }

    const token = jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET_KEY, { expiresIn: '5m' });

    const resetPasswordLink = `${process.env.CLIENT_URL}/auth/reset-password/${token}`;

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Link reset password',
        html: `<a href="${resetPasswordLink}">Click here to reset password</a>`
    };

    sendEmail(mailOptions);
    return res.status(200).json({ msg: "Email sent to reset password" });
}


const handleResetPassword = async (req, res) => {
    let { token, password } = req.body;
    if (!token || !password) {
        return res.status(209).json({ msg: "Token and Password are required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET_KEY);
        if (decoded) {
            let user = userService.getUserInfoByEmail(decoded.email);
            if (!user) {
                return res.status(207).json({ msg: "Email not found" });
            }

            let updateUser = userService.updateUserPassword({ email: decoded.email, password });
            return res.status(200).json({ msg: "Password changed successfully", user: updateUser });
        }
    } catch (error) {
        console.log(error);
        return res.status(203).json({ msg: "Token is invalid or expired" });
    }
}

let handleRefreshToken = async (req, res) => {
    let { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(209).json({ msg: "Refresh token is required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SERCET_KEY);
        if (decoded) {
            let user = await userService.getUserInfoByEmail(decoded.email);
            if (!user) {
                return res.status(207).json({ msg: "User not found" });
            }

            let accessToken = jwt.sign({ email: user.email, id: user.id }, process.env.ACCESS_TOKEN_SERCET_KEY, { expiresIn: '1h' });
            return res.json({ msg: "Refresh token successfully", user: user, accessToken });
        }
    } catch (error) {
        console.log(error);
        return res.status(203).json({ msg: "Token is invalid or expired" });
    }
}

export default {
    handleLogin: handleLogin,
    handleRegister: handleRegister,
    handleVerifyEmail: handleVerifyEmail,
    handleEnterEmailForResetingPassword: handleEnterEmailForResetingPassword,
    handleResetPassword: handleResetPassword,
    handleRefreshToken: handleRefreshToken
}