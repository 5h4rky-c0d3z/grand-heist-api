'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reward_offer_options', {
      offer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'reward_offers', key: 'offer_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      option_index: {
        type: Sequelize.SMALLINT,
        primaryKey: true,
        allowNull: false,
      },
      equipment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'equipment', key: 'equipment_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });

    await queryInterface.addConstraint('reward_offer_options', {
      fields: ['option_index'],
      type: 'check',
      name: 'ck_reward_offer_options_index',
      where: { option_index: { [Op.between]: [1, 3] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reward_offer_options');
  },
};