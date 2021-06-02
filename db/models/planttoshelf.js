'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlantToShelf = sequelize.define('PlantToShelf', {
    plantId: DataTypes.INTEGER,
    shelfId: DataTypes.INTEGER
  }, {});
  PlantToShelf.associate = function(models) {
    // associations can be defined here
  };
  return PlantToShelf;
};