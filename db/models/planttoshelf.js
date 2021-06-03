'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlantToShelf = sequelize.define('PlantToShelf', {
    plantId: {
      type: DataTypes.INTEGER,
      references: { model: 'Plants'}},
    shelfId: {
      type: DataTypes.INTEGER,
      references: { model: 'Shelves'}}
  }, {});
  PlantToShelf.associate = function(models) {
    // associations can be defined here
  };
  return PlantToShelf;
};
