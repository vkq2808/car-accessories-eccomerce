import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// middlewares
import authenticateToken from './middlewares/authenticateToken.js';
import helmet from 'helmet';
// config
import connectDB, { seedData, sequelizeSync } from './config/database.js';
// route
import { applyAllRoutes } from './routes';


require('dotenv').config();

const startServer = async () => {
    try {
        const app = express();

        // config cors
        app.use(cors({
            origin: [process.env.CLIENT_URL, 'https://car-accessories-eccomerce-production.up.railway.app', 'http://localhost:3000'],
            credentials: true,
        }));


        // Cấu hình ứng dụng
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(express.static('public'));
        app.use(bodyParser.urlencoded({ extended: true }));


        app.get('/', (req, res) => {
            res.send('Welcome to the Car Accessories E-commerce API');
        });

        app.get('/health', (req, res) => {
            res.status(200).send('OK');
        });

        // Middleware
        app.use(authenticateToken);
        app.use(helmet(
            {
                contentSecurityPolicy: false, // tắt chế độ CSP, tránh lỗi khi load ảnh từ url
                xFrameOptions: false, // tắt chế độ xFrameOptions, tránh tấn công clickjacking
                crossOriginResourcePolicy: false, // tắt chế độ CORP, tránh lỗi khi load ảnh từ url
            }
        ));

        // Đăng ký route
        applyAllRoutes(app);

        // Kết nối cơ sở dữ liệu
        await connectDB();
        const INIT_DATABASE = process.env.INIT_DATABASE;
        if (INIT_DATABASE === 'true') {
            await seedData();
            return;
        }

        // Khởi động server
        const port = 8080;
        app.listen(port, () => {
            console.log(`Backend Nodejs is running on port : ${port}`);
        });

    } catch (error) {
        console.error('Lỗi khi khởi động server:', error);
    }
};

startServer();
