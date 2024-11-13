import jwt from 'jsonwebtoken'; // gọi jwt

const authenticateToken = (req, res, next) => {
    console.log(req.path);
    const openRoutes = ['/auth', '/product', '/category', '/order'];
    const adminRoutes = '/admin';
    // Kiểm tra nếu route không cần token thì cho qua
    if (openRoutes.some(route => req.path.includes('/api/v1' + route))) {
        return next();
    }

    try {
        const authorization = req.headers['authorization'];

        if (authorization) {
            const token = authorization.split(' ')[1];

            if (token) {
                const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;

                jwt.verify(token, secretKey, (err, user) => {
                    if (err) {
                        console.log("Token invalid");
                        return res.status(401).send({ message: "Unauthorized" }); // Token không hợp lệ
                    }
                    if (req.path.includes('/api/v1' + adminRoutes) && user.role !== 'ADMIN') {
                        return res.status(403).send({ message: "Unauthorized, admin only" });
                    }
                    req.user = user;
                    console.log('Token verified, proceeding to next middleware');
                    return next();
                });
            } else {
                // Trường hợp token không tồn tại sau "Bearer "
                return res.status(401).send({ message: "Unauthorized, token not provided" });
            }
        } else {
            // Trường hợp không có authorization header
            return res.status(401).send({ message: "Unauthorized, no authorization header" });
        }
    } catch (error) {
        console.log("Authentication error: ", error.getMessage());
        return res.status(500).send({ message: "Unauthorized due to error" });
    }
};

export default authenticateToken;