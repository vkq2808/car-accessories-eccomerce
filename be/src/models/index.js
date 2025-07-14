'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

// Enhanced database connection configuration
const sequelizeOptions = {
    host: process.env.DB_HOST || config.host || 'localhost',
    dialect: config.dialect || 'postgres',
    port: process.env.DB_PORT || config.port || 5432,
    // logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        underscored: true,
        freezeTableName: true,
        timestamps: true,
        paranoid: false // Can be overridden in individual models
    },
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
};

// Initialize Sequelize with enhanced configuration
const sequelize = new Sequelize(
    process.env.DB_NAME || config.database || 'postgres',
    process.env.DB_USER || config.username || 'postgres',
    process.env.DB_PASSWORD || config.password || 'postgres',
    sequelizeOptions
);

// Test database connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Auto-load all model files
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        try {
            const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
            console.log(`Model loaded: ${model.name}`);
        } catch (error) {
            console.error(`Error loading model ${file}:`, error);
        }
    });

// Set up associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        try {
            db[modelName].associate(db);
            console.log(`Associations set up for: ${modelName}`);
        } catch (error) {
            console.error(`Error setting up associations for ${modelName}:`, error);
        }
    }
});

// Add utility functions to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Add custom database utilities
db.utils = {
    // Utility function to safely execute transactions
    async transaction(callback) {
        const transaction = await sequelize.transaction();
        try {
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    // Utility function to check if database is connected
    async isConnected() {
        try {
            await sequelize.authenticate();
            return true;
        } catch (error) {
            return false;
        }
    },

    // Utility function to sync all models
    async syncAll(options = {}) {
        try {
            await sequelize.sync(options);
            console.log('All models synchronized successfully.');
        } catch (error) {
            console.error('Error synchronizing models:', error);
            throw error;
        }
    },

    // Utility function to drop all tables
    async dropAll() {
        try {
            await sequelize.drop();
            console.log('All tables dropped successfully.');
        } catch (error) {
            console.error('Error dropping tables:', error);
            throw error;
        }
    },

    // Utility function to get model statistics
    async getModelStats() {
        const stats = {};
        for (const modelName of Object.keys(db)) {
            if (db[modelName].count && typeof db[modelName].count === 'function') {
                try {
                    stats[modelName] = await db[modelName].count();
                } catch (error) {
                    stats[modelName] = 'Error counting records';
                }
            }
        }
        return stats;
    }
};

module.exports = db;