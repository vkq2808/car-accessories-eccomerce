import { Sequelize } from 'sequelize';
import db from '../models';
const fs = require('fs');
const path = require('path');
const process = require('process');

require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME || 'postgres', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'postgres', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export const sequelizeSync = async () => {
    try {
        // Tạo kết nối PostgreSQL để quản lý database
        const { Client } = require('pg');
        require('dotenv').config();

        const client = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: 'postgres' // Kết nối đến database mặc định để tạo/xóa database
        });

        await client.connect();

        // Sử dụng async/await cho các truy vấn
        const dropDatabase = async () => {
            try {
                const dbName = process.env.DB_NAME || 'car_db';
                // Terminate existing connections to the database
                await client.query(`
                    SELECT pg_terminate_backend(pg_stat_activity.pid)
                    FROM pg_stat_activity
                    WHERE pg_stat_activity.datname = '${dbName}'
                    AND pid <> pg_backend_pid()
                `);

                await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
                console.log('Database dropped successfully.');
            } catch (error) {
                console.error('Error dropping database:', error.message);
                throw error;
            }
        };

        const createDatabase = async () => {
            try {
                const dbName = process.env.DB_NAME || 'car_db';
                await client.query(`CREATE DATABASE "${dbName}"`);
                console.log('Database created successfully.');
            } catch (error) {
                console.error('Error creating database:', error.message);
                throw error;
            }
        };

        // Đảm bảo các truy vấn hoàn thành trước khi tiếp tục
        // await dropDatabase();
        await createDatabase();

        // Đóng kết nối
        await client.end();

        // Đồng bộ hóa các models với Sequelize
        await db.sequelize.sync({ force: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to sync models:', error);
    }
};


export const seedData = async () => {
    try {
        const seeders = fs.readdirSync(path.join(__dirname, '../seeders'));
        for (let seeder of seeders) {
            await require(path.join(__dirname, '../seeders', seeder)).up(db.sequelize.getQueryInterface(), Sequelize);
        }
        console.log('Seed data successfully.');

    } catch (error) {
        console.error('Unable to seed data:', error);
    }
}

export default connectDB;