'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      player_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sessions', key: 'session_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      coins: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stealth: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 100,
      },
      status: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'active',
      },
      tier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'vault_tiers', key: 'tier_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      answered_in_tier: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      final_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      current_question_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'questions', key: 'question_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      question_served_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'user_id'],
      type: 'unique',
      name: 'uq_one_seat',
    });

    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'nickname'],
      type: 'unique',
      name: 'uq_player_nickname',
    });

    await queryInterface.addConstraint('players', {
      fields: ['coins'],
      type: 'check',
      name: 'ck_players_coins',
      where: { coins: { [Op.gte]: 0 } },
    });

    await queryInterface.addConstraint('players', {
      fields: ['stealth'],
      type: 'check',
      name: 'ck_players_stealth',
      where: { stealth: { [Op.between]: [0, 100] } },
    });

    await queryInterface.addConstraint('players', {
      fields: ['status'],
      type: 'check',
      name: 'ck_players_status',
      where: { status: { [Op.in]: ['active', 'busted', 'escaped'] } },
    });

    await queryInterface.addConstraint('players', {
      fields: ['answered_in_tier'],
      type: 'check',
      name: 'ck_players_answered_in_tier',
      where: { answered_in_tier: { [Op.gte]: 0 } },
    });

    await queryInterface.addConstraint('players', {
      fields: ['final_score'],
      type: 'check',
      name: 'ck_players_final_score',
      where: { final_score: { [Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('players');
  },
};