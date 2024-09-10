import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine.js';
import initWebRoutes from './route/web.js';
import connectDB from './config/database.js';

const startServer = async () => {
    try {
        const app = express();

        // Cấu hình ứng dụng
        app.use(bodyParser.json());
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
