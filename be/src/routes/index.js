import authAPIRoute from "./auth.route";
import productRoute from "./product.route";
import cartAPIRoute from "./cart.route";
import categoryRoute from "./category.route";
import followRoute from "./follow.route";
import userAPIRoute from "./user.route";

export {
    authAPIRoute,
    productRoute,
    cartAPIRoute,
    categoryRoute,
    followRoute,
    userAPIRoute
}

export const applyAllRoutes = (app) => {
    authAPIRoute(app);
    productRoute(app);
    cartAPIRoute(app);
    categoryRoute(app);
    followRoute(app);
    userAPIRoute(app);
}