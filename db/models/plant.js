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
    // associations can be defined here
  };
  return Plant;
};
