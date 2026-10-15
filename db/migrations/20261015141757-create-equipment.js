'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipment', {
      equipment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      equipment_type: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sell_value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('equipment', {
      fields: ['name'],
      type: 'unique',
      name: 'uq_equipment_name',
    });

    await queryInterface.addConstraint('equipment', {
      fields: ['equipment_type'],
      type: 'check',
      name: 'ck_equipment_type',
      where: {
        equipment_type: {
          [Op.in]: ['BENEFICIAL', 'DEFENSE', 'BUFF', 'SABOTAGE', 'SPECIAL'],
        },
      },
    });

    await queryInterface.addConstraint('equipment', {
      fields: ['price'],
      type: 'check',
      name: 'ck_equipment_price',
      where: { price: { [Op.gte]: 0 } },
    });

    await queryInterface.addConstraint('equipment', {
      fields: ['sell_value'],
      type: 'check',
      name: 'ck_equipment_sell_value',
      where: { sell_value: { [Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('equipment');
  },
};