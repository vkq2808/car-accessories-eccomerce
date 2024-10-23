
import jwt from 'jsonwebtoken'; //gọi jwt
import path from 'path';
import fs from 'fs';

const authenticateToken = (req, res, next) => {
    // Miễn xác thực cho các route cụ thể
    const openRoutes = ['/auth', '/product', '/category'];

<<<<<<< HEAD
    console.log(req.method, req.path);
=======
    console.log(req.path);
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded

    // Nếu là một trong các route miễn xác thực, bỏ qua middleware
    if (openRoutes.some(route => req.path.includes('/api/v1' + route))) {
        return next();
    }


    try {
<<<<<<< HEAD
        console.log("Authenticate token: ", req.headers['authorization']);
=======
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
        const token = req.headers['authorization'].split(' ')[1];
        const secretKey = process.env.ACCESS_TOKEN_SERCET_KEY;

        if (!token) {
            res.status(401).send({ msg: "Token not found" });
            return;
        }

        // Xác thực token
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                console.log(err);
                res.status(401).send({ msg: "Unauthorized" });
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