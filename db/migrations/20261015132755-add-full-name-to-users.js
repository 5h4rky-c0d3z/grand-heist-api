'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'full_name', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('users', 'full_name');
  }
};