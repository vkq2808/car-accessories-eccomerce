'use strict';

const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { USER_ROLES, USER_GENDERS } = require('../constants/enum');
dotenv.config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const adminHashPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, process.env.SALT);
        const adminfirst_name = process.env.ADMIN_FIRST_NAME;
        const adminlast_name = process.env.ADMIN_LAST_NAME;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPhone = process.env.ADMIN_PHONE;
        const adminBirth = process.env.ADMIN_BIRTH;

        await queryInterface.bulkInsert('users', [{
            email: adminEmail,
            hashed_password: adminHashPassword,
            first_name: adminfirst_name,
            last_name: adminlast_name,
            role: USER_ROLES.SUPER_ADMIN,
            phone: adminPhone,
            birth: new Date(adminBirth),
            gender: USER_GENDERS.MALE,
            address: 'Đây là địa chỉ admin',
            image_url: "http://localhost:3001/api/v1/file/image/avatar.jpeg",
            is_active: true,
            is_active: true,
            email_verified: true,
            created_at: new Date(),
            updated_at: new Date(),
            status: 'ACTIVE',
        },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', {
            email: process.env.ADMIN_EMAIL
        }, {});
    }
};
