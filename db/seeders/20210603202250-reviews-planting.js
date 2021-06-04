'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkInsert('Reviews', [
        {
          rating: 3,
          reviewText: "What a lovely plant",
          plantId: 3,
          userId: 1,
          createdAt: new Date(Date.UTC(2016, 1, 1)),
          updatedAt: new Date(Date.UTC(2017, 1, 1)),
        },
        {
          rating: 4,
          reviewText: "So nice",
          plantId: 3,
          userId: 2,
          createdAt: new Date(Date.UTC(2016, 1, 1)),
          updatedAt: new Date(Date.UTC(2017, 1, 1)),
        },
      ], {});
    },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkDelete('Reviews', null, {});
  }
};
