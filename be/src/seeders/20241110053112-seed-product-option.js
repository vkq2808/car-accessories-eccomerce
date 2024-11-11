'use strict';

const db = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let products = await queryInterface.select(db.product, 'products', ['id']);

    for (let product of products) {
      await queryInterface.bulkInsert('product_options', [
        {
          name: 'Default',
          stock: product.stock,
          price: product.price,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Size S',
          stock: product.stock,
          price: product.price + product.price * 0.05,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Size M',
          stock: product.stock,
          price: product.price + product.price * 0.1,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Size L',
          stock: product.stock,
          price: product.price + product.price * 0.15,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Color Red',
          stock: product.stock,
          price: product.price + product.price * 0.05,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Color Blue',
          stock: product.stock,
          price: product.price + product.price * 0.5,
          product_id: product.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Color Green',
          stock: product.stock,
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
