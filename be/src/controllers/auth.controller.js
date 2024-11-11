import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserService } from "../services";
import sendEmail from "../utils/sendEmail";
import EmailService from '../services/email.service';

export default class AuthController {

    registerUser = async (req, res) => {
        const { email, password, first_name, last_name, phone, birth } = req.body;

        if (!email || !password) {
            console.log("Email và mật khẩu là bắt buộc");
            return res.status(400).json({ msg: "Email và mật khẩu là bắt buộc" });
        }

        try {
            const userExists = await new UserService().getUserInfoByEmail(email);
            if (userExists) {
                console.log("Email đã tồn tại");
                return res.status(400).json({ msg: "Email đã tồn tại" });
            }

            const token = jwt.sign(
                { email, password, first_name: first_name.trim(), last_name: last_name.trim(), phone, birth, role: process.env.USER_ROLE || 'USER' },
                process.env.REGISTER_SECRET_KEY,
                { expiresIn: '24h' }
            );

            await new EmailService().sendRegisterEmail({ email, token });

            return res.status(200).json({ msg: "Email xác thực đã được gửi" });
        } catch (err) {
            console.error('Lỗi xảy ra trong quá trình đăng ký:', err);
            return res.status(500).json({ msg: "Lỗi máy chủ" });
        }
    }

    loginUser = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Email và mật khẩu là bắt buộc");
            return res.status(400).json({ msg: "Email và mật khẩu là bắt buộc" });
        }

        try {
            const user = await new UserService().getUserInfoByEmail(email);
            if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
                console.log("Email hoặc mật khẩu không chính xác");
                return res.status(400).json({ msg: "Email hoặc mật khẩu không chính xác" });
            }

            const accessToken = jwt.sign(
                { email: user.email, id: user.id },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: '1h' }
            );
            const refreshToken = jwt.sign(
                { email: user.email, id: user.id },
                process.env.REFRESH_TOKEN_SECRET_KEY,
                { expiresIn: '1d' }
            );

            return res.status(200).json({ msg: "Đăng nhập thành công", user, accessToken, refreshToken });
        } catch (err) {
            console.error('Lỗi xảy ra trong quá trình đăng nhập:', err);
            return res.status(500).json({ msg: "Lỗi máy chủ" });
        }
    }

    verifyEmail = async (req, res) => {
        const token = req.params.token;
        if (!token) {
            return res.status(400).json({ msg: "Token là bắt buộc" });
        }

        try {
            const decoded = jwt.verify(token, process.env.REGISTER_SECRET_KEY);
            const userExists = await new UserService().getUserInfoByEmail(decoded.email);

            if (userExists) {
                console.log("Email đã được xác thực");
                return res.status(400).json({ msg: "Email đã được xác thực, đường dẫn này đã hết hạn" });
            }

            const newUser = await new UserService().createUser({
                email: decoded.email,
                password: decoded.password,
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                phone: decoded.phone,
                birth: decoded.birth,
                role: decoded.role
            });
            return res.status(201).json({ msg: "Email xác thực thành công", user: newUser });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ msg: "Token không hợp lệ hoặc đã hết hạn" });
        }
    }

    requestPasswordReset = async (req, res) => {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: "Email là bắt buộc" });
        }

        const user = await new UserService().getUserInfoByEmail(email);
        if (!user) {
            return res.status(404).json({ msg: "Không tìm thấy email" });
        }

        const token = jwt.sign({ email, old_password: user.hashed_password }, process.env.RESET_PASSWORD_SECRET_KEY, { expiresIn: '5m' });
        await new EmailService().sendResetPasswordEmail({ email, token });

        return res.status(200).json({ msg: "Email đặt lại mật khẩu đã được gửi" });
    }

    resetPassword = async (req, res) => {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ msg: "Token và mật khẩu là bắt buộc" });
        }

        try {
            const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET_KEY);
            const user = await new UserService().getUserInfoByEmail(decoded.email);

            if (!user) {
                return res.status(404).json({ msg: "Không tìm thấy email" });
            }

            if (decoded.old_password !== user.hashed_password) {
                return res.status(400).json({ msg: "Token không hợp lệ" });
            }

            const updatedUser = await new UserService().updateUserPassword({ email: decoded.email, password });
            return res.status(200).json({ msg: "Mật khẩu đã được thay đổi thành công", user: updatedUser });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ msg: "Token không hợp lệ hoặc đã hết hạn" });
        }
    }

    refreshAccessToken = async (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ msg: "Refresh token là bắt buộc" });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
            const user = await new UserService().getUserInfoByEmail(decoded.email);

            if (!user) {
                return res.status(404).json({ msg: "Không tìm thấy người dùng" });
            }

            const accessToken = jwt.sign({ email: user.email, id: user.id }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });
            return res.json({ msg: "Refresh token thành công", user, accessToken });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ msg: "Token không hợp lệ hoặc đã hết hạn" });
        }
    }
}