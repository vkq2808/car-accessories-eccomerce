import authAPIRoute from "./authRoute";
import productRoute from "./productRoute";
import cartAPIRoute from "./cartRoute";
import categoryRoute from "./categoryRoute";
<<<<<<< HEAD
import followingRoute from "./followingRoute";
=======
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded

export {
    authAPIRoute,
    productRoute,
    cartAPIRoute,
<<<<<<< HEAD
    categoryRoute,
    followingRoute
=======
    categoryRoute
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
}

export const applyAllRoutes = (app) => {
    authAPIRoute(app);
    productRoute(app);
    cartAPIRoute(app);
    categoryRoute(app);
<<<<<<< HEAD
    followingRoute(app);
=======
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
}