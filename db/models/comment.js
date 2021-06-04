'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    commentText: {
      allowNull: false,
      type: DataTypes.STRING(500)
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    shelfId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    likeCount: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.User, { foreignKey: 'userId' }),
    Comment.belongsTo(models.Shelf, { foreignKey: 'shelfId' })
  };
  return Comment;
};
