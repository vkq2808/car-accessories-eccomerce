'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let products = await queryInterface.sequelize.query(
      'SELECT id,price, stock FROM products;'
    );

    let costs = products[0].map((product) => {
      return {
        total_cost: product.price * product.stock * 0.6,
        product_id: product.id,
        cost_type: 'PURCHASE',
        description: 'Purchase cost',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('costs', costs, {});
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
