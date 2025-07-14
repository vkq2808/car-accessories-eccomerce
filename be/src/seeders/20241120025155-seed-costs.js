'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { COST_TYPES, COST_STATUS } = require('../constants/enum');

    const [products] = await queryInterface.sequelize.query(
      'SELECT id, name, price, stock FROM products;'
    );

    const costs = products
      .filter(p => p.price != null && p.stock != null)
      .map(product => {
        const amount = Number(product.price) * Number(product.stock) * 0.8;

        if (!Number.isFinite(amount)) {
          console.warn(`Skipping product ${product.id} due to invalid amount`);
          return null;
        }

        return {
          title: `Purchase for ${product.name}`,
          amount,
          product_id: product.id,
          cost_type: COST_TYPES.PURCHASE,
          status: COST_STATUS.APPROVED,
          description: 'Purchase for product ' + product.name,
          created_at: new Date(),
          updated_at: new Date()
        };
      })
      .filter(Boolean);

    console.log('== Cost entries to insert ==');
    console.log(costs);

    if (costs.length === 0) {
      console.warn('No valid costs to insert, skipping migration');
      return;
    }
    await queryInterface.bulkInsert('costs', costs, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('costs', null, {});
  }
};
