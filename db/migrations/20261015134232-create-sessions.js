'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      session_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      join_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'set_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      status: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'waiting',
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('sessions', {
      fields: ['join_code'],
      type: 'unique',
      name: 'uq_sessions_join_code',
    });

    await queryInterface.addConstraint('sessions', {
      fields: ['status'],
      type: 'check',
      name: 'ck_sessions_status',
      where: { status: { [Op.in]: ['waiting', 'playing', 'ended'] } },
    });

    // join_code must be exactly 6 digits with no leading 0 (raw SQL)
    await queryInterface.sequelize.query(
      `ALTER TABLE "sessions"
         ADD CONSTRAINT ck_sessions_join_code_format
         CHECK (join_code ~ '^[1-9][0-9]{5}$')`
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sessions');
  },
};