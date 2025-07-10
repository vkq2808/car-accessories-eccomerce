'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const axios = require('axios');
    const bcrypt = require('bcryptjs');
    const account_roles = ['EMPLOYEE', 'USER'];
    const emailSet = new Set(); // Đảm bảo email là duy nhất
    require('dotenv').config();
    const salt = process.env.SALT;

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    try {
      const { data } = await axios.get(
        'https://randomuser.me/api/?results=200&inc=email,phone,name,dob,login'
      );

      function getRandomDateWithinLastTwoMonths() {
        const now = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(now.getMonth() - 2);

        const randomTimestamp = Math.random() * (now.getTime() - twoMonthsAgo.getTime()) + twoMonthsAgo.getTime();
        return new Date(randomTimestamp);
      }

      let users = data.results
        .map((user) => {
          let randomString = Math.random().toString(36).substring(7);
          if (emailSet.has(user.email)) {
            emailSet.add(randomString + user.email);
            return {
              ...user,
              email: randomString + user.email,
            };
          } else {
            emailSet.add(user.email);
            return user;
          }
        })
        .map((user, index) => {
          const hashedPassword = bcrypt.hashSync(user.login.password, salt);
          let roleIndex = getRandomInt(0, 1);
          let createdAt = getRandomDateWithinLastTwoMonths();
          console.log(index, ", email: ", user.email, ", role: ", account_roles[roleIndex]);
          return {
            email: user.email,
            phone: user.phone,
            first_name: user.name.first,
            last_name: user.name.last,
            hashed_password: hashedPassword,
            birth: new Date(user.dob.date),
            role: account_roles[roleIndex],
            createdAt: createdAt,
            updatedAt: createdAt,
          };
        });
      users = users.sort((a, b) => a.createdAt - b.createdAt);
      console.log("Inserting users..., length: ", users.length);
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
      const batchSize = 1000; // Tăng kích thước batch
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        await queryInterface.bulkInsert('users', batch);
      }
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (error) {
      console.error('Error during seeding:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
