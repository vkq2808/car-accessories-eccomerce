import authAPIRoute from "./authRoute";
import productRoute from "./productRoute";
import cartAPIRoute from "./cartRoute";
import categoryRoute from "./categoryRoute";

export {
    authAPIRoute,
    productRoute,
    cartAPIRoute,
    categoryRoute
}

export const applyAllRoutes = (app) => {
    authAPIRoute(app);
    productRoute(app);
    cartAPIRoute(app);
    categoryRoute(app);
}