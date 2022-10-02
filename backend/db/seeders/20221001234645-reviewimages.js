'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('ReviewImages', [
        {
          reviewId: 1,
          url: 'https://images.unsplash.com/photo-1512936702668-1ab037aced2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
        },
        {
          reviewId: 2,
          url: 'https://images.unsplash.com/photo-1609729146409-a731a59343d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80'
        },
        {
          reviewId: 3,
          url: 'https://images.unsplash.com/photo-1624483047371-545036d1a6c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80'
        },
        {
          reviewId: 4,
          url: 'https://images.unsplash.com/photo-1580862999825-bf027034001d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
        },
        {
          reviewId: 5,
          url: 'https://images.unsplash.com/photo-1527359443443-84a48aec73d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', {
      reviewId: {
          [Op.in]: [ 1 , 2, 3, 4, 5 ]
      }
    });
  }
};
