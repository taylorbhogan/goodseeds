'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlantToShelf = sequelize.define('PlantToShelf', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
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
