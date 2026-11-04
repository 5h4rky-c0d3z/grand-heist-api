const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

// Rule: a missing set is 404.
async function findOrFail(id) {
  const questionSet = await questionSetRepository.findById(id);
  if (!questionSet) {
    throw notFound(
      'QUESTION_SET_NOT_FOUND',
      `No question set has the id ${id}.`
    );
  }
  return questionSet;
}

function isOwner(questionSet, user) {
  return questionSet.host_id === user.user_id;
}

// Rule: only the owner (or an admin) may read, change or delete a set.
async function findOwnedOrFail(id, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) {
    throw forbidden('This question set belongs to another host.');
  }
  return questionSet;
}

// A host sees their own sets. The admin sees every set.
function list(user) {
  return questionSetRepository.findAllByHost(user.user_id);
}

function get(id, user) {
  return findOwnedOrFail(id, user);
}

// Rule: the owner is the caller. A client never chooses it.
function create(data, user) {
  return questionSetRepository.create({ ...data, host_id: user.user_id });
}

async function update(id, changes, user) {
  const questionSet = await findOwnedOrFail(id, user);
  return questionSetRepository.update(questionSet, changes);
}

// If a game used this set, the database refuses with a foreign key error.
// The error handler turns it into 409 through constraint-map.js.
async function remove(id, user) {
  const questionSet = await findOwnedOrFail(id, user);
  await questionSetRepository.remove(questionSet);
}

module.exports = { list, get, create, update, remove, findOrFail };