'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reward_offers', {
      offer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      answer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'answers', key: 'answer_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      is_chosen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    await queryInterface.addConstraint('reward_offers', {
      fields: ['answer_id'],
      type: 'unique',
      name: 'uq_reward_offers_answer',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reward_offers');
  },
};