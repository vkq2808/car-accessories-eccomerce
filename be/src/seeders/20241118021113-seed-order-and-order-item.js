'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const order_status = ['PENDING', 'PROCESSING', 'FINISHED'];

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let product_options = await queryInterface.sequelize.query(
      `SELECT p.id, po.id as option_id, po.price
       FROM products p 
       JOIN product_options po ON po.product_id = p.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (let product of product_options) {
      // Thêm đơn hàng
      let result = await queryInterface.bulkInsert('orders', [
        {
          user_id: getRandomInt(0, 1) ? 1 : null,
          status: order_status[getRandomInt(0, 2)],
          currency: 'VND',
          discount: 0,
          total_amount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      // Lấy ID cuối cùng được chèn
      let [lastInserted] = await queryInterface.sequelize.query('SELECT LAST_INSERT_ID() as id');
      let order_id = lastInserted[0].id;
      let order_item_quantity = getRandomInt(1, 5);

      // Thêm chi tiết đơn hàng
      await queryInterface.bulkInsert('order_items', [
        {
          order_id: order_id,
          product_id: product.id,
          product_option_id: product.option_id,
          quantity: order_item_quantity,
          price: product.price,
          currency: 'VND',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});

      // Cập nhật tổng tiền
      await queryInterface.bulkUpdate('orders',
        {
          total_amount: product.price * order_item_quantity,
        }
        , {
          id: order_id
        });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('orders', null, {});
  }
};
