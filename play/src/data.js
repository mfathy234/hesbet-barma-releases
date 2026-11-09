/* All tuning for Hesbet Barma lives here: board size, grades, rising speed, power-ups, scoring, shop items, daily challenge, achievements. */

const SAVE_KEY = 'hesba.save.v1';
const COLS = 6;
const READY_SECONDS = 1.1;
const SPRINT_SECONDS = 60;
const LEVEL_EVERY = 6;

/** Number ranges per grade: A = biggest addend/minuend, M = biggest times-table factor (0 = no times or division yet). */
const GRADES = [{ A: 10, M: 0 }, { A: 20, M: 0 }, { A: 50, M: 5 }, { A: 100, M: 9 }, { A: 200, M: 10 }, { A: 300, M: 12 }, { A: 500, M: 15 }];
const GRADE_LABELS = { ar: ['كي جي', 'أولى', 'تانية', 'تالتة', 'رابعة', 'خامسة', 'سادسة'], en: ['KG', '1', '2', '3', '4', '5', '6'] };
const DEFAULT_GRADE = 2;
const LEVEL_RAMP = { start: 0.45, step: 0.09 };
const MAX_STAGE = 5;

/** Seconds per rising row: base minus step per level, never below min. */
const RISE = {
  endless: { base: 7, step: 0.55, min: 1.6 },
  sprint: { base: 5.2, step: 0.4, min: 1.5 },
  daily: { base: 5.2, step: 0.4, min: 1.5 },
  penaltyRows: 2,
  penaltySpeed: 4,
  dangerRows: 3
};

const POWER = { chance: 0.12, max: 2, hint: 0.4, freeze: 0.3, freezeSeconds: 5, hintSeconds: 9, spareChance: 0.1, matchChance: 0.4 };
const SCORE = { base: 10, comboEvery: 4, bomb: 5 };
const COINS = { perCombo: 3, comboEvery: 5 };

const BLOCK_COLORS = {
  classic: { cols: ['#ee5a45', '#ffcb2e', '#4aa8e8', '#55b948', '#9b62d0'], dark: ['#c43a28', '#d9a400', '#2f86c4', '#3a9230', '#7a46ad'] },
  pastel: { cols: ['#f7a399', '#ffe08a', '#9fd3f5', '#a9dc9f', '#cfa8ec'], dark: ['#e08a80', '#e6c36a', '#82b9de', '#8ec283', '#b48ad4'] },
  dusk: { cols: ['#b83a2e', '#c99512', '#2a6c9e', '#2f7a2c', '#6a3a9a'], dark: ['#8c2a20', '#9a700a', '#1d4f75', '#205a1e', '#4e2873'] }
};
const POWER_COLORS = { hint: ['#ffd23f', '#b98400'], freeze: ['#bfe6fa', '#7fb9dd'], bomb: ['#5d6a96', '#3d4872'] };

/** Cosmetics. price 0 = owned from the start. palette picks BLOCK_COLORS, pattern is drawn over the block. */
const HATS = [
  { id: 'fez', ar: 'الطربوش', en: 'Tarboosh', price: 0 },
  { id: 'grad', ar: 'قبعة التخرج', en: 'Graduation cap', price: 90 },
  { id: 'chef', ar: 'طاقية الشيف', en: 'Chef hat', price: 110 },
  { id: 'party', ar: 'قبعة الحفلة', en: 'Party hat', price: 130 },
  { id: 'crown', ar: 'التاج', en: 'Crown', price: 220 },
  { id: 'nemes', ar: 'غطاء الفرعون', en: 'Pharaoh headcloth', price: 300 }
];
const BAGS = [
  { id: 'red', ar: 'الشنطة الحمرا', en: 'Red bag', price: 0, col: '#ee5a45', patch: 'dot' },
  { id: 'sky', ar: 'شنطة سماوي', en: 'Sky bag', price: 60, col: '#4aa8e8', patch: 'dot' },
  { id: 'leaf', ar: 'شنطة خضرا', en: 'Green bag', price: 60, col: '#55b948', patch: 'stripe' },
  { id: 'grape', ar: 'شنطة موف', en: 'Purple bag', price: 80, col: '#9b62d0', patch: 'star' },
  { id: 'gold', ar: 'شنطة دهب', en: 'Golden bag', price: 200, col: '#f5b800', patch: 'star' }
];
const SKINS = [
  { id: 'classic', ar: 'الطوب العادي', en: 'Classic blocks', price: 0, palette: 'classic', pattern: '' },
  { id: 'pastel', ar: 'طوب باستيل', en: 'Pastel blocks', price: 100, palette: 'pastel', pattern: '' },
  { id: 'dots', ar: 'طوب منقط', en: 'Polka-dot blocks', price: 120, palette: 'classic', pattern: 'dots' },
  { id: 'stripes', ar: 'طوب مقلّم', en: 'Striped blocks', price: 140, palette: 'classic', pattern: 'stripes' },
  { id: 'dusk', ar: 'طوب الغروب', en: 'Dusk blocks', price: 180, palette: 'dusk', pattern: '' }
];
const SHOP_KINDS = ['hat', 'bag', 'skin'];
const SHOP_ITEMS = { hat: HATS, bag: BAGS, skin: SKINS };
const DEFAULTS = { hat: 'fez', bag: 'red', skin: 'classic' };

/** Quick pass: everything free for a while. Nothing is granted for good. */
const PASS = { hours: 48 };

