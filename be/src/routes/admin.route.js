import express from "express";
import {
  CategoryController,
  ProductController,
  UserController
} from "../controllers";

let adminApi = express.Router();

let adminApiRoute = (app) => {
  adminApi.get("/user", new UserController().getAll);
  adminApi.post("/user", new UserController().create);
  adminApi.put("/user/:id", new UserController().update);
  adminApi.delete("/user/:id", new UserController().delete);

  adminApi.get("/product", new ProductController().getAll);
  adminApi.post("/product", new ProductController().create);
  adminApi.put("/product/:id", new ProductController().update);
  adminApi.delete("/product/:id", new ProductController().delete);

  adminApi.get("/category", new CategoryController().getAll);
  adminApi.post("/category", new CategoryController().create);
  adminApi.put("/category/:id", new CategoryController().update);
  adminApi.delete("/category/:id", new CategoryController().delete);

  return app.use("/api/v1/admin", adminApi);
}

export default adminApiRoute;
