
import jwt from 'jsonwebtoken'; //gọi jwt

const authenticateToken = (req, res, next) => {
    // Miễn xác thực cho các route cụ thể
    const openRoutes = ['/auth', '/product', '/category'];

    // Nếu là một trong các route miễn xác thực, bỏ qua middleware
    if (openRoutes.some(route => req.path.includes(route))) {
        return next();
    } else {
        console.log("Path: ", req.path);
    }

    try {
        const token = req.headers['authorization'] || req?.cookies?.token;
        if (!token) {
            return res.status(401).send({ msg: "Token not found" });
        }

        // Xác thực token
        jwt.verify(token, process.env.TOKEN_SERCET_KEY, (err, user) => {
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