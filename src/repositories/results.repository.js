// Hub Contract rule 7: one row per player per FINISHED game.
// A game is finished when sessions.status = 'ended'.
// A player "completed" the game when their status is 'escaped'
// (they got out of the vault; 'busted' players did not complete).

'use strict';

const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT
      s.join_code AS session_code,
      s.started_at,
      s.ended_at,
      u.school_id,
      p.nickname,
      p.final_score AS score,
      (p.status = 'escaped') AS completed
    FROM sessions s
    JOIN players p
      ON p.session_id = s.session_id
    JOIN users u
      ON u.user_id = p.user_id
    WHERE s.status = 'ended'
      AND s.ended_at IS NOT NULL
      AND (
        CAST(:since AS timestamptz) IS NULL
        OR s.ended_at > CAST(:since AS timestamptz)
      )
    ORDER BY s.ended_at, p.final_score DESC;
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: {
      since: since ? new Date(since).toISOString() : null,
    },
  });
}

module.exports = { findFinishedGamePlayers };