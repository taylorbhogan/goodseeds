module.exports = (sequelize, DataTypes) => {
  const Shelf = sequelize.define('Shelf', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Users'}
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
    Shelf.belongsTo(models.User, {foreignKey: 'userId'}),
    Shelf.hasMany(models.Comment, {foreignKey: 'shelfId'}),
    Shelf.belongsToMany(models.Plant, columnMapping)
  };
  return Shelf;
};
