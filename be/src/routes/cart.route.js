import e from "express";
import {
    CartController
}
    from "../controllers";

let cartAPI = e.Router();
let cartAPIRoute = (app) => {
    cartAPI.get("/", new CartController().getByuser_id);
    cartAPI.post("/add-product", new CartController().addProduct);
    cartAPI.put("/update", new CartController().update);
    cartAPI.post("/sync", new CartController().sync);

    return app.use("/api/v1/cart", cartAPI);
}

export default cartAPIRoute;