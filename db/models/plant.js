'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plant = sequelize.define('Plant', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    scientificName: DataTypes.STRING,
    imgUrl: DataTypes.STRING
  }, {});
  Plant.associate = function(models) {
    const columnMapping = {
      through: 'PlantToShelf',
      foreignKey: 'plantId',
      otherKey: 'shelfId'
    }

    Plant.belongsToMany(models.Shelf, columnMapping),
    Plant.hasMany(models.Review, {foreignKey: 'plantId'})
  };
  return Plant;
};
