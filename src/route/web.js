import express from "express"; //gọi Express
import homeController from "../controllers/homeController"; //gọi controller

let router = express.Router();  //khởi tạo Route

let initWebRoutes = (app) => {
    // //cách 1:
    // router.get('/', (req, res) => {
    //     return res.send("Hello world");
    // });
    // //cách 2: gọi hàm trong controller
    // router.get('/home', homeController.getHomePage); //url cho trang chủ
    // router.get('/about', homeController.getAboutPage); //url cho trang about

    router.get('/', homeController.getHomePage);

    return app.use("/", router); //url mặc định
}

export default initWebRoutes;