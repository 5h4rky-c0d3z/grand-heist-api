'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shop_listings', {
      listing_id: {
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
      equipment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'equipment', key: 'equipment_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      stock: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addConstraint('shop_listings', {
      fields: ['session_id', 'equipment_id'],
      type: 'unique',
      name: 'uq_shop_one_listing_per_item',
    });

    await queryInterface.addConstraint('shop_listings', {
      fields: ['stock'],
      type: 'check',
      name: 'ck_shop_listings_stock',
      where: { stock: { [Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('shop_listings');
  },
};