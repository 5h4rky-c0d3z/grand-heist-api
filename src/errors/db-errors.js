// Reads the name of the database constraint that an insert, update or delete broke.
// Returns null when the error is not a constraint violation.
const { UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

// Postgres codes: 23505 unique, 23503 foreign key, 23001 restrict
// (a RESTRICT foreign key reports 23001, and Sequelize does not wrap it).
const CONSTRAINT_CODES = ['23505', '23503', '23001'];

function constraintOf(error) {
  if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError) {
    return (error.parent && error.parent.constraint) || error.index || 'unknown';
  }

  const pg = error && (error.parent || error.original);
  if (pg && CONSTRAINT_CODES.includes(pg.code)) {
    return pg.constraint || 'unknown';
  }

  return null;
}

module.exports = { constraintOf };