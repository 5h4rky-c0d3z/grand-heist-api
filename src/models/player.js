module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Player',
    {
      player_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      nickname: { type: DataTypes.STRING(20), allowNull: false },
      coins: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      stealth: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 100 },
      status: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'active' },
      tier_id: { type: DataTypes.INTEGER, allowNull: false },
      answered_in_tier: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
      final_score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      current_question_id: { type: DataTypes.INTEGER },
      question_served_at: { type: DataTypes.DATE },
    },
    {
      tableName: 'players',
      timestamps: false,
    }
  );