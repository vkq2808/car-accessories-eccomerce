'use strict';

const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const adminHashPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, process.env.SALT);
        const adminFirstName = process.env.ADMIN_FIRST_NAME;
        const adminLastName = process.env.ADMIN_LAST_NAME;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPhone = process.env.ADMIN_PHONE;
        const adminBirth = process.env.ADMIN_BIRTH;

        await queryInterface.bulkInsert('Users', [{
            email: adminEmail,
            hashed_password: adminHashPassword,
            firstName: adminFirstName,
            lastName: adminLastName,
            role: 'ADMIN',
            phone: adminPhone,
            birth: new Date(adminBirth),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
