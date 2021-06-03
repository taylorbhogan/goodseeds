'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    rating: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    reviewText: DataTypes.STRING(500),
    plantId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Review.associate = function(models) {
    // associations can be defined here
    Review.belongsTo(models.Plant, {foreignKey: 'plantId'})
    Review.belongsTo(models.User, {foreignKey: 'userId'})

  };
  return Review;
};
