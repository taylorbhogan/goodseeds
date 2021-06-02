'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('Users', [{
        firstName: 'JohnDoe',
        lastName: 'JohnDoe',
        username: 'JohnDoe',
        email: 'JohnDoe@gmail.com',
        hashPassword: '$2a$10$uzZpHJDxSv7W8oYwoBzGbOKIcreCy3iQ7FWVomqcCY08NWTyhu7pO'
      },
      {
        firstName: 'JaneDoe',
        lastName: 'JaneDoe',
        username: 'JaneDoe',
        email: 'JaneDoe@gmail.com',
        hashPassword: '$2a$10$uzZpHJDxSv7W8oYwoBzGbOKIcreCy3iQ7FWVomqcCY08NWTyhu7pO'
      },

    ], {});

  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('Users', null, {});

  }
};
