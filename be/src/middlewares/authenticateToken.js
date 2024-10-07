
import jwt from 'jsonwebtoken'; //gọi jwt

const authenticateToken = (req, res, next) => {
    // Miễn xác thực cho các route cụ thể
    const openRoutes = ['/login', '/register', '/forgot-password'];

    // Nếu là một trong các route miễn xác thực, bỏ qua middleware
    if (openRoutes.includes(req.path)) {
        return next();
    }

    try {
        // Kiểm tra token từ header Authorization
        const token = req.headers['authorization'] || req?.cookies?.token;
        if (!token) {
            // chuyển người dùng về trang login nếu không có token
            return res.status(401).send({ msg: 'Unauthorized' });
        }

        // Xác thực token
        jwt.verify(token, process.env.TOKEN_SERCET_KEY, (err, user) => {
            // Nếu token không hợp lệ, chuyển người dùng về trang login
            if (err) {
                return res.status(403).send({ msg: 'Forbidden' });
            }

            // Lưu thông tin người dùng vào request
            req.user = user;
            next();
        });
    }
    catch (error) {
        return res.status(403).send({ msg: 'Forbidden' });
    }



};

export default authenticateToken;