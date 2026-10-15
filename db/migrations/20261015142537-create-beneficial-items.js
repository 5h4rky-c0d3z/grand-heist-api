'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('beneficial_items', {
      equipment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'equipment', key: 'equipment_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      benefit_kind: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('beneficial_items', {
      fields: ['benefit_kind'],
      type: 'check',
      name: 'ck_beneficial_items_kind',
      where: { benefit_kind: { [Op.in]: ['COINS', 'STEALTH', 'LOOT_BOX'] } },
    });

    await queryInterface.addConstraint('beneficial_items', {
      fields: ['amount'],
      type: 'check',
      name: 'ck_beneficial_items_amount',
      where: { amount: { [Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('beneficial_items');
  },
};