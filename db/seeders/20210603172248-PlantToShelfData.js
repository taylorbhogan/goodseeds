'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('PlantsToShelves', [{
        plantId: 100,
        shelfId: 2,
      },
      {
        plantId: 73,
        shelfId: 2,
      },
      {
        plantId: 32,
        shelfId: 2,
      },
      {
        plantId: 62,
        shelfId: 2,
      },
      {
        plantId: 84,
        shelfId: 2,
      },
      {
        plantId: 99,
        shelfId: 1,
      },
      {
        plantId: 98,
        shelfId: 1,
      },
      {
        plantId: 97,
        shelfId: 1,
      },
    ], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('PlantsToShelves', null, {});

  }
};
