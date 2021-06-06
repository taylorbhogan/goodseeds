'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('Users', [{
        firstName: 'Demo',
        lastName: 'User',
        username: 'Demo User',
        email: 'demo@gmail.com',
        hashPassword: '$2a$10$uzZpHJDxSv7W8oYwoBzGbOKIcreCy3iQ7FWVomqcCY08NWTyhu7pO'
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'JohnDoeLovesPlants',
        email: 'JohnDoe@gmail.com',
        hashPassword: '$2a$10$uzZpHJDxSv7W8oYwoBzGbOKIcreCy3iQ7FWVomqcCY08NWTyhu7pO'
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        username: 'JaneDoeReallyLovesPlants',
        email: 'JaneDoe@gmail.com',
        hashPassword: '$2a$10$uzZpHJDxSv7W8oYwoBzGbOKIcreCy3iQ7FWVomqcCY08NWTyhu7pO'
      },

    ], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
