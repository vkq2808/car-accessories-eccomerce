import express from "express";
import {
    handleLogin,
    handleRegister,
    handleVerifyEmail,
    handleForgetPassword,
    handleResetPassword,
    handleGetUserInfo,
    handleRefreshToken
} from "../controllers";

let authAPI = express.Router();

let authAPIRoute = (app) => {
    authAPI.post("/login", handleLogin);
    authAPI.post("/regist", handleRegister);
    authAPI.get("/verify-email/:token", handleVerifyEmail);
    authAPI.post("/reset-password", handleForgetPassword);
    authAPI.post("/change-password", handleResetPassword);
    authAPI.post("/get-user-info", handleGetUserInfo);

    authAPI.post("refresh-token", handleRefreshToken);

    return app.use("/api/v1/auth", authAPI);
}

export default authAPIRoute;
