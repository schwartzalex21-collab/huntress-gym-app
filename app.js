// =================== STATE ===================
let state = {
  profile: { name: 'Hunter', photo: null, age: '', weight: '', height: '', goals: [] },
  workouts: {},
  customExercises: {},
  system: {
    xp: 0,
    level: 1,
    perfectStreak: 0,
    lastPerfectDate: null,
    lastCheckDate: null,
    shields: 0,
    bonusCompletedTotal: 0,
    bossesCompletedTotal: 0,
    streakRecomputedV1: false
  },
  stats: {
    STR: { level: 1, xp: 0 },
    END: { level: 1, xp: 0 },
    MND: { level: 1, xp: 0 },
    WIL: { level: 1, xp: 0 }
  },
  habits: {},
  bonusMissions: { date: null, missions: [] },
  boss: { weekStart: null, date: null, missionId: null, completed: false, expired: false },
  achievements: {},
  weeklyReport: { lastShown: null },
  settings: { barWeight: 20 }
};

let currentPage = 'home';
let currentWorkoutDate = null;
let currentDayKey = null;
let activeQuestId = null;

// =================== STORAGE ===================
const STORAGE_KEY = 'huntress_app_v1';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state = {
        ...state, ...parsed,
        profile: { ...state.profile, ...(parsed.profile || {}) },
        system: { ...state.system, ...(parsed.system || {}) },
        stats: {
          STR: { ...state.stats.STR, ...(parsed.stats?.STR || {}) },
          END: { ...state.stats.END, ...(parsed.stats?.END || {}) },
          MND: { ...state.stats.MND, ...(parsed.stats?.MND || {}) },
          WIL: { ...state.stats.WIL, ...(parsed.stats?.WIL || {}) }
        },
        bonusMissions: { ...state.bonusMissions, ...(parsed.bonusMissions || {}) },
        boss: { ...state.boss, ...(parsed.boss || {}) },
        achievements: { ...(parsed.achievements || {}) },
        weeklyReport: { ...state.weeklyReport, ...(parsed.weeklyReport || {}) },
        settings: { ...state.settings, ...(parsed.settings || {}) }
      };
      if (!state.customExercises) state.customExercises = {};
      if (!state.habits) state.habits = {};
    }
  } catch (e) { console.error('Load error:', e); }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) {
    if (e.name === 'QuotaExceededError') showToast('❌ Spațiu insuficient!');
    else showToast('❌ Eroare la salvare!');
  }
}

