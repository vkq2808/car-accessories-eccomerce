'use strict';

const db = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let products = await queryInterface.select(db.product, 'products', ['id']);

    for (let product of products) {
      const total_stock = product.stock;
      let remaining_stock = total_stock;

      const default_stock = Math.floor(Math.random() * total_stock * 0.5);
      remaining_stock -= default_stock;
      const size_s_stock = Math.floor(Math.random() * remaining_stock);
      remaining_stock -= size_s_stock;
      const size_m_stock = Math.floor(Math.random() * remaining_stock);
      remaining_stock -= size_m_stock;
      const size_l_stock = remaining_stock;
      remaining_stock -= total_stock;
      const color_red_stock = Math.floor(Math.random() * remaining_stock);
      remaining_stock -= color_red_stock;
      const color_blue_stock = Math.floor(Math.random() * remaining_stock);
      remaining_stock -= color_blue_stock;
      const color_green_stock = remaining_stock;

      await queryInterface.bulkInsert('product_options', [
        {
          name: 'Default',
          stock: default_stock,
          price: product.price,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Size S',
          stock: size_s_stock,
          price: product.price + product.price * 0.05,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Size M',
          stock: size_m_stock,
          price: product.price + product.price * 0.1,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Size L',
          stock: size_l_stock,
          price: product.price + product.price * 0.15,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Color Red',
          stock: color_red_stock,
          price: product.price + product.price * 0.05,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Color Blue',
          stock: color_blue_stock,
          price: product.price + product.price * 0.5,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Color Green',
          stock: color_green_stock,
          price: product.price + product.price * 0.5,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
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
