const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');

function toJson(player) {
  return {
    player_id: player.player_id,
    nickname: player.nickname,
    score: player.final_score,
    status: player.status,
  };
}

async function join(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { nickname } = matchedData(req, { locations: ['body'] });
  const { session, player, created } =
    await playerService.join(code, nickname, req.user);

  res.status(created ? 201 : 200).json({
    ...toJson(player),
    rejoined: !created,
    session: { code: session.join_code, status: session.status },
  });
}

async function list(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const players = await playerService.list(code);
  res.status(200).json(players.map(toJson));
}

module.exports = { join, list };