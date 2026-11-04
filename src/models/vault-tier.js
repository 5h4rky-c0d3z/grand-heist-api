module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'VaultTier',
    {
      tier_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tier_name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: 'vault_tiers',
      timestamps: false,
    }
  );