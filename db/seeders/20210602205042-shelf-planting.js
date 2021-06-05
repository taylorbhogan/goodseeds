'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Shelves', [
        {
          userId: 1,
          name: "John Doe's First Shelf"
        },
        {
          userId: 1,
          name: "My Someday Soon Shelf"
        },
        {
          userId: 1,
          name: "Plants I've Murdered"
        },
        {
          userId: 2,
          name: "Jane Doe's First Shelf"
        },
        {
          userId: 2,
          name: "Sunroom Rennovation"
        },
        {
          userId: 2,
          name: "Living Room Inspiration"
        },
        {
          userId: 2,
          name: "Plants for the Patio"
        },
      ], {});

  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('Shelves', null, {});

  }
};
