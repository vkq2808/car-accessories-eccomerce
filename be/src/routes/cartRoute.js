import e from "express";
import {
    getCart,
    addProductToCart,
    updateCart,
    handleSyncCart
}
    from "../controllers/cartController.js";

let cartAPI = e.Router();
let cartAPIRoute = (app) => {
    cartAPI.get("/", getCart);
    cartAPI.post("/add-product", addProductToCart);
    cartAPI.put("/update", updateCart);
    cartAPI.post("/sync", handleSyncCart);

    return app.use("/api/v1/cart", cartAPI);
}

export default cartAPIRoute;