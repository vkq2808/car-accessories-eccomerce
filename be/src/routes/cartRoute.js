import e from "express";
import {
    getCart,
    addProductToCart,
    updateCart
}
    from "../controllers/cartController.js";

let cartAPI = e.Router();
let cartAPIRoute = (app) => {
    cartAPI.get("/", getCart);
    cartAPI.post("/add-product", addProductToCart);
    cartAPI.put("/update", updateCart);

    return app.use("/api/v1/cart", cartAPI);
}

export default cartAPIRoute;