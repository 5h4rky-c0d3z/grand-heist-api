const { User } = require('../models');

function findBySchoolId(schoolId) {
  return User.findOne({ where: { school_id: schoolId } });
}

module.exports = { findBySchoolId };
