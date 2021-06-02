module.exports = (sequelize, DataTypes) => {
  const Shelf = sequelize.define('Shelf', {
    userId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  Shelf.associate = function(models) {
    const columnMapping = {
      through: 'PlantToShelf',
      foreignKey: 'shelfId',
      otherKey: 'plantId'
    }

    Shelf.belongsToMany(models.Plant, columnMapping)
  };
  return Shelf;
};
