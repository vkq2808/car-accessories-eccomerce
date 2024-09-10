import express from "express"; //gọi Express
import homeController from "../controllers/homeController"; //gọi controller
import loginController from "../controllers/loginController"; //gọi controller

let router = express.Router();  //khởi tạo Route
const TOKEN_SERCET_KEY = process.env.TOKEN_SERCET_KEY || 'b13d7ff0644a3befebdf10bbc22f89d2fec4f802e0e4ace0ee1f06265dbb6d98'

let initWebRoutes = (app) => {

    app.use(authenticateToken);

    router.get("/", homeController.getHomePage);

    router.post("/login", loginController.handleLogin);

    router.post("/register", loginController.handleRegister);

    router.post("/forgot-password", loginController.handleForgotPassword);

    return app.use("/", router);
}

export default initWebRoutes;