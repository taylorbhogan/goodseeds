'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Comments', [
      {
        commentText: "Your shelf rox!",
        userId: 1,
        shelfId: 1,
        likeCount: 0,
        createdAt: new Date(Date.UTC(2016, 1, 1)),
        updatedAt: new Date(Date.UTC(2017, 1, 1)),
      },
      {
        commentText: "wowowowowow",
        userId: 2,
        shelfId: 1,
        likeCount: 500,
        createdAt: new Date(Date.UTC(2016, 1, 1)),
        updatedAt: new Date(Date.UTC(2017, 1, 1)),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
