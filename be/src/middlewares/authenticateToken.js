import jwt from 'jsonwebtoken'; // gọi jwt

const authenticateToken = (req, res, next) => {
    console.log(req.path);
    const openRoutes = ['/auth', '/product', '/category', '/order'];

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
                        return res.status(401).send({ msg: "Unauthorized" }); // Token không hợp lệ
                    }

                    req.user = user;
                    console.log('Token verified, proceeding to next middleware');
                    return next();
                });
            } else {
                // Trường hợp token không tồn tại sau "Bearer "
                return res.status(403).send({ msg: "Unauthorized, token not provided" });
            }
        } else {
            // Trường hợp không có authorization header
            return res.status(403).send({ msg: "Unauthorized, no authorization header" });
        }
    } catch (error) {
        console.log("Authentication error: ", error);
        return res.status(500).send({ msg: "Unauthorized due to error" });
    }
};

export default authenticateToken;