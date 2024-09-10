import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME || 'db', process.env.DB_USERNAME || 'root', process.env.DB_PASSWORD || 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    await sequelize.authenticate();
    console.log('Kết nối thành công đến MySQL!');
} catch (error) {
    console.error('Không thể kết nối đến MySQL:', error);
}

export default sequelize;