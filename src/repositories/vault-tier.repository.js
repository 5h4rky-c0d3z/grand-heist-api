const { VaultTier } = require('../models');

// A row, or null.
function findByName(tierName) {
  return VaultTier.findOne({ where: { tier_name: tierName } });
}

module.exports = { findByName };