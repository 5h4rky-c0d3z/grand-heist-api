'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('buff_items', {
      equipment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'equipment', key: 'equipment_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      effect_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      modifier: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
      },
      duration_questions: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('buff_items', {
      fields: ['effect_type'],
      type: 'check',
      name: 'ck_buff_items_effect_type',
      where: { effect_type: { [Op.in]: ['COIN_MULTIPLIER'] } },
    });

    await queryInterface.addConstraint('buff_items', {
      fields: ['modifier'],
      type: 'check',
      name: 'ck_buff_items_modifier',
      where: { modifier: { [Op.gt]: 0 } },
    });

    await queryInterface.addConstraint('buff_items', {
      fields: ['duration_questions'],
      type: 'check',
      name: 'ck_buff_items_duration',
      where: { duration_questions: { [Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('buff_items');
  },
};