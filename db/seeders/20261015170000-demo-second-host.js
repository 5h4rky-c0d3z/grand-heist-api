'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0007', username: 'host2.demo', full_name: 'Second Host Demo', email: 'host2.demo@demo.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'host' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2099-0007' }, {});
  },
};  