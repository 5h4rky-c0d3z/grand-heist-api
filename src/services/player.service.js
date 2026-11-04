const sessionService = require('./session.service');
const playerRepository = require('../repositories/player.repository');
const vaultTierRepository = require('../repositories/vault-tier.repository');
const { conflict } = require('../errors/app-error');
const { max_players: MAX_PLAYERS } = require('../config/game-info');

// Join, or rejoin. The order of the checks is part of the design:
// the first "no" decides the answer.
async function join(code, nickname, user) {
  // Q3: the game must exist (404).
  const session = await sessionService.findOrFail(code);

  // Q4: rejoin. This account already has a seat: same row, same score.
  const seat = await playerRepository.findSeat(session.session_id, user.user_id);
  if (seat) return { session, player: seat, created: false };

  // Q5: one game at a time (Hub Contract v1.2).
  const elsewhere = await playerRepository.findPlayingSeatElsewhere(
    user.user_id,
    session.session_id
  );
  if (elsewhere) {
    throw conflict(
      'ALREADY_IN_GAME',
      'You are still playing another game. Finish it first.'
    );
  }

  // Q6: a new seat is only possible in the lobby.
  if (session.status === 'ended') {
    throw conflict('SESSION_ENDED', 'This game has ended.');
  }
  if (session.status !== 'waiting') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }

  // Q7: room left?
  const seatsTaken = await playerRepository.countBySession(session.session_id);
  if (seatsTaken >= MAX_PLAYERS) {
    throw conflict('SESSION_FULL', 'This game is full.');
  }

  // Q8 (nickname free?) is asked by the database: uq_player_nickname.
  const tier = await vaultTierRepository.findByName('EASY');
  if (!tier) throw new Error('Seed data is missing the EASY vault tier.');

  try {
    const player = await playerRepository.create({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
      tier_id: tier.tier_id,
    });
    return { session, player, created: true };
  } catch (err) {
    // Two joins from the same account at the same instant: the second one
    // hits uq_one_seat. That is a rejoin, not an error.
    if (err.parent && err.parent.constraint === 'uq_one_seat') {
      const existing = await playerRepository.findSeat(session.session_id, user.user_id);
      if (existing) return { session, player: existing, created: false };
    }
    throw err;
  }
}

async function list(code) {
  const session = await sessionService.findOrFail(code);
  return playerRepository.findAllBySession(session.session_id);
}

module.exports = { join, list };