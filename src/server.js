import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine.js';
import initWebRoutes from './route/web.js';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

require('dotenv').config();


const startServer = async () => {
    try {
        const app = express();

        // Cấu hình ứng dụng
        app.use(cors({
            origin: 'http://localhost:3001',  // Thay thế bằng domain frontend của bạn
            credentials: true
        }));
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: true }));
        viewEngine(app);
        initWebRoutes(app);
        connectDB();

        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`Backend Nodejs is running on port : ${port}`);
        });

    } catch (error) {
        console.error('Lỗi khi khởi động server:', error);
    }
};

startServer();
