/* Arabic-first UI text. STR[key] = [arabic, english]; t(key, ...args) fills {0} {1}; nf() writes Arabic-Indic digits in Arabic. */

const LANG = { cur: 'ar' };

const STR = {
  title: ['حسبة برما', 'Hesbet Barma'],
  tag: ['طوب الحساب.. اضرب الإجابة الصح!', 'Math blocks: tap the right answer!'],
  grade: ['إنت في سنة كام؟', 'Pick your grade'],
  m_endless: ['مفتوح', 'Endless'], d_endless: ['العب لحد ما الطوب يوصل للخط', 'Play until the stack hits the line'],
  m_sprint: ['تحدي الدقيقة', 'One-Minute Sprint'], d_sprint: ['٦٠ ثانية.. هات أعلى سكور', '60 seconds. Beat your top score'],
  m_practice: ['تمرين رايق', 'Calm Practice'], d_practice: ['من غير ضغط ولا طوب بيعلّي', 'No pressure, nothing rising'],
  wallet: ['رصيدك:', 'Your coins:'], best: ['الأحسن', 'Best'],
  paused: ['وقفة شاي', 'Tea break'], resume: ['كمّل', 'Resume'], home: ['القائمة', 'Menu'],
  leaveQ: ['تسيب اللعبة؟', 'Leave this game?'], leaveD: ['الجولة هتخلص دلوقتي، والعملات اللي كسبتها هتفضل معاك.', 'This run ends now. The coins you won stay with you.'],
  leaveYes: ['آه، اطلع للقائمة', 'Yes, back to menu'], leaveNo: ['لأ، كمّل لعب', 'No, keep playing'],
  again: ['العب تاني', 'Play again'], newrec: ['رقم قياسي جديد!', 'New record!'],
  over_t: ['الجرس ضرب!', 'The bell rang!'], over_m: ['الطوب وصل للخط الأحمر', 'The blocks hit the red line'],
  time_t: ['خلص الوقت!', 'Time is up!'], time_m: ['دقيقة جامدة يا بطل', 'What a minute, champ'],
  st_ok: ['إجابات صح', 'Correct'], st_combo: ['أعلى كومبو', 'Best combo'], st_coins: ['عملات كسبتها', 'Coins earned'],
  tip: ['اضغط الطوبة اللي فيها الإجابة', 'Tap the block with the answer'],
  lvl: ['مستوى', 'Level'], combo: ['كومبو', 'Combo'], go: ['يلا!', 'Go!'],
  mute: ['اكتم الصوت', 'Mute'], unmute: ['شغّل الصوت', 'Unmute'], snd_on: ['الصوت شغّال', 'Sound on'], snd_off: ['الصوت مكتوم', 'Sound off'],
  pauseL: ['وقفة', 'Pause'], danger: ['حاسب! الطوب قرّب', 'Careful! Blocks are close'], line: ['خط الخطر', 'Danger line'],
  hintU: ['بصّ على الطوبة الدهب!', 'Look at the golden ring!'], freezeU: ['الطوب اتجمّد ٥ ثواني', 'Blocks frozen for 5 s'], bombU: ['بوم! الصف طار', 'Boom! Row cleared'],
  stage0: ['الجمع', 'Adding'], stage1: ['الطرح', 'Subtracting'], stage2: ['الضرب', 'Times'], stage3: ['القسمة', 'Dividing'], stage4: ['تشكيلة', 'Mixed'], stage5: ['الرقم الناقص', 'Missing number'],
  stage2b: ['جمع أكبر', 'Bigger sums'], stage3b: ['طرح أكبر', 'Bigger takeaways'],
  lvlUp: ['مستوى {0}! {1}', 'Level {0}! {1}'], aria: ['لوحة اللعب', 'Game board'], q: ['؟', '?'],
  freezeChip: ['تجميد {0}', 'Freeze {0}'],

  b_daily: ['التحدي', 'Daily'], b_shop: ['المحل', 'Shop'], b_ach: ['الإنجازات', 'Trophies'], b_set: ['الإعدادات', 'Settings'],
  back: ['رجوع', 'Back'], langBtn: ['English', 'عربي'],
  passBtn: ['جرّب كل حاجة ببلاش', 'Try everything free'], passLeft: ['التجربة المجانية: باقي {0}', 'Free pass: {0} left'],
  passDays: ['{0} يوم', '{0} d'], passHours: ['{0} ساعة', '{0} h'],

  set_title: ['الإعدادات', 'Settings'], set_music: ['الموسيقى', 'Music'], set_sfx: ['المؤثرات', 'Effects'],
  set_vibrate: ['الاهتزاز', 'Vibration'], set_vibrate_no: ['الموبايل ده مفيهوش اهتزاز', 'This device has no vibration'],
  set_calm: ['حركة أقل', 'Reduce motion'], set_calm_sub: ['من غير اهتزاز الشاشة ولا نطّ', 'No screen shake or bouncing'],
  set_lang: ['اللغة', 'Language'], set_grade: ['السنة الدراسية', 'School grade'], set_on: ['شغّال', 'On'], set_off: ['مقفول', 'Off'],
  set_reset: ['امسح كل التقدّم', 'Erase all progress'], set_reset_sub: ['العملات والمحل والإنجازات والنقط', 'Coins, shop, trophies and scores'],
  resetTitle: ['تمسح كل التقدّم؟', 'Erase all progress?'],
  resetBody: ['هتتمسح {0} عملة و{1} حاجة من المحل و{2} إنجاز وأعلى النقط. اللغة والإعدادات هتفضل.', 'This deletes {0} coins, {1} shop items, {2} trophies and your best scores. Language and settings stay.'],
  resetBtn: ['امسح كل التقدّم', 'Erase all progress'], cancel: ['لأ، سيبه', 'No, keep it'],
  set_about: ['حسبة برما · لعبة حساب بلدي', 'Hesbet Barma, a homegrown math game'],

  shop_title: ['المحل', 'Shop'], tab_hat: ['قبعات البومة', 'Owl hats'], tab_bag: ['شنط توتو', 'Toto bags'], tab_skin: ['شكل الطوب', 'Block skins'],
  buy: ['اشتري', 'Buy'], wear: ['البس', 'Wear'], worn: ['لابسه', 'Worn'], equipped: ['شغّال', 'In use'], free: ['ببلاش', 'Free'], lent: ['بالتجربة', 'On loan'],
  buyTitle: ['تشتري «{0}»؟', 'Buy "{0}"?'], buyBody: ['هتدفع {0} عملة.', 'It costs {0} coins.'], buyBtn: ['اشتري {0} بـ {1}', 'Buy {0} for {1}'],
  needCoins: ['ناقصك {0} عملة', 'Need {0} more coins'], bought: ['اتشرت: {0}', 'Bought: {0}'],

  daily_title: ['تحدي النهارده', 'Daily challenge'], daily_twist: ['حاجة مختلفة النهارده', "Today's twist"],
  daily_target: ['الهدف: {0} نقطة', 'Target: {0} points'], daily_best: ['أحسن نتيجة النهارده', "Today's best"],
  daily_streak: ['أيام ورا بعض', 'Day streak'], daily_reward: ['الجايزة: {0} عملة', 'Reward: {0} coins'],
  daily_go: ['يلا نبدأ', "Let's go"], daily_again: ['العب تاني', 'Play again'], daily_done: ['اتحل النهارده ✓', 'Solved today ✓'],
  daily_won: ['عدّيت الهدف! +{0} عملة', 'Target reached! +{0} coins'], daily_miss: ['قربت! الهدف {0}', 'Close! Target {0}'],
  daily_secs: ['{0} ثانية', '{0} seconds'], daily_dot: ['تحدي جديد', 'New today'],

  ach_title: ['الإنجازات', 'Trophies'], ach_count: ['{0} من {1}', '{0} of {1}'], ach_new: ['إنجاز جديد!', 'New trophy!'], ach_pays: ['+{0} عملة', '+{0} coins'],
  updateChip: ['في نسخة جديدة', 'A new version is ready'], exitAgain: ['اضغط تاني للخروج', 'Press again to exit']
};

