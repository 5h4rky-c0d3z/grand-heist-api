'use strict';

/** Questions of a set. Deleting the set removes its questions. */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'set_id' },
        onDelete: 'CASCADE',
      },
      question_text: { type: Sequelize.STRING(500), allowNull: false },
      question_type: { type: Sequelize.STRING(20), allowNull: false },
      correct_index: { type: Sequelize.SMALLINT, allowNull: false },
      time_limit_sec: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 20 },
    });

    await queryInterface.addConstraint('questions', {
      type: 'check',
      name: 'ck_questions_type_known',
      fields: ['question_type'],
      where: { question_type: { [Sequelize.Op.in]: ['MULTIPLE_CHOICE', 'TRUE_FALSE'] } },
    });

    await queryInterface.addConstraint('questions', {
      type: 'check',
      name: 'ck_questions_correct_index_range',
      fields: ['correct_index'],
      where: { correct_index: { [Sequelize.Op.between]: [0, 3] } },
    });

    await queryInterface.addConstraint('questions', {
      type: 'check',
      name: 'ck_questions_time_limit_positive',
      fields: ['time_limit_sec'],
      where: { time_limit_sec: { [Sequelize.Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};