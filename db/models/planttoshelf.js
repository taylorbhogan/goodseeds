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
    PlantToShelf.belongsTo(models.Plant, {foreignKey: 'plantId'})
  };
  return PlantToShelf;
};
