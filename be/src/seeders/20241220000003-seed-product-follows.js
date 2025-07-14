'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get users and products to create follows
    let users = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'USER' LIMIT 50;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    let products = await queryInterface.sequelize.query(
      "SELECT id FROM products LIMIT 20;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || products.length === 0) {
      console.log('No users or products found for product follow seeding');
      return;
    }

    function getRandomElement(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    function getRandomDateWithinLastMonth() {
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      const randomTimestamp = Math.random() * (now.getTime() - oneMonthAgo.getTime()) + oneMonthAgo.getTime();
      return new Date(randomTimestamp);
    }

    const follows = [];
    const followedPairs = new Set(); // To avoid duplicates

    // Create random follows (each user can follow multiple products)
    for (let i = 0; i < 100; i++) {
      const user = getRandomElement(users[0]);
      const product = getRandomElement(products[0]);
      const pairKey = `${user.id}-${product.id}`;

      // Skip if this user already follows this product
      if (followedPairs.has(pairKey)) {
        continue;
      }

      followedPairs.add(pairKey);
      const created_at = getRandomDateWithinLastMonth();

      follows.push({
        user_id: user.id,
        product_id: product.id,
        created_at: created_at,
        updated_at: created_at
      });
    }

    if (follows.length > 0) {
      await queryInterface.bulkInsert('product_follows', follows, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_follows', null, {});
  }
};
