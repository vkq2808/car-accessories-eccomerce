'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [{
      name: 'MÀN HÌNH ANDROID',
      description: 'Màn hình android ô tô',
      path: 'man-hinh-android',
      imageUrl: 'https://autohungdung.com/wp-content/uploads/2023/01/33502699.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "PHIM CÁCH NHIỆT",
      description: "Phim cách nhiệt ô tô",
      path: "phim-cach-nhiet",
      imageUrl: "https://autohungdung.com/wp-content/uploads/2023/01/33502699.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "BỌC GHẾ DA",
      description: "Bọc ghế da ô tô",
      path: "boc-ghe-da",
      imageUrl: "https://auto1998.vn/wp-content/uploads/2023/02/boc-ghe-da-o-to-819x1024.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "CAMERA HÀNH TRÌNH",
      description: "Camera hành trình ô tô",
      path: "camera-hanh-trinh",
      imageUrl: "https://cdn.tgdd.vn/hoi-dap/1292812/camera-hanh-trinh-la-gi-vi-sao-nen-lap-camera-hanh-trinh%20(1).jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {});
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
