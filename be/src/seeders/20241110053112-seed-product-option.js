'use strict';

const db = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let products = await queryInterface.select(db.product, 'products', ['id']);

    for (let product of products) {
      const total_stock = product.stock;
      let remaining_stock = total_stock;

      const product_option_amount = Math.floor(Math.random() * 6) + 1;
      let product_options = [
        {
          name: 'Default',
          price: product.price,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Size S',
          price: product.price + product.price * 0.05,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Size M',
          price: product.price + product.price * 0.1,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Size L',
          price: product.price + product.price * 0.15,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Color Red',
          price: product.price + product.price * 0.05,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Color Blue',
          price: product.price + product.price * 0.5,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Color Green',
          price: product.price + product.price * 0.5,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      let inserting_product_options = [];

      const default_stock = Math.floor(Math.random() * product.stock * 0.5) + 1;
      remaining_stock -= default_stock;
      product_options[0].stock = default_stock;
      inserting_product_options.push(product_options[0]);

      for (let i = 1; i < product_option_amount; i++) {
        const stock = Math.floor(Math.random() * remaining_stock) + 1;
        remaining_stock -= stock;

        const product_option_index = Math.floor(Math.random() * (product_options.length - 1)) + 1;
        const product_option = product_options[product_option_index];
        product_options.filter((_, index) => index !== product_option_index);
        product_option.stock = stock;

        inserting_product_options.push(product_option);
      }

      await queryInterface.bulkInsert('product_options', inserting_product_options, {});
    }
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
