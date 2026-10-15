'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      answer_id: {
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
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      choice_index: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('answers', {
      fields: ['player_id', 'question_id'],
      type: 'unique',
      name: 'uq_one_answer_per_question',
    });

    // Composite foreign key to question_choices (question_id, choice_index), raw SQL
    await queryInterface.sequelize.query(
      `ALTER TABLE "answers"
         ADD CONSTRAINT fk_answers_choice
         FOREIGN KEY (question_id, choice_index)
         REFERENCES "question_choices" (question_id, choice_index)
         ON UPDATE CASCADE
         ON DELETE RESTRICT`
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('answers');
  },
};