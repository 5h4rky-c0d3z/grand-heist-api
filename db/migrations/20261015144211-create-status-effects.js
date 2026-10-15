'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('status_effects', {
      effect_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'players', key: 'player_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      effect_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      magnitude: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      questions_left: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('status_effects', {
      fields: ['effect_type'],
      type: 'check',
      name: 'ck_status_effects_effect_type',
      where: { effect_type: { [Op.in]: ['COIN_MULTIPLIER', 'CURSED'] } },
    });

    await queryInterface.addConstraint('status_effects', {
      fields: ['questions_left'],
      type: 'check',
      name: 'ck_status_effects_questions_left',
      where: { questions_left: { [Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('status_effects');
  },
};