import express from "express";
import loginController from "../controllers/loginController.js";
import userController from "../controllers/userController.js";

let authAPI = express.Router();

let authAPIRoute = (app) => {
    authAPI.post("/login", loginController.handleLogin);
    authAPI.post("/regist", loginController.handleRegister);
    authAPI.get("/verify-email/:token", loginController.handleVerifyEmail);
    authAPI.post("/reset-password", loginController.handleEnterEmailForResetingPassword);
    authAPI.post("/change-password", loginController.handleResetPassword);
    authAPI.post("/get-user-info", userController.handleGetUserInfo);

    authAPI.post("refresh-token", loginController.handleRefreshToken);

    return app.use("/auth", authAPI);
}

export default authAPIRoute;
