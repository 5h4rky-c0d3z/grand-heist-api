'use strict';

/** Accounts. Hosts and players share this table; role tells them apart (Design Change Notice 01). */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      school_id: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      username: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      email: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'player' },
    });

    await queryInterface.addConstraint('users', {
      type: 'check',
      name: 'ck_users_role_host_or_player',
      fields: ['role'],
      where: { role: { [Sequelize.Op.in]: ['host', 'player'] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};