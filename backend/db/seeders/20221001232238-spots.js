'use strict';
const { Op } = require("sequelize");

module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Spots', [
          {
            ownerId: 1,
            address: '21900 E Pacific Coast Hwy',
            city: 'Malibu',
            state: 'California',
            country: 'United States',
            lat: 34.03,
            lng: -118.65,
            name: 'The Villa',
            description: 'The Malibu getaway of your dreams',
            price: 350
          },
          {
            ownerId: 2,
            address: 'Socorro Sanchez 53',
            city: 'Santo Domingo',
            state: 'Santo Domingo',
            country: 'Dominican Republic',
            lat: 18.46,
            lng: -69.90,
            name: 'The Encanto',
            description: 'A love worth mentioning',
            price: 65
          },
          {
            ownerId: 3,
            address: '6610 SW 63rd Ave',
            city: 'South Miami',
            state: 'Florida',
            country: 'United States',
            lat: 25.70,
            lng: -80.29,
            name: 'A Room',
            description: 'Not very pretty, but a bed',
            price: 30
          },
          {
            ownerId: 4,
            address: '801 N 6th Street',
            city: 'Missoula',
            state: 'Montana',
            country: 'United States',
            lat: 44.88,
            lng: -113.99,
            name: 'Middle of Nowhere Container',
            description: 'another container Airbnb',
            price: 150
          },
          {
            ownerId: 5,
            address: '3295 Lark Haven Drive',
            city: 'Kennesaw',
            state: 'Georgia',
            country: 'United States',
            lat: 34.00,
            lng: -84.65,
            name: 'Kennesaw is Home',
            description: 'A quiet neighborhood in an upcoming city',
            price: 250
          }
        ]);
    },
    async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Spots', {
        ownerId: {
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
