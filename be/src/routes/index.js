import authAPIRoute from "./auth.route";
import productRoute from "./product.route";
import cartAPIRoute from "./cart.route";
import categoryRoute from "./category.route";
import followRoute from "./follow.route";
import userAPIRoute from "./user.route";
import orderRoute from "./order.route";
import adminApiRoute from "./admin.route";

export {
    authAPIRoute,
    productRoute,
    cartAPIRoute,
    categoryRoute,
    followRoute,
    userAPIRoute,
    orderRoute,
    adminApiRoute
}

export const applyAllRoutes = (app) => {
    authAPIRoute(app);
    productRoute(app);
    cartAPIRoute(app);
    categoryRoute(app);
    followRoute(app);
    userAPIRoute(app);
    orderRoute(app);
    adminApiRoute(app);
}