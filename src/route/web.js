import express from "express"; //gọi Express
import homeController from "../controllers/homeController"
import loginController from "../controllers/loginController"; //gọi controller
import authenticateToken from "../middlewares/authenticateToken"; //gọi middleware

let router = express.Router();  //khởi tạo Route
const TOKEN_SERCET_KEY = process.env.TOKEN_SERCET_KEY || 'b13d7ff0644a3befebdf10bbc22f89d2fec4f802e0e4ace0ee1f06265dbb6d98'

let initWebRoutes = (app) => {

    app.use(authenticateToken);

    router.get("/login", loginController.getLoginPage);
    router.post("/login", loginController.handleLogin);
    router.get("/register", loginController.getRegisterPage);
    router.post("/register", loginController.handleRegister);
    router.post("/forgot-password", loginController.handleForgotPassword);

    router.get("/signout", (req, res) => {
        res.clearCookie('token');
        return res.redirect('/login');
    });

    router.get("/", (req, res) => {
        return res.send("Hello World");
    });

    router.get("/home", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);
    router.get("/find-all-crud", homeController.getFindAllCRUD);
    router.post("/post-crud", homeController.postCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.put("/put-crud", homeController.putCRUD);
    router.delete("/delete-crud", homeController.deleteCRUD);

    return app.use("/", router);
}

export default initWebRoutes;