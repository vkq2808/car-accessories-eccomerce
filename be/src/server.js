import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// middlewares
import authenticateToken from './middlewares/authenticateToken.js';
// config
import connectDB from './config/database.js';
// route
import authAPIRoute from './route/authRoute.js';
import productRoute from './route/productRoute.js';


require('dotenv').config();

const startServer = async () => {
    try {
        const app = express();

        // config cors
        app.use(cors({
            origin: process.env.CLIENT_URL,
            credentials: true,
        }));

        // Cấu hình ứng dụng
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(express.static('public'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(authenticateToken);

        // Đăng ký route
        authAPIRoute(app);
        productRoute(app);

        // Kết nối cơ sở dữ liệu
        connectDB();

        // Khởi động server
        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`Backend Nodejs is running on port : ${port}`);
        });

    } catch (error) {
        console.error('Lỗi khi khởi động server:', error);
    }
};

startServer();
