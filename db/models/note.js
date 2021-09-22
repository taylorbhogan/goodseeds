'use strict';
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    text: {
      allowNull: false,
      type: DataTypes.STRING(2000)
    },
    plantToShelfId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Note.associate = function(models) {
    Note.belongsTo(models.PlantToShelf, { foreignKey: 'plantToShelfId'})
  };
  return Note;
};