/** Daily challenge: a seeded 75 s run with one twist and a target score for the player's grade. */
const DAILY = {
  seconds: 75, reward: 60, streakBonus: 15, streakCap: 7, keepBests: 30,
  targetByGrade: [120, 160, 220, 260, 300, 340, 380],
  twists: [
    { id: 'swift', ar: 'الطوب مستعجل', en: 'Hurry blocks', riseMult: 0.7 },
    { id: 'sums', ar: 'جمع وطرح بس', en: 'Plus and minus only', ops: ['+', '−'] },
    { id: 'times', ar: 'يوم الضرب والقسمة', en: 'Times and divide day', ops: ['×', '÷'], needM: true },
    { id: 'gifts', ar: 'يوم الهدايا', en: 'Gift day', powerMult: 3 },
    { id: 'big', ar: 'أرقام كبيرة', en: 'Big numbers', gradeShift: 1 },
    { id: 'calm', ar: 'يوم رايق', en: 'Easy-going day', riseMult: 1.4 }
  ]
};

const BOARD = { minRows: 8, maxRows: 10, minCell: 24, pad: 12 };

/** Achievements: `stat` is a key of save.meta.stats (or 'run:<key>' for the last run), n is the goal. */
const ACHIEVEMENTS = [
  { id: 'first', ar: 'أول إجابة', en: 'First answer', ar2: 'جاوب أول إجابة صح', en2: 'Get your first answer right', stat: 'correct', n: 1, coins: 10 },
  { id: 'c100', ar: 'مية إجابة', en: 'Hundred right', ar2: 'مية إجابة صح', en2: '100 correct answers in total', stat: 'correct', n: 100, coins: 40 },
  { id: 'c1000', ar: 'ألف إجابة', en: 'Thousand right', ar2: 'ألف إجابة صح', en2: '1000 correct answers in total', stat: 'correct', n: 1000, coins: 150 },
  { id: 'combo5', ar: 'كومبو ٥', en: 'Combo 5', ar2: 'خمس إجابات ورا بعض', en2: '5 right in a row', stat: 'maxCombo', n: 5, coins: 20 },
  { id: 'combo12', ar: 'كومبو ١٢', en: 'Combo 12', ar2: 'اتنا عشر إجابة ورا بعض', en2: '12 right in a row', stat: 'maxCombo', n: 12, coins: 60 },
  { id: 'level5', ar: 'مستوى ٥', en: 'Level 5', ar2: 'وصّل للمستوى الخامس', en2: 'Reach level 5 in a run', stat: 'maxLevel', n: 5, coins: 30 },
  { id: 'level10', ar: 'مستوى ١٠', en: 'Level 10', ar2: 'وصّل للمستوى العاشر', en2: 'Reach level 10 in a run', stat: 'maxLevel', n: 10, coins: 90 },
  { id: 'score500', ar: '٥٠٠ نقطة', en: '500 points', ar2: 'هات ٥٠٠ نقطة في لعبة', en2: 'Score 500 in one run', stat: 'maxScore', n: 500, coins: 50 },
  { id: 'score2000', ar: '٢٠٠٠ نقطة', en: '2000 points', ar2: 'هات ٢٠٠٠ نقطة في لعبة', en2: 'Score 2000 in one run', stat: 'maxScore', n: 2000, coins: 150 },
  { id: 'bomb', ar: 'بوم!', en: 'Boom!', ar2: 'فجّر صف بالقنبلة', en2: 'Blow up a row with a bomb', stat: 'bombs', n: 1, coins: 15 },
  { id: 'chain', ar: 'سلسلة طوب', en: 'Chain reaction', ar2: 'اضرب ٥ طوبات مرة واحدة', en2: 'Clear 5 blocks with one tap', stat: 'maxChain', n: 5, coins: 40 },
  { id: 'daily', ar: 'لغز النهارده', en: 'Daily done', ar2: 'خلّص تحدي النهارده', en2: 'Reach the daily target', stat: 'dailyWins', n: 1, coins: 40 },
  { id: 'streak3', ar: 'ثلاث أيام', en: 'Three-day streak', ar2: 'خلّص التحدي ٣ أيام ورا بعض', en2: 'Win the daily 3 days in a row', stat: 'bestStreak', n: 3, coins: 80 },
  { id: 'shopper', ar: 'زبون جديد', en: 'New customer', ar2: 'اشتري حاجة من المحل', en2: 'Buy something in the shop', stat: 'bought', n: 1, coins: 20 },
  { id: 'rich', ar: 'معاك فلوس', en: 'Pocket money', ar2: 'اكسب ٥٠٠ عملة', en2: 'Earn 500 coins in total', stat: 'coinsEarned', n: 500, coins: 60 },
  { id: 'runs20', ar: 'مذاكرة كل يوم', en: 'Study habit', ar2: 'العب ٢٠ لعبة', en2: 'Play 20 runs', stat: 'runs', n: 20, coins: 50 }
];

const START_ROWS = 3;

const HESBA_DATA = {
  SAVE_KEY, COLS, READY_SECONDS, SPRINT_SECONDS, LEVEL_EVERY, GRADES, GRADE_LABELS, DEFAULT_GRADE, LEVEL_RAMP, MAX_STAGE, RISE, POWER, SCORE, COINS,
  BLOCK_COLORS, POWER_COLORS, HATS, BAGS, SKINS, SHOP_KINDS, SHOP_ITEMS, DEFAULTS, PASS, DAILY, BOARD, ACHIEVEMENTS, START_ROWS
};
if (typeof module !== 'undefined' && module.exports) module.exports = HESBA_DATA;
