'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const axios = require('axios');
    const bcrypt = require('bcryptjs');
    const { USER_ROLES, USER_GENDERS } = require('../constants/enum');
    const account_roles = [USER_ROLES.EMPLOYEE, USER_ROLES.USER];
    const genders = [USER_GENDERS.MALE, USER_GENDERS.FEMALE, USER_GENDERS.OTHER];
    const emailSet = new Set(); // Đảm bảo email là duy nhất
    require('dotenv').config();
    const salt = process.env.SALT;

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    try {
      const { data } = await axios.get(
        'https://randomuser.me/api/?results=200&inc=email,phone,name,dob,login,gender'
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
          let genderIndex = getRandomInt(0, 2);
          let created_at = getRandomDateWithinLastTwoMonths();
          console.log(index, ", email: ", user.email, ", role: ", account_roles[roleIndex]);
          return {
            email: user.email,
            phone: user.phone,
            first_name: user.name.first,
            last_name: user.name.last,
            hashed_password: hashedPassword,
            birth: new Date(user.dob.date),
            gender: user.gender === 'male' ? USER_GENDERS.MALE : user.gender === 'female' ? USER_GENDERS.FEMALE : genders[genderIndex],
            role: account_roles[roleIndex],
            is_active: true,
            email_verified: true,
            created_at: created_at,
            updated_at: created_at,
          };
        });
      users = users.sort((a, b) => a.created_at - b.created_at);
      console.log("Inserting users..., length: ", users.length);

      const batchSize = 100; // Reduce batch size for PostgreSQL
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        await queryInterface.bulkInsert('users', batch);
      }
    } catch (error) {
      console.error('Error during seeding:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
