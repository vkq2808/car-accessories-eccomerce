import express from "express";
<<<<<<< HEAD
import { handleGetProductDetail, handleGetAllProducts, handleFollowProduct } from "../controllers";
=======
import { handleGetProductDetail, handleGetAllProducts } from "../controllers";
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded

let route = express.Router();

let productRoute = (app) => {
    route.get("/", handleGetAllProducts);
    route.get("/:path", handleGetProductDetail);

    return app.use("/api/v1/product", route);
}

export default productRoute;
