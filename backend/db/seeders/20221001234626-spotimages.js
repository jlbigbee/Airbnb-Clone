'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: "https://images.unsplash.com/photo-1620796523448-c319f1566a91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
        preview: true
      },
      {
        spotId: 2,
        url: "https://images.unsplash.com/photo-1514600427175-13520b084fe3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80",
        preview: true
      },
      {
        spotId: 3,
        url: "https://images.unsplash.com/photo-1626222628055-fb92dd194160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        preview: true
      },
      {
        spotId: 4,
        url: "https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        preview: true
      },
      {
        spotId: 5,
        url: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        preview: true
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', {
      spotId: {
        [Op.in]: [
            1,
            2,
            3,
            4,
            5
        ]
      }
    });
}
};
