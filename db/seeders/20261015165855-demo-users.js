'use strict';

const SCHOOL_IDS = ['2099-0001', '2099-0002', '2099-0003', '2099-0004', '2099-0005', '2099-0006'];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0001', username: 'lib.bulan', full_name: 'Demo Librarian', email: 'lib.bulan@demo.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'host' },
      { school_id: '2099-0002', username: 'jun.demo', full_name: 'Jun Demo', email: 'jun.demo@demo.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
      { school_id: '2099-0003', username: 'mia.demo', full_name: 'Mia Demo', email: 'mia.demo@demo.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
      { school_id: '2099-0004', username: 'bookworm.demo', full_name: 'Bookworm Demo', email: 'bookworm.demo@demo.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
      { school_id: '2099-0005', username: 'bert.demo', full_name: 'Bert Demo', email: 'bert.demo@demo.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
      // awkward case: an account that never joined any game
      { school_id: '2099-0006', username: 'idle.demo', full_name: 'Idle Demo', email: 'idle.demo@demo.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: SCHOOL_IDS }, {});
  },
};