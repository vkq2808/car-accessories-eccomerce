'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [{
      name: 'MÀN HÌNH ANDROID', //1
      description: 'Màn hình android ô tô',
      path: 'man-hinh-android',
      imageUrl: 'https://autohungdung.com/wp-content/uploads/2023/01/33502699.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "PHIM CÁCH NHIỆT", //2
      description: "Phim cách nhiệt ô tô",
      path: "phim-cach-nhiet",
      imageUrl: "https://autohungdung.com/wp-content/uploads/2023/01/33502699.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "BỌC GHẾ DA", //3
      description: "Bọc ghế da ô tô",
      path: "boc-ghe-da",
      imageUrl: "https://auto1998.vn/wp-content/uploads/2023/02/boc-ghe-da-o-to-819x1024.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "CAMERA HÀNH TRÌNH", //4
      description: "Camera hành trình ô tô",
      path: "camera-hanh-trinh",
      imageUrl: "https://cdn.tgdd.vn/hoi-dap/1292812/camera-hanh-trinh-la-gi-vi-sao-nen-lap-camera-hanh-trinh%20(1).jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "CÁCH ÂM XE HƠI", //5
      description: "Cách âm xe hơi",
      path: "cach-am-xe-hoi",
      imageUrl: "https://tpcar.vn/wp-content/uploads/2022/12/cach-am-chong-on-ford-territory-1.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "BODY KIT", //6
      description: "Body kit ô tô",
      path: "body-kit",
      imageUrl: "https://orokingauto.com/wp-content/uploads/2023/05/body-kit-honda-civic-2017-2021-type-r-5.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "NƯỚC HOA CHO XE", //7
      description: "Nước hoa cho xe",
      path: "nuoc-hoa-cho-xe",
      imageUrl: "https://mrchailo.com/wp-content/uploads/2024/02/nuoc-hoa-o-to-2.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "PHỦ CERAMIC", //8
      description: "Phủ ceramic ô tô",
      path: "phu-ceramic",
      imageUrl: "https://product.hstatic.net/200000317829/product/12_19c68963761c4da3bca8fa094cb51a3a_1024x1024.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "CỐP XE", //9
      description: "Cốp xe ô tô",
      path: "cop-xe",
      imageUrl: "https://cdn.chungauto.vn/uploads/cop-dien-mitsubishi-xpander/cop-dien-perfect-car-chungauto.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "ĐỘ ĐÈN Ô TÔ", //10
      description: "Độ đèn ô tô",
      path: "do-den-o-to",
      imageUrl: "https://product.hstatic.net/200000317829/product/1_3f9c29aebf1f4007b30a2669a4c47de7_master.jpg",
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
