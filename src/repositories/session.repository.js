const { GameSession, QuestionSet } = require('../models');

// A session with its question set loaded (the set tells us the host), or null.
function findByCode(code) {
  return GameSession.findOne({
    where: { join_code: code },
    include: [{ model: QuestionSet, as: 'questionSet' }],
  });
}

// true if this code is already used by any session.
async function codeExists(code) {
  const count = await GameSession.count({ where: { join_code: code } });
  return count > 0;
}

function create(data) {
  return GameSession.create(data);
}

function update(session, changes) {
  return session.update(changes);
}

module.exports = { findByCode, codeExists, create, update };