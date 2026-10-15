// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'grand-heist',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'Grand Heist',            // the name players will see
  team: 'Team 8 (3-2)',            // your group's name and section, for example Bookworms (3-1)
  developer: '5h4rky-c0d3z',       // YOUR GitHub username: this build is yours
  description: 'My build for a strategic, push-your-luck trivia heist game; Grand Heist for CS 313.',     // one sentence about how the game is played
  min_players: 1,               // change to the limits your game is designed for
  max_players: 30,
  version: pkg.version,         // read from package.json, do not edit here
};
