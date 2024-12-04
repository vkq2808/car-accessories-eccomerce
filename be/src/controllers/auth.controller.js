import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserService } from "../services";
import EmailService from '../services/email.service';
import fs from 'fs';

export default class AuthController {

    getPublicKey = (req, res) => {
        let path = require('path');
        const publicKey = fs.readFileSync(path.resolve(__dirname, '../keys/public.key'), 'utf8');
        res.send(publicKey);
    }

    registerUser = async (req, res) => {
        const { email, password, first_name, last_name, phone, birth } = req.body;

        if (!email || !password) {
            console.log("Email và mật khẩu là bắt buộc");
            return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
        }

        try {
            const userExists = await new UserService().getUserInfoByEmail(email);
            if (userExists) {
                console.log("Email đã tồn tại");
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            const token = jwt.sign(
                { email, password, first_name: first_name.trim(), last_name: last_name.trim(), phone, birth, role: process.env.USER_ROLE || 'USER' },
                process.env.REGISTER_SECRET_KEY,
                { expiresIn: '24h' }
            );

            await new EmailService().sendRegisterEmail({ email, token });

            return res.status(200).json({ message: "Email xác thực đã được gửi" });
        } catch (err) {
            console.error('Lỗi xảy ra trong quá trình đăng ký:', err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
        }
    }

    loginUser = async (req, res) => {
        const { email, password } = req.body; // (1)

        if (
            !email || // (2)
            !password // (3)
        ) {
            return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" }); // (4)
        }

        try {
            const user = await new UserService().getUserInfoByEmail(email); // (5)
            if (
                !user || // (6)
                !(await new UserService().compareUserPassword(password, user.hashed_password)) // (7)
            ) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác" }); // (8)
            }

            const access_token = jwt.sign( // (9)
                { email: user.email, id: user.id, role: user.role },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: '1h' }
            );
            const refresh_token = jwt.sign( // (10)
                { email: user.email, id: user.id, role: user.role },
                process.env.REFRESH_TOKEN_SECRET_KEY,
                { expiresIn: '1d' }
            );

            return res.status(200).json({ message: "Đăng nhập thành công", user, access_token, refresh_token }); // (11)
        } catch (err) { // (12)
            return res.status(500).json({ message: "Lỗi máy chủ", error: err }); // (13)
        }
    }

    verifyEmail = async (req, res) => {
        const token = req.params.token; // (1)
        if (!token) { // (2)
            return res.status(400).json({ message: "Token là bắt buộc" }); // (3)
        }

        try {
            const decoded = jwt.verify(token, process.env.REGISTER_SECRET_KEY); // (4)
            const userExist = await new UserService().getUserInfoByEmail(decoded.email); // (5)

            if (userExist) { // (6)
                return res.status(400).json({ message: "Email đã được xác thực, đường dẫn này đã hết hạn" }); // (7)
            }

            const newUser = await new UserService().createUser({ // (8)
                email: decoded.email,
                password: decoded.password,
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                phone: decoded.phone,
                birth: decoded.birth,
                role: decoded.role
            });

            return res.status(201).json({ message: "Email xác thực thành công", user: newUser }); // (9)
        } catch (error) { // (10)
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn", error }); // (11)
        }
    }

    requestPasswordReset = async (req, res) => {
        try {
            const { email } = req.body; //(1)
            if (!email) { //(2)
                return res.status(400).json({ message: "Email là bắt buộc" }); //(3)
            }

            const user = await new UserService().getUserInfoByEmail(email); //(4)
            if (!user) { //(5)
                return res.status(404).json({ message: "Không tìm thấy email" }); //(6)
            }

            const token = jwt.sign({ email, old_password: user.hashed_password }, process.env.RESET_PASSWORD_SECRET_KEY, { expiresIn: '5m' }); //(7)
            await new EmailService().sendResetPasswordEmail({ email, token }); //(8)

            return res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi" }); //(9)
        } catch (error) { //(10)
            console.log(error); //(11)
            return res.status(500).json({ message: "Lỗi máy chủ" }); //(12)
        }
    }

    resetPassword = async (req, res) => {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: "Token và mật khẩu là bắt buộc" });
        }

        try {
            const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET_KEY);
            if (!decoded.email) {
                return res.status(400).json({ message: "Token không hợp lệ" });
            }
            const user = await new UserService().getUserInfoByEmail(decoded.email);

            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy email" });
            }

            if (decoded.old_password !== user.hashed_password) {
                return res.status(400).json({ message: "Token không hợp lệ" });
            }

            const updatedUser = await new UserService().updateUserPassword({ email: decoded.email, password });
            return res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công", user: updatedUser });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }
    }

    refreshAccessToken = async (req, res) => {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return res.status(400).json({ message: "Refresh token là bắt buộc" });
        }

        try {
            const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET_KEY);
            if (!decoded.email) {
                return res.status(400).json({ message: "Token không hợp lệ" });
            }
            const user = await new UserService().getUserInfoByEmail(decoded.email);

            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }

            console.log("Refresh token thành công");

            const access_token = jwt.sign({ email: user.email, id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });
            const refresh_token = jwt.sign({ email: user.email, id: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1d' });

            return res.json({ message: "Refresh token thành công", user, access_token, refresh_token });
        } catch (error) {
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }
    }

    checkEmail = async (req, res) => {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email là bắt buộc" });
        }

        try {
            const user = await new UserService().getUserInfoByEmail(email);
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy email" });
            }

            return res.status(200).json({ message: "Email đã tồn tại" });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi máy chủ" });
        }
    }

    checkToken = async (req, res) => {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token là bắt buộc" });
        }

        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
            return res.status(200).json({ message: "Token hợp lệ" });
        } catch (error) {
            return res.status(400).json({ message: "Token không hợp lệ" });
        }
    }
}