const PRAISE = {
  ar: ['برافو عليك!', 'شاطر يا بطل!', 'حلو أوي!', 'عاش يا وحش!', 'قشطة!', 'يا سلام عليك!', 'ولا أينشتاين!', 'تمام التمام!'],
  en: ['Bravo!', 'Well done, champ!', 'So good!', 'You rock!', 'Smooth!', 'Brilliant!', 'Einstein who?', 'Spot on!']
};
const OOPS = {
  ar: ['ركّز شوية!', 'معلش، جرّب تاني', 'قرّبت.. بس لأ!', 'حسبة برما دي!', 'استهدى بالله وعدّ'],
  en: ['Focus a little!', 'Oops, try again', 'Close.. but no!', 'What a tangle!', 'Breathe and count']
};

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const LI = () => (LANG.cur === 'ar' ? 0 : 1);

/** Digits in the current language. */
const nf = n => { const s = String(n); return LANG.cur === 'ar' ? s.replace(/\d/g, d => ARABIC_DIGITS[d]) : s; };
const fmt = nf;

/** Text for a key, with {0} {1} filled. Unknown keys come back as the key so a typo is visible. */
function t(key, ...args) {
  const row = STR[key];
  const s = row ? row[LI()] : key;
  return s.replace(/\{(\d+)\}/g, (m, i) => (args[i] != null ? args[i] : m));
}

/** A data row (hat, bag, achievement ...) in the current language: name from ar/en, or ar2/en2 for the second line. */
const nameOf = (row, second = false) => (LANG.cur === 'ar' ? (second ? row.ar2 : row.ar) : (second ? row.en2 : row.en));