// =================== HELPERS ===================
function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function todayKey() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function dateKey(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function addDaysKey(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return dateKey(dt);
}
function dayOfWeek(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}
function formatDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const days = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
  const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'];
  return `${days[dt.getDay()]}, ${dt.getDate()} ${months[dt.getMonth()]}`;
}
function formatDateShort(s) {
  const [y, m, d] = s.split('-').map(Number);
  return `${String(d).padStart(2,'0')}.${String(m).padStart(2,'0')}.${String(y).slice(2)}`;
}
function showToast(msg) {
  let c = document.querySelector('.toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
function vibrate(p) { if (navigator.vibrate) navigator.vibrate(p); }

// =================== QUESTS (daily) — FĂRĂ Wim Hof / Cold ===================
const QUESTS = {
  morning_routine: {
    id: 'morning_routine',
    name: 'Rutină Matinală',
    xp: 30,
    icon: '☀️',
    stat: 'END',
    instruction: 'Trezire, 500ml apă, 5-10 min stretching ușor + 5 respirații profunde. Pornește ziua cu intenție, nu cu telefonul.'
  },
  prayer_am: {
    id: 'prayer_am',
    name: 'Rugăciune AM (Tatăl Nostru)',
    xp: 20,
    icon: '🌸',
    stat: 'MND',
    text: 'Tatăl nostru, Care ești în ceruri, sfințească-Se numele Tău, vie împărăția Ta, facă-se voia Ta, precum în cer, așa și pe pământ. Pâinea noastră cea de toate zilele dă-ne-o nouă astăzi și ne iartă nouă greșelile noastre, precum și noi iertăm greșiților noștri. Și nu ne duce pe noi în ispită, ci ne izbăvește de cel rău. Amin.'
  },
  affirmations: {
    id: 'affirmations',
    name: 'Afirmații de Putere',
    xp: 20,
    icon: '🌹',
    stat: 'MND',
    text: 'Sunt frumoasă. Sunt puternică. Sunt disciplinată. Corpul meu este templul meu. În fiecare zi devin o versiune mai bună. Sunt demnă de iubire, succes și fericire. Merit tot ce e bun.'
  },
  gratitude_pm: {
    id: 'gratitude_pm',
    name: 'Recunoștință PM',
    xp: 20,
    icon: '✨',
    stat: 'MND',
    instruction: 'Notează în jurnal sau gândește-te la 3 lucruri bune din ziua de azi. Mulțumește pentru ele. Specific, nu general.'
  },
  workout: {
    id: 'workout',
    name: 'Antrenament Fizic',
    xp: 100,
    icon: '🍑',
    stat: 'STR',
    auto: true
  }
};

// =================== RANKS & XP ===================
function getRequiredXP(level) {
  const base = 80;
  const growth = Math.floor(Math.pow(level, 1.2) * 2.5);
  return Math.floor((base + growth) / 5) * 5;
}

const RANK_TIERS = [
  { min: 1,   max: 9,   key: 'E', name: 'E-Rank Novice',     color: '#c5a8aa' },
  { min: 10,  max: 19,  key: 'D', name: 'D-Rank Fighter',    color: '#7ed9a8' },
  { min: 20,  max: 34,  key: 'C', name: 'C-Rank Glow',       color: '#ff9eb5' },
  { min: 35,  max: 49,  key: 'B', name: 'B-Rank Bloom',      color: '#ff7a8a' },
  { min: 50,  max: 69,  key: 'A', name: 'A-Rank Empress',    color: '#ffb380', glow: '0 0 12px rgba(255,179,128,0.5)' },
  { min: 70,  max: 84,  key: 'S', name: 'S-Rank Queen',      color: '#ffd16a', glow: '0 0 14px rgba(255,209,106,0.5)' },
  { min: 85,  max: 99,  key: 'SS',name: 'National Beauty',   color: '#ff5d8f', glow: '0 0 16px rgba(255,93,143,0.5)' },
  { min: 100, max: 124, key: 'SSS',name:'Crystal Goddess',   color: '#ffeae5', glow: '0 0 20px rgba(255,234,229,0.7)' },
  { min: 125, max: 149, key: 'X', name: 'Aurora',            color: '#ff4a5e', glow: '0 0 22px rgba(255,74,94,0.7)' },
  { min: 150, max: 9999,key: 'G', name: 'Divine Mode',       color: '#ffffff', glow: '0 0 24px rgba(255,255,255,0.9)' }
];

function getRank(level) {
  return RANK_TIERS.find(t => level >= t.min && level <= t.max) || RANK_TIERS[0];
}

function addXP(amount, reason, statKey) {
  state.system.xp += amount;
  if (state.system.xp < 0) state.system.xp = 0;
  let leveled = 0;
  while (state.system.xp >= getRequiredXP(state.system.level)) {
    state.system.xp -= getRequiredXP(state.system.level);
    state.system.level++;
    leveled++;
  }
  if (statKey && amount > 0) addStatXP(statKey, Math.max(4, Math.round(amount * 0.25)));
  if (leveled > 0) {
    showLevelUpModal(state.system.level);
    checkRankAchievements(state.system.level);
  }
  saveState();
  updateGlobalXPBar();
  if (amount !== 0) {
    const sign = amount >= 0 ? '+' : '';
    showToast(`${sign}${amount} XP (${reason})`);
  }
}

// =================== HUNTER STATS (uncapped, curbă abruptă) ===================
function statRequiredXP(level) {
  return Math.floor(60 + Math.pow(level, 1.7) * 5);
}

function addStatXP(key, amount) {
  const s = state.stats[key];
  if (!s || amount <= 0) return;
  const oldLevel = s.level;
  s.xp += amount;
  while (s.xp >= statRequiredXP(s.level)) {
    s.xp -= statRequiredXP(s.level);
    s.level++;
  }
  if (s.level > oldLevel) {
    const milestones = [10, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
    for (let m of milestones) {
      if (oldLevel < m && s.level >= m) {
        setTimeout(() => showToast(`✨ ${key} ${getStatTier(m).name} — Nivel ${m}!`), 600);
      }
    }
    if (s.level >= 50) unlockAchievement('stat_50');
    if (s.level >= 100) unlockAchievement('stat_100');
    checkAllStats25();
  }
}

function statPct(key) {
  const s = state.stats[key];
  const req = statRequiredXP(s.level);
  return Math.min(100, Math.max(0, (s.xp / req) * 100));
}

function getStatTier(level) {
  if (level < 10)  return { name: 'Novice',       color: '#c5a8aa', glow: 'none' };
  if (level < 25)  return { name: 'Adept',        color: '#7ed9a8', glow: '0 0 8px rgba(126,217,168,0.4)' };
  if (level < 50)  return { name: 'Expert',       color: '#ff9eb5', glow: '0 0 10px rgba(255,158,181,0.45)' };
  if (level < 75)  return { name: 'Master',       color: '#ff7a8a', glow: '0 0 12px rgba(255,122,138,0.5)' };
  if (level < 100) return { name: 'Grandmaster',  color: '#ffb380', glow: '0 0 14px rgba(255,179,128,0.55)' };
  if (level < 150) return { name: 'Mythic',       color: '#ffd16a', glow: '0 0 16px rgba(255,209,106,0.6)' };
  if (level < 200) return { name: 'Legend',       color: '#ff5d8f', glow: '0 0 18px rgba(255,93,143,0.65)' };
  if (level < 300) return { name: 'Ascendant',    color: '#ff4a5e', glow: '0 0 20px rgba(255,74,94,0.7)' };
  return                  { name: 'Transcendent', color: '#ffffff', glow: '0 0 24px rgba(255,255,255,0.9)' };
}

function checkAllStats25() {
  const all = ['STR','END','MND','WIL'].every(k => state.stats[k].level >= 25);
  if (all) unlockAchievement('all_stats_25');
}

// =================== HABITS ===================
function isPerfectDay(h) {
  return !!(h && h.morning_routine && h.prayer_am && h.affirmations && h.gratitude_pm && h.workout_xp_claimed);
}

function toggleHabit(date, habitId) {
  vibrate(10);
  if (!state.habits[date]) state.habits[date] = {};
  const isDone = !state.habits[date][habitId];
  state.habits[date][habitId] = isDone;
  const q = QUESTS[habitId];
  if (isDone) {
    addXP(q.xp, q.name, q.stat);
    unlockAchievement('first_blood');
    checkPerfectDay(date);
  } else {
    state.system.xp = Math.max(0, state.system.xp - q.xp);
    saveState();
    updateGlobalXPBar();
  }
  render();
}

function checkPerfectDay(date) {
  const h = state.habits[date];
  if (!isPerfectDay(h)) return;
  if (h.perfect_claimed) return;
  h.perfect_claimed = true;
  addXP(50, 'Misiune Completă Zilnică!');
  if (state.system.lastPerfectDate === addDaysKey(date, -1)) {
    state.system.perfectStreak++;
  } else if (!state.system.lastPerfectDate) {
    state.system.perfectStreak = 1;
  } else {
    state.system.perfectStreak = Math.max(state.system.perfectStreak, 1);
  }
  state.system.lastPerfectDate = date;
  const milestones = { 7: 150, 30: 500, 60: 1000, 90: 2000, 120: 3000, 365: 10000 };
  const s = state.system.perfectStreak;
  if (milestones[s]) setTimeout(() => addXP(milestones[s], `🌹 ${s} zile streak!`), 1500);
  if (s >= 30) unlockAchievement('iron_will');
  if (s >= 100) unlockAchievement('streak_100');
  saveState();
}

// =================== STREAK RECOMPUTE ===================
function recomputeStreakFromHabits() {
  const today = todayKey();
  let lastPerfect = null;
  let c = today;
  for (let i = 0; i < 3650; i++) {
    if (isPerfectDay(state.habits[c])) { lastPerfect = c; break; }
    c = addDaysKey(c, -1);
  }
  if (!lastPerfect) return;
  let streak = 0;
  let cursor = lastPerfect;
  while (isPerfectDay(state.habits[cursor]) && streak < 10000) {
    streak++;
    cursor = addDaysKey(cursor, -1);
  }
  state.system.perfectStreak = Math.max(streak, state.system.perfectStreak || 0);
  if (!state.system.lastPerfectDate || state.system.lastPerfectDate < lastPerfect) {
    state.system.lastPerfectDate = lastPerfect;
  }
}

function manualRecomputeStreak() {
  const oldStreak = state.system.perfectStreak;
  const today = todayKey();
  let lastPerfect = null;
  let c = today;
  for (let i = 0; i < 3650; i++) {
    if (isPerfectDay(state.habits[c])) { lastPerfect = c; break; }
    c = addDaysKey(c, -1);
  }
  let streak = 0;
  if (lastPerfect) {
    let cursor = lastPerfect;
    while (isPerfectDay(state.habits[cursor]) && streak < 10000) {
      streak++;
      cursor = addDaysKey(cursor, -1);
    }
  }
  state.system.perfectStreak = streak;
  state.system.lastPerfectDate = lastPerfect;
  saveState();
  render();
  showToast(`🌹 Streak recalculat: ${oldStreak} → ${streak} zile`);
}

// =================== STREAK ROLLOVER & SHIELDS ===================
function processDailyRollover() {
  const today = todayKey();
  if (state.system.lastCheckDate === today) return;
  const last = state.system.lastPerfectDate;
  if (last && last !== today) {
    const yesterday = addDaysKey(today, -1);
    if (last < yesterday) {
      let missed = 0;
      let cursor = addDaysKey(last, 1);
      while (cursor <= yesterday) { missed++; cursor = addDaysKey(cursor, 1); }
      while (missed > 0 && state.system.perfectStreak > 0) {
        if (state.system.shields > 0) {
          state.system.shields--;
          unlockAchievement('untouchable');
        } else {
          state.system.perfectStreak = Math.round(state.system.perfectStreak * 0.7);
        }
        missed--;
      }
    }
  }
  state.system.lastCheckDate = today;
  saveState();
}

// =================== BONUS MISSIONS ===================
function generateBonusMissions(date) {
  const pool = window.BONUS_MISSION_POOL;
  const seed = date.split('-').reduce((a, b) => a * 31 + Number(b), 7);
  const rng = mulberry32(seed);
  const commons = pool.filter(m => m.rarity === 'common');
  const rares = pool.filter(m => m.rarity === 'rare');
  const legends = pool.filter(m => m.rarity === 'legendary');
  const pick = (arr, n) => {
    const copy = [...arr];
    const out = [];
    for (let i = 0; i < n && copy.length; i++) {
      const idx = Math.floor(rng() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
    return out;
  };
  const isLegend = rng() < 0.25;
  let chosen;
  if (isLegend) chosen = [...pick(legends, 1), ...pick(rares, 1), ...pick(commons, 2)];
  else chosen = [...pick(rares, 1), ...pick(commons, 3)];
  return chosen.map(m => ({
    id: m.id,
    rarity: m.rarity,
    xp: m.xp * (m.rarity === 'legendary' ? 6 : m.rarity === 'rare' ? 3 : 1),
    stat: m.stat,
    completed: false
  }));
}

function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function ensureBonusForToday() {
  const today = todayKey();
  if (state.bonusMissions.date !== today) {
    state.bonusMissions = { date: today, missions: generateBonusMissions(today) };
    saveState();
  }
}

function toggleBonusMission(id) {
  vibrate(15);
  const m = state.bonusMissions.missions.find(x => x.id === id);
  if (!m || m.completed) return;
  m.completed = true;
  state.system.bonusCompletedTotal = (state.system.bonusCompletedTotal || 0) + 1;
  addXP(m.xp, `Bonus: ${getBonusMeta(id).title}`, m.stat);
  if (m.rarity === 'rare') {
    if (state.system.shields < 3) {
      state.system.shields++;
      showToast(`🛡 +1 Shield ${state.system.shields}/3`);
    }
  }
  if (m.rarity === 'legendary') unlockAchievement('legendary_pull');
  if (state.system.bonusCompletedTotal >= 50) unlockAchievement('bonus_hunter');
  if (state.system.bonusCompletedTotal >= 500) unlockAchievement('bonus_500');
  addStatXP('WIL', Math.round(m.xp * 0.25));
  saveState();
  render();
}

function getBonusMeta(id) {
  return window.BONUS_MISSION_POOL.find(m => m.id === id) || { title: id, desc: '' };
}

// =================== BOSS DAY ===================
function weekStartKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const dow = dt.getDay() || 7;
  dt.setDate(dt.getDate() - (dow - 1));
  return dateKey(dt);
}

function ensureBossForWeek() {
  const today = todayKey();
  const ws = weekStartKey(today);
  if (state.boss.weekStart !== ws) {
    const seed = ws.split('-').reduce((a, b) => a * 17 + Number(b), 11);
    const rng = mulberry32(seed);
    const dayOffset = 3 + Math.floor(rng() * 3);
    const date = addDaysKey(ws, dayOffset);
    const mission = window.BOSS_MISSIONS[Math.floor(rng() * window.BOSS_MISSIONS.length)];
    state.boss = { weekStart: ws, date, missionId: mission.id, completed: false, expired: false };
    saveState();
  }
  if (state.boss.date && state.boss.date < today && !state.boss.completed && !state.boss.expired) {
    state.boss.expired = true;
    saveState();
  }
}

function completeBoss() {
  vibrate([50, 30, 50]);
  if (state.boss.completed) return;
  state.boss.completed = true;
  state.system.bossesCompletedTotal = (state.system.bossesCompletedTotal || 0) + 1;
  addXP(250, 'QUEEN SLAYER!', 'WIL');
  addStatXP('STR', 30);
  unlockAchievement('boss_slayer');
  if (state.system.bossesCompletedTotal >= 10) unlockAchievement('boss_10');
  saveState();
  render();
}

function getBossMeta() {
  return window.BOSS_MISSIONS.find(m => m.id === state.boss.missionId);
}

function bossTimeLeft() {
  const now = new Date();
  const [y, m, d] = state.boss.date.split('-').map(Number);
  const eod = new Date(y, m - 1, d, 23, 59, 59);
  const diff = eod - now;
  if (diff <= 0) return '00:00:00';
  const h = Math.floor(diff / 3600000);
  const mi = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2,'0')}:${String(mi).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// =================== ACHIEVEMENTS ===================
function unlockAchievement(id) {
  if (state.achievements[id]) return;
  if (!window.ACHIEVEMENTS[id]) return;
  state.achievements[id] = todayKey();
  saveState();
  setTimeout(() => showAchievementModal(id), 400);
}

function checkRankAchievements(level) {
  if (level >= 10) unlockAchievement('rank_d');
  if (level >= 20) unlockAchievement('rank_c');
  if (level >= 35) unlockAchievement('rank_b');
  if (level >= 50) unlockAchievement('rank_a');
  if (level >= 70) { unlockAchievement('rank_s'); unlockAchievement('shadow_monarch'); }
}

function showAchievementModal(id) {
  const a = window.ACHIEVEMENTS[id];
  if (!a) return;
  vibrate([30, 30, 80]);
  const modal = document.getElementById('achievement-modal');
  if (!modal) return;
  const content = modal.querySelector('.achievement-modal-content');
  content.classList.toggle('legendary', a.rarity === 'legendary');
  modal.querySelector('.ach-system-msg').textContent = '✨ ACHIEVEMENT DEBLOCAT';
  modal.querySelector('.ach-modal-icon').textContent = a.icon;
  modal.querySelector('.ach-modal-title').textContent = a.title;
  modal.querySelector('.ach-modal-desc').textContent = a.desc;
  const particles = modal.querySelector('.particles');
  if (particles) { particles.style.animation = 'none'; void particles.offsetWidth; particles.style.animation = ''; }
  modal.classList.add('active');
}

function closeAchievementModal() {
  document.getElementById('achievement-modal').classList.remove('active');
}

// =================== WEEKLY REPORT ===================
function maybeShowWeeklyReport() {
  const today = todayKey();
  if (dayOfWeek(today) !== 0) return;
  const ws = weekStartKey(today);
  if (state.weeklyReport.lastShown === ws) return;
  state.weeklyReport.lastShown = ws;
  saveState();
  setTimeout(() => openWeeklyReport(), 600);
}

function getWeeklyData() {
  const today = todayKey();
  const ws = weekStartKey(today);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = addDaysKey(ws, i);
    const h = state.habits[d] || {};
    const mainDone = isPerfectDay(h);
    const main = ['morning_routine','prayer_am','affirmations','gratitude_pm','workout_xp_claimed'].filter(k => h[k]).length;
    const bonus = (state.bonusMissions.date === d) ? state.bonusMissions.missions.filter(m => m.completed).length : 0;
    days.push({ date: d, main, mainDone, bonus, total: main + bonus });
  }
  const perfect = days.filter(d => d.mainDone).length;
  const totalBonus = days.reduce((s, d) => s + d.bonus, 0);
  const allPerfect = perfect === 7;
  if (allPerfect) unlockAchievement('week_warrior');
  const bestStat = Object.entries(state.stats).reduce((b, [k, v]) => v.xp > b.xp ? { key: k, ...v } : b, { key: 'STR', xp: -1 });
  const quote = window.QUOTES[Math.floor(Math.random() * window.QUOTES.length)];
  return { days, perfect, totalBonus, allPerfect, bestStat, quote, weekStart: ws };
}

function openWeeklyReport() {
  const data = getWeeklyData();
  const modal = document.getElementById('weekly-modal');
  if (!modal) return;
  const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const maxTotal = Math.max(1, ...data.days.map(d => d.total));
  modal.innerHTML = `
    <div class="weekly-modal-content">
      <div class="weekly-title">RAPORT SĂPTĂMÂNAL</div>
      <div class="weekly-subtitle">Săptămâna ${formatDateShort(data.weekStart)}</div>
      <div class="weekly-summary-grid">
        <div class="weekly-summary-card">
          <div class="weekly-summary-num">${data.perfect}/7</div>
          <div class="weekly-summary-label">Zile Perfecte</div>
        </div>
        <div class="weekly-summary-card">
          <div class="weekly-summary-num">${data.totalBonus}</div>
          <div class="weekly-summary-label">Bonus Done</div>
        </div>
        <div class="weekly-summary-card">
          <div class="weekly-summary-num">${data.bestStat.key}</div>
          <div class="weekly-summary-label">Top Stat</div>
        </div>
      </div>
      <div style="font-size: 10px; color: var(--text-tertiary); letter-spacing: 2px; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">Activitate</div>
      <div class="week-chart">
        ${data.days.map(d => {
          const h = Math.max(4, (d.total / maxTotal) * 100);
          const cls = d.mainDone ? 'perfect' : (d.total === 0 ? 'empty' : '');
          return `<div class="week-bar-col"><div class="week-bar ${cls}" style="height: ${h}%;"></div></div>`;
        }).join('')}
      </div>
      <div class="week-bar-labels">
        ${labels.map(l => `<div class="week-bar-label">${l}</div>`).join('')}
      </div>
      <div class="weekly-quote">${data.quote}</div>
      ${data.allPerfect ? `
        <div style="text-align:center; padding: 12px; background: var(--gold-soft); border: 1px solid var(--gold); border-radius: 10px; margin-bottom: 12px;">
          <div style="font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 2px; color: var(--gold);">🌹 PERFECT WEEK!</div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Toate 7 zile cu misiunile principale complete.</div>
        </div>
      ` : ''}
      <button class="timer-btn primary" style="width: 100%;" onclick="closeWeeklyReport()">ÎNCHIDE</button>
    </div>
  `;
  modal.classList.add('active');
}

function closeWeeklyReport() {
  document.getElementById('weekly-modal').classList.remove('active');
}

// =================== EXERCISE HELPERS ===================
function getExerciseMeta(exId) {
  let found = null;
  Object.values(window.PROGRAM).forEach(day => {
    const ex = day.exercises.find(e => e.id === exId);
    if (ex) found = ex;
  });
  if (found) return found;
  if (state.customExercises[exId]) return { id: exId, ...state.customExercises[exId] };
  return { id: exId, name: exId, target: 'N/A', defaultUnit: 'total', note: '' };
}

function computeTotalKg(set) {
  const kg = parseFloat(set.kg) || 0;
  if (set.unit === 'side') return state.settings.barWeight + kg * 2;
  if (set.unit === 'db') return kg * 2;
  return kg;
}

function displayKg(set) {
  const kg = parseFloat(set.kg) || 0;
  if (kg === 0) return '—';
  if (set.unit === 'side') return `${kg}×2 + ${state.settings.barWeight}`;
  if (set.unit === 'db') return `${kg} db`;
  return `${kg}`;
}

function findLastExerciseEntry(exId, excludeDate) {
  const dates = Object.keys(state.workouts).filter(d => d !== excludeDate && state.workouts[d].exercises[exId]).sort().reverse();
  for (const d of dates) {
    const ex = state.workouts[d].exercises[exId];
    if (ex?.sets?.some(s => s.kg || s.reps)) return { date: d, sets: ex.sets };
  }
  return null;
}

function hasAnyData(w) {
  if (!w?.exercises) return false;
  return Object.values(w.exercises).some(ex =>
    ex?.sets?.some(s => String(s.kg||'').trim() || String(s.reps||'').trim())
  );
}

// =================== HEADER / XP ===================
function updateGlobalXPBar() {
  const bar = document.getElementById('global-xp-fill');
  const hRank = document.getElementById('header-rank');
  const hLvl = document.getElementById('header-level');
  const hTxt = document.getElementById('global-xp-text');
  if (!bar) return;
  const lvl = state.system.level;
  const xp = state.system.xp;
  const req = getRequiredXP(lvl);
  const rank = getRank(lvl);
  bar.style.width = Math.min(100, (xp/req)*100) + '%';
  if (hRank) { hRank.textContent = rank.name; hRank.style.color = rank.color; if (rank.glow) hRank.style.textShadow = rank.glow; }
  if (hLvl) hLvl.textContent = `LVL ${lvl}`;
  if (hTxt) hTxt.textContent = `${xp} / ${req} XP`;
}

// =================== MODALS ===================
function showLevelUpModal(newLevel) {
  vibrate([60, 40, 60]);
  const modal = document.getElementById('levelup-modal');
  if (!modal) return;
  const rank = getRank(newLevel);
  document.getElementById('levelup-level-text').textContent = `Nivel ${newLevel}`;
  const rankEl = document.getElementById('levelup-rank-text');
  rankEl.textContent = rank.name;
  rankEl.style.color = rank.color;
  rankEl.style.borderColor = rank.color;
  rankEl.style.boxShadow = rank.glow || 'none';
  modal.classList.add('active');
}
function closeLevelUpModal() { document.getElementById('levelup-modal').classList.remove('active'); }

function openQuestModal(id) {
  const q = QUESTS[id];
  if (!q) return;
  activeQuestId = id;
  document.getElementById('quest-modal-title').textContent = q.name;
  document.getElementById('quest-modal-body').innerHTML = `
    <div style="font-style: italic; color: var(--accent); margin-bottom: 12px;">${q.instruction || 'Citește cu atenție.'}</div>
    ${q.text || ''}
  `;
  document.getElementById('quest-modal').classList.add('active');
}
function closeQuestModal() { document.getElementById('quest-modal').classList.remove('active'); }
function completeQuestFromModal() {
  if (activeQuestId) { toggleHabit(todayKey(), activeQuestId); closeQuestModal(); }
}

function openBonusModal(id) {
  const meta = getBonusMeta(id);
  const m = state.bonusMissions.missions.find(x => x.id === id);
  if (!m || !meta) return;
  const modal = document.getElementById('bonus-modal');
  modal.querySelector('.modal-title').innerHTML = `${meta.title} <span class="rarity-badge ${m.rarity}" style="margin-left:8px; vertical-align:middle;">${m.rarity}</span>`;
  modal.querySelector('#bonus-modal-body').innerHTML = `
    <div style="font-size: 14px; line-height: 1.6; color: var(--text-primary); margin-bottom: 14px;">${meta.desc}</div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent); letter-spacing: 1px;">RECOMPENSĂ: +${m.xp} XP</div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-tertiary); letter-spacing: 1px; margin-top: 4px;">STAT BOOST: ${m.stat}</div>
    ${m.rarity === 'rare' || m.rarity === 'legendary' ? '<div style="font-size: 11px; color: var(--gold); margin-top: 8px;">🛡 Câștigi 1 shield (max 3) pentru misiune rară completată.</div>' : ''}
  `;
  modal.dataset.bonusId = id;
  modal.classList.add('active');
}
function closeBonusModal() { document.getElementById('bonus-modal').classList.remove('active'); }
function completeBonusFromModal() {
  const id = document.getElementById('bonus-modal').dataset.bonusId;
  if (id) { toggleBonusMission(id); closeBonusModal(); }
}

function onAchievementClick(id) {
  const a = window.ACHIEVEMENTS[id];
  if (!a) return;
  if (state.achievements[id]) showAchievementInfoModal(a, state.achievements[id]);
  else showToast(`🔒 ${a.title} — ${a.desc}`);
}

function showAchievementInfoModal(a, dateStr) {
  vibrate(15);
  const modal = document.getElementById('achievement-modal');
  if (!modal) return;
  const content = modal.querySelector('.achievement-modal-content');
  content.classList.toggle('legendary', a.rarity === 'legendary');
  modal.querySelector('.ach-system-msg').textContent = `DEBLOCAT — ${formatDate(dateStr)}`;
  modal.querySelector('.ach-modal-icon').textContent = a.icon;
  modal.querySelector('.ach-modal-title').textContent = a.title;
  modal.querySelector('.ach-modal-desc').textContent = a.desc;
  modal.classList.add('active');
}

function showStatDetail(key) {
  const s = state.stats[key];
  const tier = getStatTier(s.level);
  const req = statRequiredXP(s.level);
  const desc = {
    STR: 'Forța — câștigată din antrenamente glute, yoga, plimbări lungi, dans.',
    END: 'Rezistența — câștigată din rutină matinală, hidratare, somn, post.',
    MND: 'Mintea — câștigată din lectură, meditație, recunoștință, journal.',
    WIL: 'Voința — câștigată din misiuni bonus, no-phone, disciplină.'
  }[key];
  showToast(`${key} ${tier.name} • Nivel ${s.level} • ${s.xp}/${req} XP`);
  setTimeout(() => showToast(desc), 200);
}

// =================== NAVIGATION ===================
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.page === page));
  render();
}

