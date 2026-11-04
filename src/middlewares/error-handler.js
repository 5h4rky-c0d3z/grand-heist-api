// Last stop for any error thrown in a route. Four arguments = error handler.
// Every error leaves in one shape: { "error": { "code": "...", "message": "..." } }
const { constraintOf } = require('../errors/db-errors');
const constraintMap = require('../errors/constraint-map');

const GENERIC_CONFLICT = {
  status: 409,
  code: 'CONFLICT',
  message: 'That change conflicts with data that already exists.',
};

function errorHandler(err, req, res, next) {
  // 1. A database constraint said no: translate it with the team's map.
  const constraint = constraintOf(err);
  if (constraint) {
    const known = constraintMap[constraint] || GENERIC_CONFLICT;
    return res.status(known.status).json({ error: { code: known.code, message: known.message } });
  }

  // 2. The request body was not valid JSON (thrown by express.json()).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'The request body is not valid JSON.' },
    });
  }

  // 3. An error we threw on purpose (AppError): the client may see it.
  const status = err.status || 500;
  if (status < 500) {
    const body = { code: err.code || 'BAD_REQUEST', message: err.message };
    if (err.details) body.details = err.details;
    return res.status(status).json({ error: body });
  }

  // 4. Anything else is our bug. Full detail to the log, a fixed sentence to the client.
  console.error(err);
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong on the server.' },
  });
}

module.exports = errorHandler;
