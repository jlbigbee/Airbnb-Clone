'use strict';
const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bookings', [
        {
          spotId: 1,
          userId: 3,
          startDate:'2022-7-15T00:00:00.000Z',
          endDate: '2022-7-20T00:00:00.000Z'
        },
        {
          spotId: 2,
          userId: 3,
          startDate:'2022-7-22T00:00:00.000Z',
          endDate: '2022-8-22T00:00:00.000Z'
        },
        {
          spotId: 5,
          userId: 4,
          startDate:'2022-9-23T00:00:00.000Z',
          endDate: '2022-9-28T00:00:00.000Z'
        },
        {
          spotId: 4,
          userId: 2,
          startDate:'2022-10-22T00:00:00.000Z',
          endDate: '2022-10-25T00:00:00.000Z'
        },
        {
          spotId: 5,
          userId: 1,
          startDate:'2022-12-22T00:00:00.000Z',
          endDate: '2022-12-27T00:00:00.000Z'
        }
      ]);
    },

    async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Bookings', {
        spotId: {
          [Op.in]: [
              1,
              2,
              5
          ]
        }
      });
    }
};
