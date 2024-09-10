
import jwt from 'jsonwebtoken'; //gọi jwt

const authenticateToken = (req, res, next) => {
    // Miễn xác thực cho các route cụ thể
    const openRoutes = ['/login', '/register', '/forgot-password'];

    // Nếu là một trong các route miễn xác thực, bỏ qua middleware
    if (openRoutes.includes(req.path)) {
        return next();
    }

    // Kiểm tra token từ header Authorization
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: 'TokenNotFound' });

    // Xác thực token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'InvalidToken' });

        // Lưu thông tin người dùng vào request
        req.user = user;
        next();
    });
};

export default authenticateToken;