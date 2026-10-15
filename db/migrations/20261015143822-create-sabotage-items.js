'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sabotage_items', {
      equipment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'equipment', key: 'equipment_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sabotage_kind: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      percent: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('sabotage_items', {
      fields: ['sabotage_kind'],
      type: 'check',
      name: 'ck_sabotage_items_kind',
      where: { sabotage_kind: { [Op.in]: ['PICKPOCKET'] } },
    });

    await queryInterface.addConstraint('sabotage_items', {
      fields: ['percent'],
      type: 'check',
      name: 'ck_sabotage_items_percent',
      where: { percent: { [Op.between]: [1, 100] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sabotage_items');
  },
};