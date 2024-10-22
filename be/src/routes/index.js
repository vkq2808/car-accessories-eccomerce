import authAPIRoute from "./authRoute";
import productRoute from "./productRoute";
import cartAPIRoute from "./cartRoute";

export {
    authAPIRoute,
    productRoute,
    cartAPIRoute
}

export const applyAllRoutes = (app) => {
    authAPIRoute(app);
    productRoute(app);
    cartAPIRoute(app);
}