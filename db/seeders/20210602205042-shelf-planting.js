'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Shelves', [
        {
        userId: 1,
        name: 'Example1'
      },
      {
        userId: 2,
        name: '2nd shelf'
      }], {});

  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('Shelves', null, {});

  }
};
