import express from "express";
import { handleGetProductDetail, handleGetProducts } from "../controllers/productController";

let route = express.Router();

let productRoute = (app) => {
    route.get("/", handleGetProducts);
    route.get("/:path", handleGetProductDetail);

    return app.use("/product", route);
}

export default productRoute;
