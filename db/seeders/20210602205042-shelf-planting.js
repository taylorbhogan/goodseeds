'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Shelves', [
        {
          userId: 2,
          name: "John Doe's First Shelf"
        },
        {
          userId: 2,
          name: "My Someday Soon Shelf"
        },
        {
          userId: 2,
          name: "Plants I've Murdered"
        },
        {
          userId: 3,
          name: "Jane Doe's First Shelf"
        },
        {
          userId: 3,
          name: "Sunroom Rennovation"
        },
        {
          userId: 3,
          name: "Living Room Inspiration"
        },
        {
          userId: 3,
          name: "Plants for the Patio"
        },
      ], {});

  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('Shelves', null, {});

  }
};
