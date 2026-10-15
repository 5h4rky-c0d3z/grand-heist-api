'use strict';

/** Lookup table: Easy, Normal, Hard. */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vault_tiers', {
      tier_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tier_name: { type: Sequelize.STRING(10), allowNull: false, unique: true },
      coin_multiplier: { type: Sequelize.DECIMAL(4, 2), allowNull: false },
      stealth_penalty: { type: Sequelize.SMALLINT, allowNull: false },
      loot_rate: { type: Sequelize.DECIMAL(4, 2), allowNull: false },
      unlock_threshold: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 0 },
    });

    await queryInterface.addConstraint('vault_tiers', {
      type: 'check',
      name: 'ck_vault_tiers_name_known',
      fields: ['tier_name'],
      where: { tier_name: { [Sequelize.Op.in]: ['EASY', 'NORMAL', 'HARD'] } },
    });

    await queryInterface.addConstraint('vault_tiers', {
      type: 'check',
      name: 'ck_vault_tiers_multiplier_positive',
      fields: ['coin_multiplier'],
      where: { coin_multiplier: { [Sequelize.Op.gt]: 0 } },
    });

    await queryInterface.addConstraint('vault_tiers', {
      type: 'check',
      name: 'ck_vault_tiers_penalty_not_negative',
      fields: ['stealth_penalty'],
      where: { stealth_penalty: { [Sequelize.Op.gte]: 0 } },
    });

    await queryInterface.addConstraint('vault_tiers', {
      type: 'check',
      name: 'ck_vault_tiers_threshold_not_negative',
      fields: ['unlock_threshold'],
      where: { unlock_threshold: { [Sequelize.Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vault_tiers');
  },
};