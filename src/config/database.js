import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME || 'db', process.env.DB_USERNAME || 'root', process.env.DB_PASSWORD || '@123', {
    host: 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default connectDB;