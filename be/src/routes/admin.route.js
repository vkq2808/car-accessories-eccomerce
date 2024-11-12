import express from "express";
import {
  UserController
} from "../controllers";

let adminApi = express.Router();

let adminApiRoute = (app) => {
  adminApi.get("/user", new UserController().getAll);
  return app.use("/api/v1/admin", adminApi);
}

export default adminApiRoute;
