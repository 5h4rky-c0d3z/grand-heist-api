module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'User',
    {
      user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      school_id: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      username: { type: DataTypes.STRING(30), allowNull: false, unique: true },
      full_name: { type: DataTypes.STRING(100) },
      email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      role: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'player' },
    },
    { tableName: 'users', timestamps: false }
  );