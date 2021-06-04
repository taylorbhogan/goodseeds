'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(50)
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(255)
    },
    hashPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY
    },
    imgUrl: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Shelf, {foreignKey: 'userId'}),
    User.hasMany(models.Review, {foreignKey: 'userId'}),
    User.hasMany(models.Comment, {foreignKey: 'userId'})
  };
  return User;
};
