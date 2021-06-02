'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PlantsToShelves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      plantId: {
        type: Sequelize.INTEGER,
        references: { model: 'Plants'}
      },
      shelfId: {
        type: Sequelize.INTEGER,
        references: { model: 'Shelves'}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PlantsToShelves');
  }
};
