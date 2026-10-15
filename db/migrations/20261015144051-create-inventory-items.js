'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_items', {
      item_id: {
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
      equipment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'equipment', key: 'equipment_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      slot_no: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      acquired_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      armed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      charges_left: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1,
      },
    });

    await queryInterface.addConstraint('inventory_items', {
      fields: ['player_id', 'slot_no'],
      type: 'unique',
      name: 'uq_inventory_one_item_per_slot',
    });

    await queryInterface.addConstraint('inventory_items', {
      fields: ['slot_no'],
      type: 'check',
      name: 'ck_inventory_items_slot_no',
      where: { slot_no: { [Op.between]: [1, 3] } },
    });

    await queryInterface.addConstraint('inventory_items', {
      fields: ['charges_left'],
      type: 'check',
      name: 'ck_inventory_items_charges_left',
      where: { charges_left: { [Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inventory_items');
  },
};