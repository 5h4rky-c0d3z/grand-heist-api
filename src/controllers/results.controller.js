// Translates between HTTP and the service. No SQL, no business rules.
const { matchedData } = require('express-validator');
const gameInfo = require('../config/game-info');
const resultsService = require('../services/results.service');

async function getResults(req, res) {
  const { since } = matchedData(req, { locations: ['query'] });

  const results = await resultsService.listFinishedGames(since || null);

  res.status(200).json({
    game: gameInfo.slug,
    developer: gameInfo.developer,
    generated_at: new Date().toISOString(),
    results,
  });
}

module.exports = { getResults };