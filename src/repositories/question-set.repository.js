const { QuestionSet } = require('../models');

// A host sees only their own sets.
function findAllByHost(hostId) {
  return QuestionSet.findAll({
    where: { host_id: hostId },
    order: [['set_id', 'ASC']],
  });
}

// The admin sees every set.
function findAll() {
  return QuestionSet.findAll({
    order: [['set_id', 'ASC']],
  });
}

// A row, or null.
function findById(id) {
  return QuestionSet.findByPk(id);
}

function create(data) {
  return QuestionSet.create(data);
}

function update(questionSet, changes) {
  return questionSet.update(changes);
}

function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = {
  findAllByHost,
  findAll,
  findById,
  create,
  update,
  remove,
};