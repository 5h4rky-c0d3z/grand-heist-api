'use strict';

/**
 * demo-heist-data: seeds every table except users (see demo-users).
 * One transaction, parents first. No IDs are typed: every ID is asked from the DB.
 * All data is fictitious.
 */

const NAMES = [
  'Coin Pouch', 'Stealth Tonic', 'Loot Box', 'Vault Shield',
  'Double Take', 'Pickpocket', 'Anti-Debuff Potion', 'Reversal',
];

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;
    const t = await db.transaction();
    const at = (hms) => new Date(`2026-10-06T${hms}Z`);

    // ask the database for one row; fail loudly if it is missing
    const find = async (sql, replacements = {}) => {
      const [rows] = await db.query(sql, { transaction: t, replacements });
      if (!rows.length) throw new Error(`Seeder lookup found nothing: ${sql}`);
      return rows[0];
    };
    const insert = (table, rows) => queryInterface.bulkInsert(table, rows, { transaction: t });

    try {
      // ===== PART 1: vault tiers, question set, questions, choices =====

      // 1. vault_tiers (values from the design doc, Section 2.4)
      await insert('vault_tiers', [
        { tier_name: 'EASY',   coin_multiplier: 1.0, stealth_penalty: 10, loot_rate: 1.0, unlock_threshold: 0 },
        { tier_name: 'NORMAL', coin_multiplier: 1.5, stealth_penalty: 20, loot_rate: 1.5, unlock_threshold: 3 },
        { tier_name: 'HARD',   coin_multiplier: 2.0, stealth_penalty: 35, loot_rate: 2.0, unlock_threshold: 3 },
      ]);
      const tier = {};
      for (const name of ['EASY', 'NORMAL', 'HARD']) {
        tier[name] = (await find('SELECT tier_id FROM vault_tiers WHERE tier_name = :name', { name })).tier_id;
      }

      // 2. question_sets (owned by the host 2099-0001)
      const host = await find("SELECT user_id FROM users WHERE school_id = '2099-0001'");
      await insert('question_sets', [{ host_id: host.user_id, title: 'Philippine Literature' }]);
      const set = await find("SELECT set_id FROM question_sets WHERE title = 'Philippine Literature'");

      // 3. questions + 4. question_choices
      const questions = [
        { no: 1, text: 'Who wrote Noli Me Tangere?', type: 'MULTIPLE_CHOICE', correct: 2, limit: 20,
          choices: ['Andres Bonifacio', 'Emilio Aguinaldo', 'Jose Rizal', 'Apolinario Mabini'] },
        { no: 2, text: 'Noli Me Tangere was first published in 1887.', type: 'TRUE_FALSE', correct: 0, limit: 15,
          choices: ['True', 'False'] },
        { no: 3, text: 'El Filibusterismo is the sequel to which novel?', type: 'MULTIPLE_CHOICE', correct: 0, limit: 20,
          choices: ['Noli Me Tangere', 'Florante at Laura', 'Ibong Adarna', "Dekada '70"] },
        { no: 4, text: 'Which epic comes from the Bicol region?', type: 'MULTIPLE_CHOICE', correct: 2, limit: 20,
          choices: ['Hudhud', 'Darangen', 'Ibalong', 'Biag ni Lam-ang'] },
        { no: 5, text: 'Who wrote Florante at Laura?', type: 'MULTIPLE_CHOICE', correct: 0, limit: 20,
          choices: ['Francisco Balagtas', 'Jose Rizal', 'Lope K. Santos', 'Nick Joaquin'] },
      ];
      await insert('questions', questions.map((q) => ({
        set_id: set.set_id, question_text: q.text, question_type: q.type,
        correct_index: q.correct, time_limit_sec: q.limit,
      })));
      for (const q of questions) {
        q.id = (await find(
          'SELECT question_id FROM questions WHERE set_id = :setId AND question_text = :text',
          { setId: set.set_id, text: q.text },
        )).question_id;
      }
      await insert('question_choices', questions.flatMap((q) =>
        q.choices.map((choice_text, choice_index) => ({ question_id: q.id, choice_index, choice_text }))));
      const qByNo = Object.fromEntries(questions.map((q) => [q.no, q]));

      // ===== PART 2: equipment and its five subtype tables =====

      // 5. equipment (catalogue, design doc Table 1)
      await insert('equipment', [
        { name: 'Coin Pouch',         equipment_type: 'BENEFICIAL', price: 100, sell_value: 50 },
        { name: 'Stealth Tonic',      equipment_type: 'BENEFICIAL', price: 120, sell_value: 60 },
        { name: 'Loot Box',           equipment_type: 'BENEFICIAL', price: 100, sell_value: 50 },
        { name: 'Vault Shield',       equipment_type: 'DEFENSE',    price: 150, sell_value: 75 },
        { name: 'Double Take',        equipment_type: 'BUFF',       price: 200, sell_value: 100 },
        { name: 'Pickpocket',         equipment_type: 'SABOTAGE',   price: 180, sell_value: 90 },
        { name: 'Anti-Debuff Potion', equipment_type: 'SPECIAL',    price: 120, sell_value: 60 },
        { name: 'Reversal',           equipment_type: 'SPECIAL',    price: 160, sell_value: 80 },
      ]);
      const eq = {};
      for (const name of NAMES) {
        eq[name] = (await find('SELECT equipment_id FROM equipment WHERE name = :name', { name })).equipment_id;
      }

      // 6. subtype tables (share the equipment key)
      await insert('beneficial_items', [
        { equipment_id: eq['Coin Pouch'],    benefit_kind: 'COINS',    amount: 150 },
        { equipment_id: eq['Stealth Tonic'], benefit_kind: 'STEALTH',  amount: 20 },
        { equipment_id: eq['Loot Box'],      benefit_kind: 'LOOT_BOX', amount: 200 }, // top of the 50-200 range
      ]);
      await insert('defense_items', [
        { equipment_id: eq['Vault Shield'], max_charges: 1, blocks_kind: 'PICKPOCKET' },
      ]);
      await insert('buff_items', [
        { equipment_id: eq['Double Take'], effect_type: 'COIN_MULTIPLIER', modifier: 2.0, duration_questions: 3 },
      ]);
      await insert('sabotage_items', [
        { equipment_id: eq['Pickpocket'], sabotage_kind: 'PICKPOCKET', percent: 15 },
      ]);
      await insert('special_items', [
        { equipment_id: eq['Anti-Debuff Potion'], special_kind: 'ANTI_DEBUFF' },
        { equipment_id: eq['Reversal'],           special_kind: 'REVERSAL' },
      ]);

      // ===== PART 3: the finished session and its four players =====

      // 7. sessions: one game that has ENDED, with started_at and ended_at filled
      await insert('sessions', [{
        join_code: '482913', set_id: set.set_id, status: 'ended',
        started_at: at('14:05:00'), ended_at: at('14:40:00'),
      }]);
      const session = await find("SELECT session_id FROM sessions WHERE join_code = '482913'");

      // 8. players: one seat per account. 2099-0006 never joins (awkward case).
      const seats = [
        { school: '2099-0002', nickname: 'Kuya_Jun',  coins: 350, stealth: 70,  status: 'escaped', tier: 'NORMAL', inTier: 2, score: 350 },
        { school: '2099-0003', nickname: 'Ate_Mia',   coins: 350, stealth: 90,  status: 'escaped', tier: 'NORMAL', inTier: 1, score: 350 }, // ties Jun; left early
        { school: '2099-0004', nickname: 'Bookworm',  coins: 200, stealth: 100, status: 'escaped', tier: 'EASY',   inTier: 2, score: 200 },
        { school: '2099-0005', nickname: 'Bert',      coins: 100, stealth: 0,   status: 'busted',  tier: 'HARD',   inTier: 2, score: 0 },   // did not complete
      ];
      const rows = [];
      for (const s of seats) {
        const u = await find('SELECT user_id FROM users WHERE school_id = :school', { school: s.school });
        rows.push({
          session_id: session.session_id, user_id: u.user_id, nickname: s.nickname,
          coins: s.coins, stealth: s.stealth, status: s.status, tier_id: tier[s.tier],
          answered_in_tier: s.inTier, final_score: s.score,
          current_question_id: null, question_served_at: null,
        });
      }
      await insert('players', rows);
      const player = {};
      for (const s of seats) {
        player[s.nickname] = (await find(
          'SELECT player_id FROM players WHERE session_id = :sid AND nickname = :nick',
          { sid: session.session_id, nick: s.nickname },
        )).player_id;
      }

      // ===== PART 4: answers, rewards, inventory, effects, shop =====

      // 9. answers, 10. reward_offers, 11. reward_offer_options
      // (a correct answer earns one offer with 3 different options)
      let offerNo = 0;
      const answer = async (nick, qNo, choice, time) => {
        const q = qByNo[qNo];
        const isCorrect = choice === q.correct;
        await insert('answers', [{
          player_id: player[nick], question_id: q.id, choice_index: choice,
          is_correct: isCorrect, submitted_at: at(time),
        }]);
        if (!isCorrect) return;
        const a = await find(
          'SELECT answer_id FROM answers WHERE player_id = :p AND question_id = :q',
          { p: player[nick], q: q.id },
        );
        await insert('reward_offers', [{ answer_id: a.answer_id, created_at: at(time), is_chosen: offerNo % 4 !== 3 }]);
        const offer = await find('SELECT offer_id FROM reward_offers WHERE answer_id = :a', { a: a.answer_id });
        await insert('reward_offer_options', [1, 2, 3].map((option_index) => ({
          offer_id: offer.offer_id, option_index,
          equipment_id: eq[NAMES[(offerNo + option_index) % NAMES.length]],
        })));
        offerNo += 1;
      };

      // Kuya_Jun: matches the design doc worked example (350 coins, Stealth 70)
      await answer('Kuya_Jun', 1, 2, '14:06:12'); // correct
      await answer('Kuya_Jun', 2, 1, '14:06:31'); // wrong
      await answer('Kuya_Jun', 3, 0, '14:07:05'); // correct
      await answer('Kuya_Jun', 4, 2, '14:08:10'); // correct (Normal vault)
      await answer('Kuya_Jun', 5, 1, '14:09:00'); // wrong
      // Ate_Mia: same path as Jun, escapes after 4 answers (350 coins, ties Jun)
      await answer('Ate_Mia', 1, 2, '14:06:20');
      await answer('Ate_Mia', 2, 1, '14:06:50');
      await answer('Ate_Mia', 3, 0, '14:07:30');
      await answer('Ate_Mia', 4, 2, '14:08:40');
      // Bookworm: completes all five questions, then escapes in the Easy vault
      await answer('Bookworm', 1, 2, '14:06:40'); // correct
      await answer('Bookworm', 2, 0, '14:07:10'); // correct
      await answer('Bookworm', 3, 0, '14:07:40'); // correct
      await answer('Bookworm', 4, 2, '14:08:10'); // correct
      await answer('Bookworm', 5, 0, '14:08:40'); // correct
      // Bert: one correct answer, then wrong answers until busted
      await answer('Bert', 1, 2, '14:06:15');
      await answer('Bert', 2, 1, '14:06:45');
      await answer('Bert', 3, 3, '14:07:20');
      await answer('Bert', 4, 0, '14:08:00');
      await answer('Bert', 5, 2, '14:08:50');

      // 12. inventory_items (slots 1-3, at most 2 Defense items)
      await insert('inventory_items', [
        { player_id: player['Kuya_Jun'], equipment_id: eq['Vault Shield'], slot_no: 1, acquired_at: at('14:06:20'), armed_at: null, charges_left: 1 },
        { player_id: player['Ate_Mia'],  equipment_id: eq['Pickpocket'],   slot_no: 1, acquired_at: at('14:07:35'), armed_at: null, charges_left: 1 },
      ]);

      // 13. status_effects
      await insert('status_effects', [
        { player_id: player['Bert'], effect_type: 'CURSED', magnitude: 1.0, questions_left: 1 },
      ]);

      // 14. shop_listings (Black Market stock for this session)
      await insert('shop_listings', [
        { session_id: session.session_id, equipment_id: eq['Coin Pouch'],    stock: 5 },
        { session_id: session.session_id, equipment_id: eq['Stealth Tonic'], stock: 5 },
        { session_id: session.session_id, equipment_id: eq['Vault Shield'],  stock: 3 },
        { session_id: session.session_id, equipment_id: eq['Double Take'],   stock: 2 },
      ]);

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const del = (table, where) => queryInterface.bulkDelete(table, where, { transaction: t });
      // the session cascades to players, answers, offers, options, inventory, effects, listings
      await del('sessions', { join_code: '482913' });
      // equipment cascades to its subtype tables (children are gone, so RESTRICT is satisfied)
      await del('equipment', { name: NAMES });
      // the question set cascades to questions and choices
      await del('question_sets', { title: 'Philippine Literature' });
      await del('vault_tiers', { tier_name: ['EASY', 'NORMAL', 'HARD'] });
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
};