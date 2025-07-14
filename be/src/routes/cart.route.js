import e from "express";
import {
    CartController
}
    from "../controllers";

let cartAPI = e.Router();
let cartAPIRoute = (app) => {
    const controller = new CartController();
    cartAPI.get("/", controller.getByUserInToken);
    cartAPI.delete("/:id", controller.delete);
    cartAPI.post("/add", controller.addProduct);
    cartAPI.put("/update/:id", controller.update);
    cartAPI.put("/cart-item/update/:id", controller.updateCartItem);
    cartAPI.delete("/cart-item/delete/:id", controller.deleteCartItem);
    cartAPI.post("/sync", controller.sync);

    return app.use("/api/v1/cart", cartAPI);
}

export default cartAPIRoute;