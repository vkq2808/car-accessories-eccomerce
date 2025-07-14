'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { PAYMENT_STATUS, PAYMENT_METHODS } = require('../constants/enum');

    // Get orders to create payments for
    let orders = await queryInterface.sequelize.query(
      'SELECT id, total_amount, created_at FROM orders WHERE total_amount > 0 LIMIT 20;'
    );

    if (orders[0].length === 0) {
      console.log('No orders found for payment seeding');
      return;
    }

    function getRandomElement(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    function generateTransactionId() {
      return 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    const paymentStatuses = Object.values(PAYMENT_STATUS);
    const paymentMethods = Object.values(PAYMENT_METHODS);

    const payments = [];

    for (let order of orders[0]) {
      const paymentMethod = getRandomElement(paymentMethods);
      const paymentStatus = getRandomElement(paymentStatuses);
      const paymentDate = new Date(order.created_at);
      // Add some random minutes to payment date
      paymentDate.setMinutes(paymentDate.getMinutes() + Math.floor(Math.random() * 30));

      payments.push({
        order_id: order.id,
        amount: order.total_amount,
        currency: 'VND',
        payment_method: paymentMethod,
        status: paymentStatus,
        transaction_id: generateTransactionId(),
        payment_date: paymentDate,
        created_at: paymentDate,
        updated_at: paymentDate
      });
    }

    await queryInterface.bulkInsert('payments', payments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payments', null, {});
  }
};
