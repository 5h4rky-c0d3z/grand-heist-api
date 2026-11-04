const sessionRepository = require('../repositories/session.repository');
const questionSetService = require('./question-set.service');
const { notFound, forbidden, conflict } = require('../errors/app-error');

const MAX_CODE_TRIES = 10;

// Rule: the server makes the six-digit code (no leading 0). A client never chooses it.
async function generateCode() {
  for (let i = 0; i < MAX_CODE_TRIES; i += 1) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    // eslint-disable-next-line no-await-in-loop
    if (!(await sessionRepository.codeExists(code))) return code;
  }
  throw new Error('Could not generate a free join code.');
}

// Rule: a missing game is 404.
async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No game has the code ${code}.`);
  }
  return session;
}

// A game belongs to the host who owns its question set.
function isOwner(session, user) {
  return session.questionSet.host_id === user.user_id;
}

// Rule: only the owner of the question set may start a game with it.
async function create(data, user) {
  const questionSet = await questionSetService.findOrFail(data.set_id);
  if (questionSet.host_id !== user.user_id) {
    throw forbidden('This question set belongs to another host.');
  }
  const code = await generateCode();
  const session = await sessionRepository.create({
    join_code: code,
    set_id: questionSet.set_id,
    status: 'waiting',
  });
  return findOrFail(session.join_code);
}

function get(code) {
  return findOrFail(code);
}

// Allowed changes: waiting -> playing, playing -> ended, waiting -> ended.
// Anything else (including from 'ended') is well formed but not possible now: 409.
const ALLOWED = {
  waiting: ['playing', 'ended'],
  playing: ['ended'],
  ended: [],
};

// Rule: only the owner may change the status.
async function changeStatus(code, newStatus, user) {
  const session = await findOrFail(code);
  if (!isOwner(session, user)) {
    throw forbidden('This game belongs to another host.');
  }
  if (!ALLOWED[session.status].includes(newStatus)) {
    throw conflict(
      'INVALID_STATUS_CHANGE',
      `A game that is ${session.status} cannot become ${newStatus}.`
    );
  }
  const changes = { status: newStatus };
  if (newStatus === 'playing') changes.started_at = new Date();
  if (newStatus === 'ended') changes.ended_at = new Date();
  await sessionRepository.update(session, changes);
  return session;
}

module.exports = { findOrFail, create, get, changeStatus };