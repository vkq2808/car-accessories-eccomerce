
import jwt from 'jsonwebtoken'; //gọi jwt
import path from 'path';
import fs from 'fs';

const authenticateToken = (req, res, next) => {
    // Miễn xác thực cho các route cụ thể
    const openRoutes = ['/auth', '/product', '/category'];

    // Nếu là một trong các route miễn xác thực, bỏ qua middleware
    if (openRoutes.some(route => req.path.includes('/api/v1' + route))) {
        return next();
    }


    try {
        const token = req.headers['authorization'].split(' ')[1];
        const secretKey = process.env.ACCESS_TOKEN_SERCET_KEY;

        if (!token) {
            return res.status(401).send({ msg: "Token not found" });
        }

        // Xác thực token
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(401).send({ msg: "Unauthorized" });
            }

            req.user = user;
            next();
        });
    }
    catch (error) {
        console.log(error);
    }



};

export default authenticateToken;