function render() {
  const el = document.getElementById('page-content');
  document.getElementById('date-pill').textContent = formatDate(todayKey()).toUpperCase();
  updateGlobalXPBar();
  el.className = 'fade-in';
  void el.offsetWidth;
  ensureBonusForToday();
  ensureBossForWeek();
  if (currentPage === 'home') renderHome(el);
  else if (currentPage === 'workout') renderWorkout(el);
  else if (currentPage === 'progress') renderProgress(el);
  else if (currentPage === 'rank') renderRank(el);
  else if (currentPage === 'achievements') renderAchievements(el);
  else if (currentPage === 'hunter') renderHunter(el);
  window.scrollTo(0, 0);
}

// =================== AZI / HOME ===================
function renderHome(el) {
  const today = todayKey();
  const habits = state.habits[today] || {};
  const todayWorkout = state.workouts[today];
  const isWorkoutFinished = habits.workout_xp_claimed;
  const streak = state.system.perfectStreak || 0;
  const lvl = state.system.level;
  const xp = state.system.xp;
  const req = getRequiredXP(lvl);
  const mainCount = ['morning_routine','prayer_am','affirmations','gratitude_pm','workout_xp_claimed'].filter(k => habits[k]).length;

  const glance = `
    <div class="glance-widget">
      <div class="glance-row">
        <div>
          <div class="glance-streak">${streak}🌹</div>
          <div class="glance-streak-label">Streak Zile</div>
        </div>
        <div class="glance-missions">
          <div class="glance-missions-big">${mainCount}/5</div>
          <div class="glance-streak-label">Misiuni Azi</div>
        </div>
      </div>
      <div class="glance-xp-bar"><div class="glance-xp-fill" style="width: ${Math.min(100,(xp/req)*100)}%"></div></div>
    </div>
  `;

  // Tip of the day (seeded per day)
  const tipIdx = today.split('-').reduce((a,b) => a + Number(b), 0) % window.DAILY_TIPS.length;
  const tipHtml = `
    <div class="tip-card">
      <div class="tip-icon">💡</div>
      <div class="tip-content">
        <div class="tip-label">Tip-ul Zilei</div>
        <div class="tip-text">${window.DAILY_TIPS[tipIdx]}</div>
      </div>
    </div>
  `;

  const shields = state.system.shields || 0;
  const shieldsHtml = `
    <div class="streak-shield-row">
      <div class="streak-flame ${streak >= 30 ? 'legend' : streak >= 7 ? 'fire' : ''}">
        <div class="streak-num">${streak}</div>
        <div>
          <div class="streak-label">Streak</div>
          <div style="font-size:10px; color: var(--text-tertiary); margin-top:2px;">${streak < 7 ? 'Continuă! Sub 7 zile.' : streak >= 30 ? '✨ AURORA GLOW' : 'În flori!'}</div>
        </div>
      </div>
      <div>
        <div class="streak-label" style="text-align:right; margin-bottom:4px;">Shields</div>
        <div class="shield-stack">
          ${[0,1,2].map(i => `<div class="shield-icon ${i < shields ? 'active' : ''}">🛡</div>`).join('')}
        </div>
      </div>
    </div>
  `;

  let bossHtml = '';
  if (state.boss.date === today && !state.boss.expired) {
    const boss = getBossMeta();
    if (boss) {
      bossHtml = `
        <div class="boss-banner" id="boss-banner">
          <div class="boss-header-row">
            <div class="boss-tag">BOSS DAY</div>
            <div class="boss-countdown" id="boss-countdown">${bossTimeLeft()}</div>
          </div>
          <div class="boss-title">${boss.title}</div>
          <div class="boss-desc">${boss.desc}</div>
          <div>
            <span class="boss-xp-pill">+250 XP</span>
            <span class="boss-xp-pill" style="color: var(--accent); border-color: var(--accent); background: var(--accent-soft);">5x recompensă</span>
          </div>
          <button class="boss-complete-btn ${state.boss.completed ? 'done' : ''}" onclick="completeBoss()" ${state.boss.completed ? 'disabled' : ''}>
            ${state.boss.completed ? '👑 BOSS DOBORÂT' : 'AM DOBORÂT BOSSUL'}
          </button>
        </div>
      `;
    }
  }

  const questsHtml = Object.values(QUESTS).map(q => {
    const done = habits[q.id] || (q.id === 'workout' ? isWorkoutFinished : false);
    if (q.id === 'workout') {
      return `
        <div class="quest-item ${done ? 'done' : ''}" style="cursor: default;">
          <div class="quest-icon">${q.icon}</div>
          <div class="quest-info">
            <div class="quest-name">${q.name}</div>
            <div class="quest-xp">+${q.xp} XP • STR</div>
          </div>
          <div class="quest-checkbox"><svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7"/></svg></div>
        </div>
      `;
    }
    return `
      <div class="quest-item ${done ? 'done' : ''}" onclick="openQuestModal('${q.id}')">
        <div class="quest-icon">${q.icon}</div>
        <div class="quest-info">
          <div class="quest-name">${q.name}</div>
          <div class="quest-xp">+${q.xp} XP • ${q.stat}</div>
        </div>
        <div class="quest-checkbox" onclick="event.stopPropagation(); toggleHabit('${today}', '${q.id}')">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>
    `;
  }).join('');

  const bonusDone = state.bonusMissions.missions.filter(m => m.completed).length;
  const bonusTotal = state.bonusMissions.missions.length;
  const bonusHtml = state.bonusMissions.missions.map(m => {
    const meta = getBonusMeta(m.id);
    return `
      <div class="bonus-mission-card rarity-${m.rarity} ${m.completed ? 'done' : ''}" onclick="openBonusModal('${m.id}')">
        <div class="bonus-icon">${m.rarity === 'legendary' ? '💎' : m.rarity === 'rare' ? '🌹' : '✦'}</div>
        <div class="bonus-info">
          <div class="bonus-title">${meta.title}</div>
          <div class="bonus-meta">
            <span class="rarity-badge ${m.rarity}">${m.rarity}</span>
            <span class="bonus-xp">+${m.xp} XP</span>
            <span>• ${m.stat}</span>
          </div>
        </div>
        <div class="quest-checkbox" onclick="event.stopPropagation(); toggleBonusMission('${m.id}')">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    ${glance}
    ${tipHtml}

    <div class="greeting-card">
      <div class="greeting">SISTEMUL TE SALUTĂ,</div>
      <div class="greeting-name">${escapeHtml(state.profile.name || 'HUNTRESS').toUpperCase()}</div>
      <div class="greeting-stats">
        <span><strong>${state.system.bonusCompletedTotal || 0}</strong> bonus done</span>
        <span><strong>${Object.keys(state.achievements).length}</strong> achievements</span>
      </div>
    </div>

    ${shieldsHtml}
    ${bossHtml}

    <div class="quests-container">
      <div class="section-subtitle">🌸 Misiuni Principale</div>
      ${questsHtml}
    </div>

    <div class="quests-container" style="background: linear-gradient(135deg, var(--bg-surface), rgba(255, 122, 138, 0.04));">
      <div class="bonus-section-label">
        <div class="section-subtitle" style="margin-bottom:0;">✦ Misiuni Bonus</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-tertiary); letter-spacing: 1px;">${bonusDone}/${bonusTotal}</div>
      </div>
      ${bonusHtml}
    </div>

    ${(todayWorkout && !isWorkoutFinished) ? `
      <div class="card" style="border-color: var(--accent); cursor: pointer; background: linear-gradient(135deg, var(--bg-surface), var(--accent-soft));" onclick="openWorkout('${today}', '${todayWorkout.dayKey}')">
        <div class="section-subtitle" style="margin-bottom:4px;">✨ Antrenament în Curs</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <div>
            <div style="font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 1.5px;">${window.PROGRAM[todayWorkout.dayKey]?.name || 'Custom'}</div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top:2px;">Apasă pentru a continua</div>
          </div>
          <svg fill="none" stroke="var(--accent)" viewBox="0 0 24 24" width="28" height="28" stroke-width="2"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </div>
      </div>
    ` : ''}

    <div class="section-title" style="margin-top: 20px;">Programul Tău</div>
    <div class="day-grid">
      ${window.DAY_ORDER.map((key, idx) => {
        const day = window.PROGRAM[key];
        const isRest = key === 'rest';
        return `
          <button class="day-btn ${isRest ? 'rest' : ''}" onclick="startWorkout('${key}')">
            <div class="day-btn-num">${isRest ? 'JOI + DUM' : 'ZIUA ' + (idx + 1)}</div>
            <div class="day-btn-name">${day.name}</div>
            <div class="day-btn-focus">${day.focus}</div>
          </button>
        `;
      }).join('')}
    </div>
  `;

  if (bossHtml) startBossCountdown();
}

let bossCountdownInterval = null;
function startBossCountdown() {
  clearInterval(bossCountdownInterval);
  bossCountdownInterval = setInterval(() => {
    const el = document.getElementById('boss-countdown');
    if (!el) { clearInterval(bossCountdownInterval); return; }
    el.textContent = bossTimeLeft();
  }, 1000);
}

// =================== WORKOUT ===================
function startWorkout(dayKey) {
  const today = todayKey();
  if (!state.workouts[today]) {
    state.workouts[today] = { dayKey, exercises: {} };
  } else if (state.workouts[today].dayKey !== dayKey) {
    if (!confirm(`Astăzi ai început deja ${window.PROGRAM[state.workouts[today].dayKey]?.name || 'un antrenament'}. Schimbi cu ${window.PROGRAM[dayKey].name}? (datele se vor pierde)`)) return;
    state.workouts[today] = { dayKey, exercises: {} };
  }
  saveState();
  openWorkout(today, dayKey);
}

function openWorkout(dateKey, dayKey) {
  currentWorkoutDate = dateKey;
  currentDayKey = dayKey;
  currentPage = 'workout';
  render();
}

function renderWorkout(el) {
  const day = window.PROGRAM[currentDayKey];
  const workout = state.workouts[currentWorkoutDate] || { dayKey: currentDayKey, exercises: {} };
  const programIds = day.exercises.map(e => e.id);
  const customIds = Object.keys(workout.exercises).filter(id => !programIds.includes(id));
  const all = [...day.exercises, ...customIds.map(id => getExerciseMeta(id))];
  el.innerHTML = `
    <button class="back-btn" onclick="navigate('home')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14" stroke-width="2.5"><path d="M15 19l-7-7 7-7"/></svg>
      Înapoi
    </button>
    <div class="workout-header">
      <div class="workout-title">${day.name}</div>
      <div class="workout-focus">${day.focus} • ${formatDate(currentWorkoutDate)}</div>
    </div>
    <div id="exercises-container">
      ${all.map((ex, idx) => renderExerciseCard(ex, idx, workout)).join('')}
    </div>
    <button class="add-custom-exercise-btn" onclick="openCustomExerciseModal()">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" stroke-width="2.5"><path d="M12 4v16m8-8H4"/></svg>
      ADAUGĂ EXERCIȚIU CUSTOM
    </button>
    <button class="finish-workout" onclick="finishWorkout()">SALVEAZĂ ANTRENAMENTUL</button>
  `;
}

function renderExerciseCard(ex, idx, workout) {
  const exData = workout.exercises[ex.id] || {
    sets: [
      { kg:'', reps:'', unit: ex.defaultUnit || 'total' },
      { kg:'', reps:'', unit: ex.defaultUnit || 'total' },
      { kg:'', reps:'', unit: ex.defaultUnit || 'total' }
    ],
    notes: ''
  };
  const last = findLastExerciseEntry(ex.id, currentWorkoutDate);
  let lastDisplay = '', overload = '';
  if (last) {
    const valid = last.sets.filter(s => s.kg && s.reps);
    if (valid.length) {
      const best = valid.reduce((m, s) => computeTotalKg(s) > computeTotalKg(m) ? s : m, valid[0]);
      lastDisplay = `LAST: ${displayKg(best)} × ${best.reps}`;
      const k = parseFloat(best.kg) || 0;
      const r = parseInt(best.reps) || 0;
      overload = `Data trecută: ${valid.length} seturi. Target azi: 📈 ${k + 2.5}kg sau ${r + 1} reps`;
    }
  }
  return `
    <div class="exercise-card" id="card-${ex.id}">
      <div class="exercise-header">
        <div style="flex:1; min-width:0;">
          <div class="exercise-num">#${String(idx+1).padStart(2,'0')} • ${ex.target || 'Custom'}</div>
          <div class="exercise-name">${escapeHtml(ex.name)}</div>
          <div class="exercise-target">${escapeHtml(ex.note || '')}</div>
          ${overload ? `<div class="overload-hint">${overload}</div>` : ''}
        </div>
        <div class="last-time-pill ${lastDisplay ? '' : 'no-data'}">${lastDisplay || 'PRIMĂ DATĂ'}</div>
      </div>
      <div class="exercise-body">
        ${renderUnitToggle(ex.id, exData.sets[0]?.unit || ex.defaultUnit || 'total')}
        <div class="sets-table" id="sets-${ex.id}">
          <div class="sets-header">#</div>
          <div class="sets-header">KG</div>
          <div class="sets-header">REPS</div>
          <div class="sets-header">VOL</div>
          <div class="sets-header"></div>
          ${exData.sets.map((set, sIdx) => renderSetRow(ex.id, sIdx, set)).join('')}
        </div>
        <button class="add-set-btn" onclick="addSet('${ex.id}')">+ Adaugă set</button>
        <div class="exercise-actions">
          <button class="action-btn" onclick="toggleNotes('${ex.id}')"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>Notă</button>
          ${last ? `<button class="action-btn" onclick="copyLastSets('${ex.id}')"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M10 8h8a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 012-2z"/></svg>Copiază</button>` : ''}
        </div>
        <textarea class="notes-area ${exData.notes ? '' : 'hidden'}" id="notes-${ex.id}" placeholder="Notă..." onchange="saveNote('${ex.id}', this.value)">${escapeHtml(exData.notes || '')}</textarea>
      </div>
    </div>
  `;
}

function renderUnitToggle(exId, unit) {
  return `
    <div class="unit-toggle" id="unit-toggle-${exId}">
      <button class="${unit==='total'?'active':''}" onclick="setUnit('${exId}','total')">TOTAL</button>
      <button class="${unit==='side'?'active':''}" onclick="setUnit('${exId}','side')">/ SIDE</button>
      <button class="${unit==='db'?'active':''}" onclick="setUnit('${exId}','db')">DB EA</button>
    </div>
  `;
}

function renderSetRow(exId, sIdx, set) {
  const total = set.kg && set.reps ? computeTotalKg(set) : 0;
  const vol = total && set.reps ? Math.round(total * parseFloat(set.reps)) : 0;
  const done = set.kg && set.reps;
  let gK = '', gR = '';
  const last = findLastExerciseEntry(exId, currentWorkoutDate);
  if (last?.sets[sIdx]) { gK = last.sets[sIdx].kg || ''; gR = last.sets[sIdx].reps || ''; }
  return `
    <div class="set-row" data-sidx="${sIdx}">
      <div class="set-num">${sIdx+1}</div>
      <input type="number" inputmode="decimal" step="0.5" class="set-input ${done?'done':''}" value="${set.kg||''}" placeholder="${gK||'0'}" onfocus="this.select()" enterkeyhint="next" onchange="updateSet('${exId}',${sIdx},'kg',this.value)">
      <input type="number" inputmode="numeric" class="set-input ${done?'done':''}" value="${set.reps||''}" placeholder="${gR||'0'}" onfocus="this.select()" enterkeyhint="next" onchange="updateSet('${exId}',${sIdx},'reps',this.value)">
      <div class="set-vol">${vol||'—'}</div>
      <button class="set-delete" onclick="deleteSet('${exId}',${sIdx})"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>
  `;
}

function ensureExercise(exId) {
  if (!state.workouts[currentWorkoutDate]) state.workouts[currentWorkoutDate] = { dayKey: currentDayKey, exercises: {} };
  if (!state.workouts[currentWorkoutDate].exercises[exId]) {
    const meta = getExerciseMeta(exId);
    state.workouts[currentWorkoutDate].exercises[exId] = {
      sets: [
        { kg:'', reps:'', unit: meta.defaultUnit || 'total' },
        { kg:'', reps:'', unit: meta.defaultUnit || 'total' },
        { kg:'', reps:'', unit: meta.defaultUnit || 'total' }
      ],
      notes: ''
    };
  }
  return state.workouts[currentWorkoutDate].exercises[exId];
}

function updateSet(exId, sIdx, field, value) {
  const exData = ensureExercise(exId);
  if (!exData.sets[sIdx]) {
    const meta = getExerciseMeta(exId);
    exData.sets[sIdx] = { kg:'', reps:'', unit: meta.defaultUnit || 'total' };
  }
  exData.sets[sIdx][field] = value;
  saveState();
  const c = document.getElementById(`sets-${exId}`);
  if (c) {
    const set = exData.sets[sIdx];
    const total = set.kg && set.reps ? computeTotalKg(set) : 0;
    const vol = total && set.reps ? Math.round(total * parseFloat(set.reps)) : 0;
    const done = set.kg && set.reps;
    c.querySelectorAll(`[data-sidx="${sIdx}"] .set-input`).forEach(i => i.classList.toggle('done', done));
    const v = c.querySelector(`[data-sidx="${sIdx}"] .set-vol`);
    if (v) v.textContent = vol || '—';
    const card = document.getElementById(`card-${exId}`);
    if (card && exData.sets.every(s => s.kg && s.reps)) {
      card.classList.add('active-exercise');
      setTimeout(() => card.classList.remove('active-exercise'), 500);
    }
  }
}

function setUnit(exId, unit) {
  const exData = ensureExercise(exId);
  if (exData.sets.length === 0) exData.sets = [{kg:'',reps:'',unit},{kg:'',reps:'',unit},{kg:'',reps:'',unit}];
  else exData.sets.forEach(s => s.unit = unit);
  saveState();
  const c = document.getElementById(`sets-${exId}`);
  const t = document.getElementById(`unit-toggle-${exId}`);
  if (c) c.innerHTML = `<div class="sets-header">#</div><div class="sets-header">KG</div><div class="sets-header">REPS</div><div class="sets-header">VOL</div><div class="sets-header"></div>${exData.sets.map((s,i) => renderSetRow(exId,i,s)).join('')}`;
  if (t) t.outerHTML = renderUnitToggle(exId, unit);
}

function addSet(exId) {
  vibrate(10);
  const exData = ensureExercise(exId);
  const meta = getExerciseMeta(exId);
  const lastUnit = exData.sets[exData.sets.length-1]?.unit || meta.defaultUnit || 'total';
  exData.sets.push({ kg:'', reps:'', unit: lastUnit });
  saveState();
  const c = document.getElementById(`sets-${exId}`);
  if (c) {
    const i = exData.sets.length - 1;
    c.insertAdjacentHTML('beforeend', renderSetRow(exId, i, exData.sets[i]));
  }
}

function deleteSet(exId, sIdx) {
  vibrate(10);
  const exData = ensureExercise(exId);
  exData.sets.splice(sIdx, 1);
  saveState();
  const c = document.getElementById(`sets-${exId}`);
  if (c) c.innerHTML = `<div class="sets-header">#</div><div class="sets-header">KG</div><div class="sets-header">REPS</div><div class="sets-header">VOL</div><div class="sets-header"></div>${exData.sets.map((s,i) => renderSetRow(exId,i,s)).join('')}`;
}

function toggleNotes(exId) {
  const ta = document.getElementById('notes-' + exId);
  if (ta) { ta.classList.toggle('hidden'); if (!ta.classList.contains('hidden')) ta.focus(); }
}
function saveNote(exId, value) { ensureExercise(exId).notes = value; saveState(); }

function copyLastSets(exId) {
  const last = findLastExerciseEntry(exId, currentWorkoutDate);
  if (!last) return;
  const exData = ensureExercise(exId);
  exData.sets = last.sets.map(s => ({ kg: s.kg, reps: s.reps, unit: s.unit }));
  saveState();
  showToast('✅ Seturi copiate');
  render();
}

function finishWorkout() {
  vibrate([20, 50, 20]);
  const today = todayKey();
  if (!state.habits[today]) state.habits[today] = {};
  if (!state.habits[today].workout_xp_claimed) {
    state.habits[today].workout_xp_claimed = true;
    addXP(QUESTS.workout.xp, 'Antrenament Finalizat', 'STR');
    addStatXP('STR', 25);
    checkPerfectDay(today);
  }
  // Glute dedication & hip thrust master
  const totalWorkouts = Object.keys(state.habits).filter(d => state.habits[d].workout_xp_claimed).length;
  if (totalWorkouts >= 50) unlockAchievement('glute_50');
  const hipThrustDays = ['lower_a', 'lower_b', 'lower_c'];
  const hipThrustSessions = Object.values(state.workouts).filter(w => hipThrustDays.includes(w.dayKey) && hasAnyData(w)).length;
  if (hipThrustSessions >= 100) unlockAchievement('hip_thrust_master');
  saveState();
  showToast('🌹 Antrenament salvat!');
  setTimeout(() => navigate('home'), 800);
}

function openCustomExerciseModal() {
  document.getElementById('custom-ex-modal').classList.add('active');
  document.getElementById('custom-ex-name').focus();
}
function closeCustomExerciseModal() {
  document.getElementById('custom-ex-modal').classList.remove('active');
  document.getElementById('custom-ex-name').value = '';
}
function addCustomExercise() {
  vibrate(12);
  const name = document.getElementById('custom-ex-name').value.trim();
  if (!name) { showToast('❌ Numele este obligatoriu'); return; }
  let id = Object.keys(state.customExercises).find(k => state.customExercises[k].name.toLowerCase() === name.toLowerCase());
  const unit = document.getElementById('custom-ex-unit').value;
  if (!id) { id = 'custom_' + Date.now(); state.customExercises[id] = { name, target:'Custom', defaultUnit: unit, note:'' }; }
  ensureExercise(id);
  state.workouts[currentWorkoutDate].exercises[id].sets = [{kg:'',reps:'',unit},{kg:'',reps:'',unit},{kg:'',reps:'',unit}];
  saveState();
  closeCustomExerciseModal();
  render();
  showToast('✅ Exercițiu adăugat');
}

// =================== PROGRESS PAGE ===================
let progressRange = '4w';
let progressSearch = '';

function renderProgress(el) {
  const allEx = getAllExercises();
  const cutoff = getRangeCutoff(progressRange);
  const totals = computeTotals(cutoff);
  const ranges = [
    { key:'1w', label:'7z' }, { key:'2w', label:'2sapt' }, { key:'4w', label:'4sapt' },
    { key:'8w', label:'8sapt' }, { key:'3m', label:'3luni' }, { key:'6m', label:'6luni' }, { key:'all', label:'Total' }
  ];
  el.innerHTML = `
    <div class="section-title">Progres</div>
    <div class="range-selector">
      ${ranges.map(r => `<button class="range-btn ${progressRange===r.key?'active':''}" onclick="setRange('${r.key}')">${r.label}</button>`).join('')}
    </div>
    <div class="metric-stats">
      <div class="metric-card">
        <div class="metric-label">Antrenamente</div>
        <div class="metric-value">${totals.workouts}</div>
        <div class="metric-delta ${totals.workoutsDelta>0?'up':totals.workoutsDelta<0?'down':'flat'}">${totals.workoutsDelta>0?'↗':totals.workoutsDelta<0?'↘':'—'} vs anterior</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Volum (kg)</div>
        <div class="metric-value">${formatNumber(totals.volume)}</div>
        <div class="metric-delta ${totals.volumeDelta>0?'up':totals.volumeDelta<0?'down':'flat'}">${totals.volumeDelta>0?'+':''}${formatNumber(totals.volumeDelta)}</div>
      </div>
      <div class="metric-card"><div class="metric-label">Seturi</div><div class="metric-value">${totals.sets}</div></div>
      <div class="metric-card"><div class="metric-label">Reps</div><div class="metric-value">${formatNumber(totals.reps)}</div></div>
    </div>
    <div class="section-subtitle">EVOLUȚIE EXERCIȚII</div>
    <input type="text" class="exercise-search" placeholder="🔍 Caută exercițiu..." value="${escapeHtml(progressSearch)}" oninput="setProgressSearch(this.value)">
    <div id="progress-list">${renderProgressList(allEx, cutoff)}</div>
    <div class="section-title" style="margin-top: 32px;">Istoric</div>
    ${renderHistoryList()}
  `;
}

function setRange(k) { progressRange = k; render(); }
function setProgressSearch(v) {
  progressSearch = v;
  document.getElementById('progress-list').innerHTML = renderProgressList(getAllExercises(), getRangeCutoff(progressRange));
}

function getAllExercises() {
  const all = {};
  Object.entries(state.workouts).forEach(([d, w]) => {
    Object.entries(w.exercises || {}).forEach(([exId, exData]) => {
      const valid = (exData.sets || []).filter(s => s.kg && s.reps);
      if (!valid.length) return;
      if (!all[exId]) all[exId] = { entries: [] };
      all[exId].entries.push({ date: d, sets: valid });
    });
  });
  Object.keys(all).forEach(id => {
    const meta = getExerciseMeta(id);
    all[id].name = meta.name;
    all[id].target = meta.target;
  });
  return all;
}

function renderProgressList(allEx, cutoff) {
  const filtered = Object.entries(allEx)
    .filter(([id, d]) => {
      if (progressSearch && !d.name.toLowerCase().includes(progressSearch.toLowerCase())) return false;
      return d.entries.some(e => !cutoff || e.date >= cutoff);
    })
    .sort((a,b) => a[1].name.localeCompare(b[1].name));
  if (!filtered.length) {
    return `<div class="empty-state"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg><div>Niciun exercițiu cu date încă</div></div>`;
  }
  return filtered.map(([id, d]) => {
    const inR = d.entries.filter(e => !cutoff || e.date >= cutoff).sort((a,b) => a.date.localeCompare(b.date));
    if (!inR.length) return '';
    const stats = inR.map(e => {
      const maxKg = Math.max(...e.sets.map(s => computeTotalKg(s)));
      const vol = e.sets.reduce((s, x) => s + computeTotalKg(x) * (parseFloat(x.reps)||0), 0);
      return { date: e.date, maxKg, volume: vol };
    });
    const first = stats[0], last = stats[stats.length-1];
    const kgDelta = last.maxKg - first.maxKg;
    const volDelta = last.volume - first.volume;
    const bestKg = Math.max(...stats.map(s => s.maxKg));
    return `
      <div class="progress-exercise">
        <div class="progress-exercise-header">
          <div class="progress-exercise-name">${escapeHtml(d.name)}</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-tertiary);">${inR.length} sesiuni</div>
        </div>
        <div class="progress-stats">
          <div class="progress-stat ${kgDelta>0?'delta-up':kgDelta<0?'delta-down':''}"><div class="progress-stat-label">KG</div><div class="progress-stat-value">${kgDelta>=0?'+':''}${kgDelta.toFixed(1)}</div></div>
          <div class="progress-stat ${volDelta>0?'delta-up':volDelta<0?'delta-down':''}"><div class="progress-stat-label">Volum</div><div class="progress-stat-value">${volDelta>=0?'+':''}${formatNumber(volDelta)}</div></div>
          <div class="progress-stat"><div class="progress-stat-label">PR</div><div class="progress-stat-value">${bestKg.toFixed(0)}</div></div>
        </div>
        <div class="chart-container">${renderChart(stats)}</div>
      </div>
    `;
  }).join('');
}

function renderChart(stats) {
  if (stats.length < 2) return `<div style="text-align:center;color:var(--text-tertiary);font-size:11px;padding-top:45px;">Mai e nevoie de 1 sesiune</div>`;
  const W = 320, H = 120, P = 14;
  const maxV = Math.max(...stats.map(s => s.volume));
  const minV = Math.min(...stats.map(s => s.volume));
  const range = maxV - minV || 1;
  const pts = stats.map((s, i) => ({
    x: P + (i / (stats.length - 1)) * (W - P*2),
    y: H - P - ((s.volume - minV) / range) * (H - P*2),
    ...s
  }));
  const d = pts.map((p,i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${d} L ${pts[pts.length-1].x} ${H-P} L ${pts[0].x} ${H-P} Z`;
  const id = 'g' + Math.random().toString(36).slice(2,9);
  return `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%; height:100%;" preserveAspectRatio="none">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff7a8a" stop-opacity="0.4"/><stop offset="100%" stop-color="#ff7a8a" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#${id})"/>
      <path d="${d}" fill="none" stroke="#ff7a8a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 6px rgba(255,122,138,0.5))"/>
      ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#ffb380" stroke="#22171c" stroke-width="1.5"/>`).join('')}
    </svg>
  `;
}

function getRangeCutoff(r) {
  if (r === 'all') return null;
  const d = new Date();
  if (r === '1w') d.setDate(d.getDate()-7);
  else if (r === '2w') d.setDate(d.getDate()-14);
  else if (r === '4w') d.setDate(d.getDate()-28);
  else if (r === '8w') d.setDate(d.getDate()-56);
  else if (r === '3m') d.setMonth(d.getMonth()-3);
  else if (r === '6m') d.setMonth(d.getMonth()-6);
  return dateKey(d);
}

function computeTotals(cutoff) {
  let workouts=0, volume=0, sets=0, reps=0, prevW=0, prevV=0;
  const prevCut = cutoff ? (() => {
    const days = Math.round((new Date(todayKey()) - new Date(cutoff)) / 86400000);
    const d = new Date(cutoff); d.setDate(d.getDate()-days);
    return dateKey(d);
  })() : null;
  Object.entries(state.workouts).forEach(([date, w]) => {
    if (!hasAnyData(w)) return;
    const inC = !cutoff || date >= cutoff;
    const inP = prevCut && date >= prevCut && date < cutoff;
    let v=0, s=0, r=0;
    Object.values(w.exercises || {}).forEach(ex => {
      (ex.sets || []).forEach(set => {
        if (set.kg && set.reps) {
          v += computeTotalKg(set) * parseFloat(set.reps);
          s++; r += parseFloat(set.reps);
        }
      });
    });
    if (inC) { workouts++; volume+=v; sets+=s; reps+=r; }
    if (inP) { prevW++; prevV+=v; }
  });
  return { workouts, volume: Math.round(volume), sets, reps: Math.round(reps), workoutsDelta: workouts - prevW, volumeDelta: Math.round(volume - prevV) };
}

function formatNumber(n) {
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1).replace('.0','') + 'k';
  return Math.round(n).toString();
}

function renderHistoryList() {
  const dates = Object.keys(state.workouts).filter(d => hasAnyData(state.workouts[d])).sort().reverse().slice(0, 12);
  if (!dates.length) return `<div class="empty-state"><div>Niciun antrenament încă</div></div>`;
  return dates.map(d => {
    const w = state.workouts[d];
    const day = window.PROGRAM[w.dayKey];
    let vol = 0, ts = 0;
    const summary = [];
    Object.entries(w.exercises || {}).forEach(([exId, exData]) => {
      const valid = (exData.sets || []).filter(s => s.kg && s.reps);
      if (!valid.length) return;
      let exV = 0;
      valid.forEach(s => { exV += computeTotalKg(s) * parseFloat(s.reps); ts++; });
      vol += exV;
      const meta = getExerciseMeta(exId);
      summary.push({ name: meta?.name || exId, sets: valid.length, best: valid.reduce((b,s) => computeTotalKg(s) > computeTotalKg(b) ? s : b, valid[0]) });
    });
    return `
      <div class="history-day" onclick="openWorkout('${d}','${w.dayKey}')">
        <div class="history-day-header">
          <div><div class="history-day-name">${day?.name || 'Custom'}</div><div class="history-date">${formatDateShort(d)} • ${formatDate(d)}</div></div>
          <div style="text-align:right;"><div class="history-volume">${formatNumber(vol)} kg</div><div style="font-size:10px;color:var(--text-tertiary);font-family:'JetBrains Mono',monospace;margin-top:2px;">${ts} seturi</div></div>
        </div>
        <div class="history-exercises">${summary.slice(0,4).map(ex => `<div class="history-exercise-row"><div class="history-exercise-name">${escapeHtml(ex.name)}</div><div class="history-exercise-stats">${ex.sets}× ${displayKg(ex.best)} × ${ex.best.reps}</div></div>`).join('')}</div>
      </div>
    `;
  }).join('');
}

// =================== RANK PAGE ===================
function renderRank(el) {
  const lvl = state.system.level;
  const rank = getRank(lvl);
  const req = getRequiredXP(lvl);
  el.innerHTML = `
    <div class="section-title">Rang</div>
    <div class="rank-hero">
      <div class="rank-hero-badge" style="color:${rank.color}; border-color:${rank.color}; box-shadow:${rank.glow||'none'}; text-shadow:${rank.glow||'none'};">${rank.name}</div>
      <div class="rank-hero-level" style="color:${rank.color}; text-shadow: ${rank.glow || '0 0 18px var(--accent-glow)'};">${lvl}</div>
      <div class="rank-hero-label">Huntress Level</div>
      <div class="rank-xp-bar"><div class="rank-xp-fill" style="width:${Math.min(100,(state.system.xp/req)*100)}%;"></div></div>
      <div class="rank-xp-text">${state.system.xp} / ${req} XP</div>
    </div>
    <div class="section-subtitle" style="margin-top: 18px;">Progresie Rang</div>
    <div class="rank-ladder">
      ${RANK_TIERS.map(t => {
        const current = lvl >= t.min && lvl <= t.max;
        const locked = lvl < t.min;
        return `
          <div class="rank-row ${current?'current':''} ${locked?'locked':''}">
            <div class="rank-letter" style="color:${t.color}; text-shadow:${t.glow||'none'};">${t.key}</div>
            <div class="rank-info">
              <div class="rank-name">${t.name}</div>
              <div class="rank-level-range">LVL ${t.min} — ${t.max >= 9999 ? '∞' : t.max}</div>
            </div>
            ${current ? `<div style="font-size:9px; letter-spacing:1.5px; color: var(--accent); font-weight:700;">CURENT</div>` : locked ? `<div style="font-size:14px; color:var(--text-tertiary);">🔒</div>` : `<div style="font-size:14px;color:var(--success);">✓</div>`}
          </div>
        `;
      }).join('')}
    </div>
    <button class="export-btn" style="margin-top: 18px;" onclick="openWeeklyReport()">📊 Raport Săptămânal</button>
  `;
}

// =================== ACHIEVEMENTS PAGE ===================
function renderAchievements(el) {
  const ach = window.ACHIEVEMENTS;
  const all = Object.values(ach);
  const unlocked = all.filter(a => state.achievements[a.id]).length;
  const total = all.length;
  const byRarity = { bronze: [], silver: [], gold: [], legendary: [] };
  all.forEach(a => { if (byRarity[a.rarity]) byRarity[a.rarity].push(a); });
  const rarityCount = (r) => byRarity[r].filter(a => state.achievements[a.id]).length;
  const pct = total ? Math.round((unlocked / total) * 100) : 0;

  const renderGroup = (rarity, label) => {
    const items = byRarity[rarity];
    if (!items.length) return '';
    return `
      <div class="ach-group">
        <div class="ach-group-header">
          <span class="ach-group-label rarity-${rarity}">${label}</span>
          <span class="ach-group-count">${rarityCount(rarity)}/${items.length}</span>
        </div>
        <div class="achievement-grid">
          ${items.map(a => {
            const ul = !!state.achievements[a.id];
            return `
              <div class="achievement-card ${a.rarity} ${ul?'':'locked'}" onclick="onAchievementClick('${a.id}')">
                <div class="achievement-icon">${a.icon}</div>
                <div class="achievement-title">${a.title}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  };

  el.innerHTML = `
    <div class="section-title">Badges</div>
    <div class="badges-hero">
      <div class="badges-hero-num">${unlocked}<span style="font-size:32px; color: var(--text-tertiary);">/${total}</span></div>
      <div class="badges-hero-label">ACHIEVEMENTS DEBLOCATE</div>
      <div class="badges-progress-bar"><div class="badges-progress-fill" style="width:${pct}%"></div></div>
      <div class="badges-rarity-row">
        <div class="badges-rarity-stat"><span style="color:#cd7f32;">●</span> ${rarityCount('bronze')}<span style="color:var(--text-tertiary);">/${byRarity.bronze.length}</span></div>
        <div class="badges-rarity-stat"><span style="color:#c0c0c0;">●</span> ${rarityCount('silver')}<span style="color:var(--text-tertiary);">/${byRarity.silver.length}</span></div>
        <div class="badges-rarity-stat"><span style="color:var(--gold);">●</span> ${rarityCount('gold')}<span style="color:var(--text-tertiary);">/${byRarity.gold.length}</span></div>
        <div class="badges-rarity-stat"><span style="color:var(--rarity-legendary);">●</span> ${rarityCount('legendary')}<span style="color:var(--text-tertiary);">/${byRarity.legendary.length}</span></div>
      </div>
    </div>
    ${renderGroup('legendary', '◆ LEGENDARY')}
    ${renderGroup('gold', '◆ GOLD')}
    ${renderGroup('silver', '◆ SILVER')}
    ${renderGroup('bronze', '◆ BRONZE')}
    <div style="text-align:center; padding: 16px 0; color: var(--text-tertiary); font-size: 11px; letter-spacing:1.5px;">
      Apasă pe orice badge pentru detalii
    </div>
  `;
}

// =================== HUNTER PAGE ===================
function renderHunter(el) {
  const p = state.profile;
  const lvl = state.system.level;
  const rank = getRank(lvl);
  const totalWorkouts = Object.keys(state.habits).filter(d => state.habits[d].workout_xp_claimed).length;
  const ach = window.ACHIEVEMENTS;
  el.innerHTML = `
    <div class="section-title">Huntress Stats</div>
    <div class="player-status-card">
      <div class="player-rank-badge" style="color:${rank.color}; border-color:${rank.color}; box-shadow:${rank.glow||'none'};">${rank.name}</div>
      <div class="player-level-big" style="color:${rank.color}; text-shadow:${rank.glow||'0 0 20px var(--accent-glow)'};">${lvl}</div>
      <div class="player-xp-detail">${state.system.xp} / ${getRequiredXP(lvl)} XP</div>
      <div class="player-stats-grid">
        <div class="p-stat-box"><div class="p-stat-label">Streak</div><div class="p-stat-val">${state.system.perfectStreak||0}</div></div>
        <div class="p-stat-box"><div class="p-stat-label">Antrenamente</div><div class="p-stat-val">${totalWorkouts}</div></div>
      </div>
    </div>
    <div class="section-subtitle">STATS</div>
    <div class="hunter-stats-grid">
      ${['STR','END','MND','WIL'].map(k => {
        const s = state.stats[k];
        const tier = getStatTier(s.level);
        return `
          <div class="hunter-stat" onclick="showStatDetail('${k}')">
            <div class="stat-code">${k}</div>
            <div class="stat-value-big" style="color:${tier.color}; text-shadow:${tier.glow};">${s.level}</div>
            <div class="stat-bar-vertical"><div class="stat-bar-fill-v" style="height:${statPct(k)}%; background: linear-gradient(180deg, ${tier.color}, var(--accent));"></div></div>
            <div class="stat-tier" style="color:${tier.color};">${tier.name}</div>
            <div class="stat-label-bottom">${statLabel(k)}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div class="info-box" style="font-size: 11px;">
      <strong>STR</strong> antrenamente glute • <strong>END</strong> rutină + hidratare + somn • <strong>MND</strong> lectură + meditație + recunoștință • <strong>WIL</strong> misiuni bonus + disciplină
    </div>

    <div class="card" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; margin-top: 14px;" onclick="navigate('achievements')">
      <div>
        <div class="section-subtitle" style="margin-bottom:4px;">🌹 Badges</div>
        <div style="font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--gold); letter-spacing:1.5px;">${Object.keys(state.achievements).length} / ${Object.keys(ach).length} <span style="font-size:11px; color:var(--text-tertiary); letter-spacing:0;">deblocate</span></div>
      </div>
      <svg fill="none" stroke="var(--accent)" viewBox="0 0 24 24" width="22" height="22" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
    </div>

    <div class="section-title" style="margin-top: 22px;">Profil</div>
    <div class="card">
      <div class="profile-header">
        <div class="avatar" onclick="document.getElementById('photo-input').click()">
          ${p.photo ? `<img src="${p.photo}" alt="Avatar">` : (p.name?.[0] || 'H').toUpperCase()}
          <div class="avatar-edit"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></div>
        </div>
        <input type="file" id="photo-input" accept="image/*" style="display:none" onchange="handlePhotoUpload(event)">
        <div class="profile-name">${escapeHtml(p.name || 'HUNTRESS').toUpperCase()}</div>
        <div class="profile-meta">${p.age?p.age+' ani':''}${p.weight?' • '+p.weight+' kg':''}${p.height?' • '+p.height+' cm':''}</div>
      </div>
    </div>

    <div class="card">
      <div class="section-subtitle">Date Personale</div>
      <div class="form-group"><label class="form-label">Nume</label><input type="text" class="form-input" value="${escapeHtml(p.name||'')}" onchange="updateProfile('name',this.value)"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Vârstă</label><input type="number" class="form-input" value="${p.age||''}" onchange="updateProfile('age',this.value)"></div>
        <div class="form-group"><label class="form-label">Înălțime (cm)</label><input type="number" class="form-input" value="${p.height||''}" onchange="updateProfile('height',this.value)"></div>
      </div>
      <div class="form-group"><label class="form-label">Greutate (kg)</label><input type="number" step="0.1" class="form-input" value="${p.weight||''}" onchange="updateProfile('weight',this.value)"></div>
    </div>

    <div class="card">
      <div class="section-subtitle">Obiective</div>
      <div class="goals-list">
        ${(p.goals||[]).map((g,i) => `<div class="goal-item"><div class="goal-text">${escapeHtml(g)}</div><button class="goal-delete" onclick="deleteGoal(${i})">✕</button></div>`).join('')}
      </div>
      <div class="add-goal-row">
        <input type="text" class="form-input" id="new-goal" placeholder="Ex: Hip thrust 40kg..." onkeypress="if(event.key==='Enter') addGoal()">
        <button class="add-goal-btn" onclick="addGoal()">ADAUGĂ</button>
      </div>
    </div>

    <div class="card">
      <div class="section-subtitle">Setări Bară</div>
      <div class="form-group"><label class="form-label">Greutate Bară (kg)</label><input type="number" step="0.5" class="form-input" value="${state.settings.barWeight}" onchange="updateBarWeight(this.value)"></div>
      <div class="info-box">
        <strong>TOTAL</strong> = greutate totală finală (cabluri, ganteră unică).<br>
        <strong>/ SIDE</strong> = discuri pe o parte (×2 + bara).<br>
        <strong>DB EA</strong> = per ganteră (volumul ×2).
      </div>
    </div>

    <div class="card">
      <div class="section-subtitle">Date</div>
      <button class="export-btn" onclick="manualRecomputeStreak()">🌹 Recalculează Streak din istoric</button>
      <button class="export-btn" onclick="exportData()">📤 Export backup JSON</button>
      <button class="export-btn" onclick="document.getElementById('import-input').click()">📥 Import backup</button>
      <input type="file" id="import-input" accept=".json,application/json" style="display:none" onchange="importData(event)">
      <button class="danger-btn" onclick="resetAllData()">🗑 Șterge TOATE datele</button>
    </div>

    <div style="text-align:center; padding: 24px 0 8px; color: var(--text-tertiary); font-size: 11px; letter-spacing:1.5px;">GLOW HUNTRESS v1.0 • POWERED BY YOU</div>
  `;
}

function statLabel(k) {
  return { STR: 'Forță', END: 'Rezist.', MND: 'Mental', WIL: 'Voință' }[k] || k;
}

// =================== PROFILE ACTIONS ===================
function updateProfile(f, v) {
  state.profile[f] = v;
  saveState();
  if (f === 'name') { const e = document.querySelector('.profile-name'); if (e) e.textContent = (v || 'HUNTRESS').toUpperCase(); }
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      const max = 250;
      let w = img.width, h = img.height;
      if (w > h && w > max) { h = h * max / w; w = max; }
      else if (h > max) { w = w * max / h; h = max; }
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      const data = c.toDataURL('image/jpeg', 0.7);
      if (JSON.stringify({...state, profile: {...state.profile, photo: data}}).length > 4000000) {
        showToast('❌ Imagine prea mare'); return;
      }
      state.profile.photo = data;
      saveState();
      render();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function addGoal() {
  const i = document.getElementById('new-goal');
  const v = i.value.trim();
  if (!v) return;
  if (!state.profile.goals) state.profile.goals = [];
  state.profile.goals.push(v);
  saveState();
  render();
}
function deleteGoal(i) { state.profile.goals.splice(i, 1); saveState(); render(); }
function updateBarWeight(v) { state.settings.barWeight = parseFloat(v) || 20; saveState(); }

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `huntress-backup-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('💾 Backup descărcat');
}

function importData(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = (ev) => {
    try {
      const d = JSON.parse(ev.target.result);
      if (!confirm('Se vor suprascrie TOATE datele. Ești sigură?')) return;
      state = { ...state, ...d, profile: { ...state.profile, ...d.profile } };
      state.system.streakRecomputedV1 = false;
      saveState();
      recomputeStreakFromHabits();
      state.system.streakRecomputedV1 = true;
      processDailyRollover();
      saveState();
      render();
      showToast(`✅ Date importate — streak: ${state.system.perfectStreak} zile`);
    } catch { showToast('❌ Fișier invalid'); }
  };
  r.readAsText(f);
}

function resetAllData() {
  if (!confirm('🚨 Ștergi TOT istoricul și setările? Ireversibil!')) return;
  if (!confirm('Ești 100% sigură? Ultima șansă.')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

// =================== TIMER ===================
let timerSeconds = 90, timerRemaining = 90, timerInterval = null, timerRunning = false;

function openTimer() {
  document.getElementById('timer-modal').classList.remove('hidden');
  updateTimerDisplay();
  document.querySelectorAll('.timer-preset').forEach(b => {
    b.onclick = () => {
      if (timerRunning) return;
      document.querySelectorAll('.timer-preset').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      timerSeconds = parseInt(b.dataset.sec);
      timerRemaining = timerSeconds;
      updateTimerDisplay();
    };
  });
  document.getElementById('timer-toggle').onclick = toggleTimer;
  document.getElementById('timer-reset').onclick = resetTimer;
}
function closeTimer() { document.getElementById('timer-modal').classList.add('hidden'); }
function toggleTimer() { timerRunning ? pauseTimer() : startTimer(); }
function startTimer() {
  if (timerRemaining <= 0) timerRemaining = timerSeconds;
  timerRunning = true;
  document.getElementById('timer-toggle').textContent = 'PAUSE';
  document.getElementById('timer-fab').classList.add('running');
  timerInterval = setInterval(() => { timerRemaining--; updateTimerDisplay(); if (timerRemaining <= 0) timerDone(); }, 1000);
}
function pauseTimer() { timerRunning = false; clearInterval(timerInterval); document.getElementById('timer-toggle').textContent = 'START'; document.getElementById('timer-fab').classList.remove('running'); }
function resetTimer() { pauseTimer(); timerRemaining = timerSeconds; updateTimerDisplay(); }
function timerDone() {
  pauseTimer();
  vibrate([300,150,300,150,500]);
  beep();
  document.getElementById('timer-display').classList.add('done');
  document.querySelector('.timer-ring-progress').classList.add('done');
  setTimeout(() => { document.getElementById('timer-display').classList.remove('done'); document.querySelector('.timer-ring-progress').classList.remove('done'); }, 2500);
}
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.2, 0.4].forEach((dl) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; o.type = 'sine';
      g.gain.setValueAtTime(0.001, ctx.currentTime + dl);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + dl + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dl + 0.15);
      o.start(ctx.currentTime + dl);
      o.stop(ctx.currentTime + dl + 0.15);
    });
  } catch {}
}
function updateTimerDisplay() {
  const m = Math.floor(timerRemaining/60), s = timerRemaining % 60;
  const t = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  document.getElementById('timer-display').textContent = t;
  document.getElementById('timer-fab-text').textContent = t;
  const r = document.querySelector('.timer-ring-progress');
  const c = 2 * Math.PI * 90;
  r.style.strokeDasharray = `${c} ${c}`;
  r.style.strokeDashoffset = c - (timerRemaining / timerSeconds) * c;
  const d = document.getElementById('timer-display');
  d.classList.remove('warning','done'); r.classList.remove('warning','done');
  if (timerRemaining > 0 && timerRemaining <= 10) { d.classList.add('warning'); r.classList.add('warning'); }
}

// =================== INIT ===================
loadState();
if (!state.system.streakRecomputedV1) {
  recomputeStreakFromHabits();
  state.system.streakRecomputedV1 = true;
  saveState();
}
processDailyRollover();
ensureBonusForToday();
ensureBossForWeek();
render();
maybeShowWeeklyReport();

document.body.addEventListener('touchmove', (e) => {
  if (e.target.closest('input, textarea, button, .timer-modal, .modal-overlay')) return;
}, { passive: true });

document.addEventListener('click', (e) => {
  const overlay = e.target.classList && e.target.classList.contains('modal-overlay') ? e.target : null;
  if (!overlay) return;
  if (overlay.id === 'levelup-modal') return;
  overlay.classList.remove('active');
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    processDailyRollover();
    ensureBonusForToday();
    ensureBossForWeek();
    if (currentPage === 'home') render();
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'SW_UPDATED') {
      showToast('🌹 Versiune nouă');
      setTimeout(() => location.reload(), 1500);
    }
  });
}
