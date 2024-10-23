import authAPIRoute from "./authRoute";
import productRoute from "./productRoute";
import cartAPIRoute from "./cartRoute";
import categoryRoute from "./categoryRoute";
import followingRoute from "./followingRoute";

export {
    authAPIRoute,
    productRoute,
    cartAPIRoute,
    categoryRoute,
    followingRoute
}

export const applyAllRoutes = (app) => {
    authAPIRoute(app);
    productRoute(app);
    cartAPIRoute(app);
    categoryRoute(app);
    followingRoute(app);
}