'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('defense_items', {
      equipment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'equipment', key: 'equipment_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      max_charges: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1,
      },
      blocks_kind: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('defense_items', {
      fields: ['max_charges'],
      type: 'check',
      name: 'ck_defense_items_max_charges',
      where: { max_charges: { [Op.gt]: 0 } },
    });

    await queryInterface.addConstraint('defense_items', {
      fields: ['blocks_kind'],
      type: 'check',
      name: 'ck_defense_items_blocks_kind',
      where: { blocks_kind: { [Op.in]: ['PICKPOCKET', 'ANY'] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('defense_items');
  },
};