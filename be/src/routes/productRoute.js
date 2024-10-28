import express from "express";
import { handleSearch, handleGetProductDetail, handleGetAllProducts } from "../controllers";

let route = express.Router();

let productRoute = (app) => {
    route.get("/", handleGetAllProducts);
    route.get("/detail/:path", handleGetProductDetail);
    route.get("/search", handleSearch);

    return app.use("/api/v1/product", route);
}

export default productRoute;
