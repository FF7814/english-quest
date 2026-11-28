/* 英语启航 EnglishQuest - 应用主逻辑 */
const App = (function () {
  'use strict';
  const KEY = 'eq_state_v1';
  const SOURCE_DAYS = 670;
  // 四级达成校核后调整：每词 4 次关键复习，配合每日 30 项上限，保证到期复习能当天做完、不积压
  const REVIEW_INTERVALS = [1, 3, 7, 15];
  const MAX_DUE_PER_DAY = 36;
  const EASY_WORDS = ALL_WORDS.filter(w => w.lvl <= 2); // 启蒙期高频词：少而精，反复巩固
  // 内置声音风格：不依赖系统语音列表，靠音调塑造不同"语音包"
  const VOICE_STYLES = [
    { key: 'style:gentle', name: '温柔女声', pitch: 1.4 },
    { key: 'style:steady', name: '沉稳男声', pitch: 0.62 },
    { key: 'style:bright', name: '活泼童声', pitch: 1.7 },
    { key: 'style:clear', name: '清晰播报', pitch: 1.0 },
    { key: 'style:slow', name: '慢速教学', pitch: 1.2, rate: 0.86 }
  ];
  // 答题人声台词：默认幽默搞笑，另提供温柔与简洁风格
  const FEEDBACK_LINES = {
    funny: {
      good: [
        '答对啦！你这脑子，是不是偷偷开过光？',
        '漂亮！正确答案被你拿捏得死死的！',
        '就这？这题对你来说是不是太温柔了！',
        '又对了！四级考场已经在向你招手了～',
        '牛啊，再这么下去我这个陪练就要失业了！',
        '拿下！这个单词已经举手投降了！',
        '恭喜你，大脑今日份鸡腿已到账！',
        '答对！你闪闪发光的样子有点晃眼啊！'
      ],
      bad: [
        '哎呀，翻车了！没事，翻过车才记得住路。',
        '错啦！正确答案正在偷偷笑，快把它抓回来！',
        '啊哦，这题给你使了个绊子，再来一次？',
        '别慌，你的大脑只是加载中——进度 99%！',
        '这个坑我先替你踩过了，记住它！',
        '错了也没关系，错误是记忆的调味料嘛。',
        '它逃了！不过下次它就跑不掉了，信我。',
        '差一点点！就差那么一丢丢，你行的！'
      ]
    },
    gentle: {
      good: ['答对啦，真棒！', '太厉害了，继续保持！', '完全正确，你好棒！', '好样的，答对了！', '没错，就是它！'],
      bad: ['差一点点，再想想哦。', '没关系，看看正确答案。', '这题有点难，记住它就赢了。', '别灰心，错了才记得牢。']
    },
    short: {
      good: ['对了！', '漂亮！', '没错！', '很好！'],
      bad: ['再想想。', '差一点。', '不对哦。', '记住它。']
    }
  };
  // 英文答题台词（中英文切换用）
  const FEEDBACK_EN = {
    funny: {
      good: [
        'Nailed it! Your brain is on fire today!',
        'Boom! Correct answer, perfectly caught!',
        'That was easy for you, wasn\'t it?',
        'Another one bites the dust! CET-4, here you come!',
        'Wow, my job as your coach is in danger!',
        'Got it! That word just surrendered to you!',
        'Congrats! Your brain just earned a gold star!',
        'Correct! You are shining way too bright right now!'
      ],
      bad: [
        'Oops! Crash landed. No worries, that is how we learn!',
        'Not quite! The right answer is waving at you, go grab it!',
        'Ah, this question tripped you up. Round two?',
        'Relax, your brain is just loading... 99 percent!',
        'I stepped into that trap first, now you know it too!',
        'Wrong answers are just the spice of memory!',
        'It escaped! Next time it will not get away!',
        'So close! Just a tiny little bit to go, you got this!'
      ]
    },
    gentle: {
      good: ['Well done!', 'Excellent work!', 'Spot on! Keep going!', 'You got it!', 'Great job!'],
      bad: ['Almost there, try once more.', 'That is okay, check the answer.', 'A tricky one, but you will get it.', 'Do not worry, mistakes help us learn.']
    },
    short: {
      good: ['Yes!', 'Nice!', 'Right!', 'Good!'],
      bad: ['Try again.', 'Not quite.', 'Almost.', 'Remember it.']
    }
  };
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  let state = loadState();
  let ex = null; // 当前练习会话
  let toastTimer = null;
  let writeState = null; // 手写练习板状态（独立于答题会话）
  let lessonState = null; // 微课讲解状态（不覆盖答题会话）
  let lessonTimer = null;

  /* ---------- 周期映射：默认 670 天逐日推进；缩短周期时按比例压缩，完整计划不跳课 ---------- */
  function totalDays() { return clamp(state.targetDays || SOURCE_DAYS, 300, SOURCE_DAYS); }
  function courseDay(day) {
    const real = day == null ? state.dayIndex : day;
    const idx = Math.round((real - 1) * (SOURCE_DAYS - 1) / Math.max(1, totalDays() - 1));
    return clamp(idx + 1, 1, SOURCE_DAYS);
  }
  function realDayOf(c) {
    const idx = Math.round((c - 1) * (totalDays() - 1) / (SOURCE_DAYS - 1));
    return clamp(idx + 1, 1, totalDays());
  }
  // 计划按用户真实情况固定：只认识字母名，不认识音标/单词/语法/句子。
  // 因此不提供中学/大学基础切换，任何一天都从同一份启蒙课程表推进，不跳过字母音、音标和自然拼读。
  function effectiveCourseDay(c) { return c; }
  // 按每日可学时长微调单词量，保证任务量合理
  function dailyWordCount(base) {
    const m = state.minutes || 33;
    return clamp(Math.round(base * (m <= 15 ? 0.6 : m >= 45 ? 1.3 : 1)), 2, 14);
  }
  // 重任务日自动减量：完整模考/阅读/写作/翻译当天只背少量新词，把时间留给题型训练
  // 八天循环：听力 → 仔细阅读 → 选词填空 → 长篇匹配 → 写作 → 翻译 → 口语 → 完整模考
  function wordCountForCourse(c) {
    const base = c <= 44 ? 4 : (c <= 90 ? 6 : 12);
    let factor = 1;
    if (c > 90) {
      const mode = (c - 1) % 8;
      if (mode === 7) factor = 0.3;                                  // 完整模考
      else if (mode >= 1 && mode <= 5) factor = 0.6;                 // 阅读/写作/翻译
    }
    return clamp(Math.round(dailyWordCount(base) * factor), 2, 14);
  }
  // 连续累计词序：重任务日减量后仍按“实际新词数”推进，避免旧版按固定步长跳过整段单词
  let wordStartCache = { minutes: null, starts: [] };
  function wordStartForCourse(c) {
    const m = state.minutes || 33;
    if (wordStartCache.minutes !== m) {
      const starts = [];
      starts[1] = 0;
      for (let k = 1; k < SOURCE_DAYS; k++) starts[k + 1] = starts[k] + wordCountForCourse(k);
      wordStartCache = { minutes: m, starts };
    }
    return wordStartCache.starts[clamp(Math.floor(c || 1), 1, SOURCE_DAYS)] || 0;
  }
  // 环绕切片：词序走到词库末尾后从头继续，保证尾部单词也能进入当天任务
  function sliceCycle(src, start, count) {
    if (!src || !src.length) return [];
    const n = Math.max(0, count || 0);
    const s = ((Math.floor(start || 0) % src.length) + src.length) % src.length;
    const out = [];
    for (let i = 0; i < n; i++) out.push(src[(s + i) % src.length]);
    return out;
  }
  // 某类题型第几次出现（用于按题库顺序轮换，避免只反复抽到固定几篇）
  function courseOccurrence(c, mode) {
    if (!c || c <= 90) return 0;
    return Math.max(0, Math.floor((c - 91 - mode) / 8));
  }

  /* ---------- 基础工具 ---------- */
  function defaults() {
    return {
      startDate: null, targetDays: 670, minutes: 33, xp: 0, streak: 0, bestStreak: 0, lastActive: null,
      learnedWords: {}, completed: {}, badges: [], mockScores: [], rate: 0.85, srs: {}, xpLog: {},
      owed: [], misses: 0, lastGap: 0, lastPenaltyDate: null, comeback: null, comebackDone: 0,
      voiceURI: '', voiceFx: true, feedbackVoice: '', feedbackTone: 'funny', feedbackLang: 'zh',
      voiceProfile: null, naturalVoice: true,
      level: 'zero', target: 'cet4', wrongBook: {}, writings: {}, translations: {}, transHistory: {},
      customAudio: { read: {}, feedback: {} }, videos: {}
    };
  }
  function migrateState(s) {
    if (!s.srs) s.srs = {};
    if (!Array.isArray(s.owed)) s.owed = [];
    s.misses = s.misses || 0; s.lastGap = s.lastGap || 0; s.comebackDone = s.comebackDone || 0;
    // 完整四级计划固定 670 天、每日最低 30 分钟；旧存档若选过更短档自动回到可完整覆盖的配置
    s.targetDays = Math.max(300, Math.min(SOURCE_DAYS, Number(s.targetDays) || 670));
    s.minutes = Math.max(30, Math.min(60, Number(s.minutes) || 33));
    if (s.voiceURI === undefined) s.voiceURI = '';
    if (s.naturalVoice === undefined) s.naturalVoice = true;
    s.level = 'zero'; // 固定为只认识字母的起点；旧存档若曾选过其他水平，也统一回到真实起点
    if (!s.target) s.target = 'cet4';
    if (!s.wrongBook || typeof s.wrongBook !== 'object') s.wrongBook = {};
    if (!s.writings || typeof s.writings !== 'object') s.writings = {};
    if (!s.translations || typeof s.translations !== 'object') s.translations = {};
    if (!s.transHistory || typeof s.transHistory !== 'object') s.transHistory = {};
    if (s.voiceFx === undefined) s.voiceFx = true;
    if (s.feedbackVoice === undefined) s.feedbackVoice = '';
    if (!s.feedbackTone || !FEEDBACK_LINES[s.feedbackTone]) s.feedbackTone = 'funny';
    if (!['zh', 'en', 'mix'].includes(s.feedbackLang)) s.feedbackLang = 'zh';
    // 已移除的御姐内置风格：清空旧选择，避免显示不存在的声音
    if (s.voiceURI === 'style:yujie') s.voiceURI = '';
    if (s.feedbackVoice === 'style:yujie') s.feedbackVoice = '';
    if (!s.customAudio || typeof s.customAudio !== 'object') s.customAudio = { read: {}, feedback: {} };
    if (!s.customAudio.read || typeof s.customAudio.read !== 'object') s.customAudio.read = {};
    if (!s.customAudio.feedback || typeof s.customAudio.feedback !== 'object') s.customAudio.feedback = {};
    if (s.voiceProfile !== undefined && s.voiceProfile !== null) {
      const p = s.voiceProfile;
      if (typeof p.pitch !== 'number' || typeof p.rate !== 'number' || typeof p.gender !== 'string') s.voiceProfile = null;
      else { p.pitch = clamp(p.pitch, .5, 2); p.rate = clamp(p.rate, .6, 1.5); p.volume = clamp(p.volume == null ? 1 : p.volume, .5, 1); }
    }
    if (!s.videos || typeof s.videos !== 'object') s.videos = {};
    if (!s.xpLog || typeof s.xpLog !== 'object') s.xpLog = {};
    // 升级兼容：旧存档里今天已完成但没有积分记录的任务，视为已领过 0 分；
    // 已经有记录的绝不覆盖，否则每次重新打开页面都会把已发积分清零，导致重复发放。
    const today = dateKey();
    if (!s.xpLog[today]) s.xpLog[today] = {};
    (s.completed[today] || []).forEach(id => {
      const k = 'task:' + id;
      if (s.xpLog[today][k] === undefined) s.xpLog[today][k] = 0;
    });
    Object.keys(s.learnedWords || {}).forEach(w => {
      const k = 'w:' + w;
      if (!s.srs[k]) {
        const t = (s.learnedWords[w] && s.learnedWords[w].t) || dateKey();
        s.srs[k] = { last: t, due: addDays(t, REVIEW_INTERVALS[0]), stage: 0, ok: 0, bad: 0 };
      }
    });
    // 升级兼容：旧版字母/音标复习 key 为 letter:N / phonetic:N，统一迁移为 l:N / p:N
    Object.keys(s.srs || {}).forEach(k => {
      let nk = null;
      if (k.indexOf('letter:') === 0) nk = 'l:' + k.slice(7);
      else if (k.indexOf('phonetic:') === 0) nk = 'p:' + k.slice(9);
      if (!nk || nk === k) return;
      if (!s.srs[nk]) s.srs[nk] = s.srs[k];
      else if ((s.srs[k].due || '') < (s.srs[nk].due || '')) s.srs[nk] = s.srs[k];
      delete s.srs[k];
    });
    return s;
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      return migrateState(Object.assign(defaults(), JSON.parse(raw)));
    } catch (e) { return defaults(); }
  }
  function saveState() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 隐私模式忽略 */ }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseDate(s) { const p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2], 12); }
  function daysBetween(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }
  function addDays(s, n) { const d = parseDate(s); d.setDate(d.getDate() + n); return dateKey(d); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function pick(arr, n) { return shuffle(arr).slice(0, n); }
  function todayTasksKey() { return dateKey(); }

  function refreshDay() {
    if (!state.startDate) { state.dayIndex = 0; return; }
    const today = dateKey();
    state.dayIndex = clamp(daysBetween(state.startDate, today) + 1, 0, totalDays());
    const gap = state.lastActive ? daysBetween(state.lastActive, today) : 0;
    if (gap > 1) state.streak = 0;
    if (gap > 1 && state.lastPenaltyDate !== today) {
      const missed = gap - 1;
      state.misses = (state.misses || 0) + missed;
      state.lastGap = gap;
      const firstMissedDay = clamp(daysBetween(state.startDate, addDays(state.lastActive, 1)) + 1, 1, totalDays());
      for (let i = 0; i < Math.min(missed, 2); i++) {
        const d = clamp(firstMissedDay + i, 1, totalDays());
        if (state.owed.indexOf(d) === -1) state.owed.push(d);
      }
      state.owed = state.owed.slice(-2);
      if (missed >= 3) state.comeback = { days: missed, date: today };
      state.lastPenaltyDate = today;
      saveState();
    }
  }
  function levelInfo() {
    const level = Math.floor(state.xp / 200) + 1;
    return { level, cur: state.xp % 200, need: 200 };
  }
  function phaseOf(day) {
    const c = courseDay(day);
    for (const p of PHASES) if (c >= p.days[0] && c <= p.days[1]) return p;
    return c < 1 ? PHASES[0] : PHASES[3];
  }
  function wordLevel() {
    const d = courseDay();
    return d <= 90 ? 1 : d <= 365 ? 2 : d <= 547 ? 3 : 4;
  }
  function wordPool() {
    const lv = wordLevel();
    return ALL_WORDS.filter(w => w.lvl <= lv);
  }
  function grammarIndex() { return (courseDay() || 1) % GRAMMAR.length; }

  /* ---------- 间隔重复调度：到期内容自动进入当天计划 ---------- */
  function scheduleItem(kind, id, when) {
    const k = kind + ':' + id;
    if (state.srs[k]) return;
    const t = when || dateKey();
    state.srs[k] = { last: t, due: addDays(t, REVIEW_INTERVALS[0]), stage: 0, ok: 0, bad: 0 };
    saveState();
  }
  function addDaysFromToday(n) { return addDays(dateKey(), n); }
  function dueRawFor(dateStr) {
    return Object.keys(state.srs).filter(k => state.srs[k].due && state.srs[k].due <= dateStr)
      .sort((a, b) => state.srs[a].due.localeCompare(state.srs[b].due) || a.localeCompare(b));
  }
  function dueItemsFor(dateStr) {
    return dueRawFor(dateStr).slice(0, MAX_DUE_PER_DAY).map(k => Object.assign({ key: k }, state.srs[k]));
  }
  function itemLabel(k) {
    const i = k.indexOf(':'); const kind = k.slice(0, i); const id = k.slice(i + 1);
    if (kind === 'w') { const w = ALL_WORDS.find(x => x.w === id); return w ? w.w + '（' + w.cn + '）' : id; }
    if (kind === 'g') { const g = GRAMMAR[Number(id)]; return g ? '语法第 ' + (Number(id) + 1) + ' 讲：' + g.title : '语法第 ' + (Number(id) + 1) + ' 讲'; }
    if (kind === 'p' || kind === 'phonetic') { const p = PHONETICS[Number(id)]; return p ? '音标 ' + p.sym : '音标'; }
    if (kind === 'l' || kind === 'letter') { const l = LETTERS[Number(id)]; return l ? '字母音 ' + l.letter + ' ' + l.sound : '字母音'; }
    return id;
  }
  function dueTaskForDay(day) {
    if (!state.startDate || !day) return null;
    const offset = day - state.dayIndex;
    const key = addDaysFromToday(offset);
    const all = dueRawFor(key);
    if (!all.length) return null;
    const list = all.slice(0, MAX_DUE_PER_DAY);
    const more = all.length - list.length;
    return {
      id: 'e', icon: '⏰', name: '今日到期复习', xp: 25, mod: 'dueReview',
      desc: '到期 ' + list.length + ' 项：' + list.slice(0, 3).map(itemLabel).join('、') + (list.length > 3 ? ' 等' : '') + (more ? '；另有 ' + more + ' 项顺延' : ''),
      cfg: { keys: list, date: key }
    };
  }
  function applyReviewResults() {
    if (!ex || !ex.results) return;
    const today = dateKey();
    ex.results.forEach(r => {
      const item = state.srs[r.key];
      if (!item) return;
      if (r.ok) {
        item.stage = Math.min((item.stage || 0) + 1, REVIEW_INTERVALS.length - 1);
        item.ok = (item.ok || 0) + 1;
      } else { item.stage = 0; item.bad = (item.bad || 0) + 1; }
      item.last = today;
      // 完成全部间隔复习且答对即“毕业”，不再无限循环占用每日复习额度
      item.due = r.ok && item.stage >= REVIEW_INTERVALS.length - 1 ? null : addDays(today, REVIEW_INTERVALS[item.stage]);
    });
    saveState();
  }

  /* ---------- 固定课程表：第 1–730 天，每天内容完全相同、无需选择 ---------- */
  function seededShuffle(arr, seed) {
    const a = arr.slice();
    let s = (seed >>> 0) || 1;
    function rand() {
      s += 0x6D2B79F5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function wordNames(list, n) { return list.slice(0, n).map(w => w.w).join('、') + ' 等'; }

  // 每天固定四项任务，内容按天号推导，任何设备打开同一天看到的都是同一份计划
  // 启蒙期(课程日 1-90 ≈ 实际前 83 天)：字母音 → 音标 → 自然拼读，听力按辨音→辨标→辨词分级
  // 第 91 课程日起恢复原计划：语法 + 整句听力 / 阅读 / 口语 / 模考
  function planForDay(day) {
    day = clamp(Math.floor(day || 1), 1, totalDays());
    const c = effectiveCourseDay(courseDay(day));
    const phase = phaseOf(day);

    // 词汇：按实际新词数连续推进；启蒙期高频词循环，45 课程日起从全词库首词接续并环绕覆盖
    let wordSrc, count, wStart;
    const midBase = wordStartForCourse(45);
    if (c <= 44) {
      wordSrc = EASY_WORDS; count = wordCountForCourse(c);
      wStart = wordStartForCourse(c) % wordSrc.length;
    } else {
      wordSrc = ALL_WORDS; count = wordCountForCourse(c);
      wStart = (wordStartForCourse(c) - midBase) % wordSrc.length;
    }
    const words = sliceCycle(wordSrc, wStart, count);
    const srcKey = wordSrc === EASY_WORDS ? 'easy' : 'all';

    // 任务一：字母音 → 音标 → 音标巩固 → 自然拼读 → 语法
    let first;
    if (c <= 6) {
      const groups = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24,25],[0,4,8,12,16,20,24]];
      const idx = groups[c - 1];
      first = { id:'a', icon:'🔤', name:'字母音学习', desc:'字母 '+idx.map(i=>LETTERS[i].letter).join('、')+' · 练它在单词里的发音', xp:20, mod:'letter', cfg:{ idx, soundMode:true } };
    } else if (c <= 28) {
      const from = (c - 7) * 2;
      const idx = [from, from + 1];
      first = { id:'a', icon:'🔤', name:'音标学习', desc:'音标 '+idx.map(i=>PHONETICS[i].sym).join(' / ')+' · 例词 '+idx.map(i=>PHONETICS[i].ex).join('、'), xp:20, mod:'phonetic', cfg:{ idx } };
    } else if (c <= 44) {
      const base = (c - 29) * 3;
      const idx = [base % 44, (base+1) % 44, (base+2) % 44];
      first = { id:'a', icon:'🔁', name:'音标巩固', desc:'再练音标 '+idx.map(i=>PHONETICS[i].sym).join(' / '), xp:20, mod:'phonetic', cfg:{ idx } };
    } else if (c <= 90) {
      const start = ((c - 45) * 2) % BLEND_LESSONS.length;
      const idx = [start, (start+1) % BLEND_LESSONS.length];
      first = { id:'a', icon:'🧩', name:'自然拼读', desc:'拼读 '+idx.map(i=>BLEND_LESSONS[i].parts.join('+')+'→'+BLEND_LESSONS[i].word).join('、'), xp:20, mod:'blend', cfg:{ idx } };
    } else {
      const gi = (c - 91) % GRAMMAR.length;
      first = { id:'a', icon:'🧩', name:'语法第 '+(gi+1)+' 讲', desc:GRAMMAR[gi].title+' · '+GRAMMAR[gi].point, xp:20, mod:'grammar', cfg:{ idx:gi } };
    }

    // 任务二：固定单词段位
    const second = { id:'b', icon:'📖', name:'每日单词', xp:20, mod:'words',
      desc:'第 '+(wStart+1)+' 词起：'+wordNames(words,3), cfg:{ start:wStart, count, src:srcKey } };

    // 任务三：启蒙期听力分级；第 91 课程日起八天循环，覆盖四级全部题型
    let third;
    if (c <= 6) {
      const base = (c - 1) * 4;
      const idx = [base%26, (base+5)%26, (base+11)%26, (base+17)%26];
      third = { id:'c', icon:'🎧', name:'听音辨字母', desc:'听例词，找出开头字母', xp:20, mod:'listening', cfg:{ kind:'letter', idx } };
    } else if (c <= 28) {
      const base = (c - 7) * 2;
      const idx = [base%44, (base+1)%44, (base+5)%44, (base+11)%44];
      third = { id:'c', icon:'🎧', name:'听音辨音标', desc:'听例词发音，选出对应音标', xp:20, mod:'listening', cfg:{ kind:'phonetic', idx } };
    } else if (c <= 90) {
      const base = 55 + ((c - 45) * 4) % Math.max(1, ALL_WORDS.length - 55 - 4);
      const idx = [base, base+1, base+2, base+3];
      third = { id:'c', icon:'🎧', name:'听词选义', desc:'听已学过的单词，选出中文意思', xp:20, mod:'listening', cfg:{ kind:'word', idx } };
    } else {
      const mode = (c - 1) % 8;
      const n = courseOccurrence(c, mode);
      if (mode === 0) {
        third = { id:'c', icon:'🎧', name:'四级听力训练', desc:'新闻/对话/讲座 · 5 题', xp:20, mod:'cenListening', cfg:{ seed:n * 5 + 1 } };
      } else if (mode === 1) {
        const p = CET4_CAREFUL[n % CET4_CAREFUL.length];
        third = { id:'c', icon:'📚', name:'仔细阅读', desc:'《'+p.title+'》· '+p.qs.length+' 题', xp:20, mod:'cenReading', cfg:{ kind:'careful', seed:n % CET4_CAREFUL.length } };
      } else if (mode === 2) {
        const z = CET4_CLOZE[n % CET4_CLOZE.length];
        third = { id:'c', icon:'📚', name:'选词填空', desc:'《'+z.title+'》· '+z.ans.length+' 空', xp:20, mod:'cenReading', cfg:{ kind:'cloze', seed:n % CET4_CLOZE.length } };
      } else if (mode === 3) {
        const m = CET4_MATCHING[n % CET4_MATCHING.length];
        third = { id:'c', icon:'📚', name:'长篇阅读匹配', desc:'《'+m.title+'》· '+m.statements.length+' 题', xp:20, mod:'cenReading', cfg:{ kind:'matching', seed:n % CET4_MATCHING.length } };
      } else if (mode === 4) {
        const w = CET4_WRITING[n % CET4_WRITING.length];
        third = { id:'c', icon:'✍️', name:'四级写作', desc:'《'+w.title+'》· 范文对照', xp:20, mod:'writing', cfg:{ id:w.id } };
      } else if (mode === 5) {
        const t = CET4_TRANSLATION[n % CET4_TRANSLATION.length];
        third = { id:'c', icon:'🌏', name:'四级翻译', desc:'汉译英 · '+t.cn.slice(0,14)+'…', xp:20, mod:'translation', cfg:{ id:t.id } };
      } else if (mode === 6) {
        const ti = n % SPEAK_TOPICS.length;
        third = { id:'c', icon:'🎤', name:'口语跟读', desc:'话题 '+(ti+1)+'：'+SPEAK_TOPICS[ti].q, xp:20, mod:'speaking', cfg:{ idx:ti } };
      } else {
        third = { id:'c', icon:'📝', name:'四级真题模考', desc:'完整流程 · 听力+词汇+阅读+翻译+写作', xp:30, mod:'mockFull', cfg:{ seed:n + 1 } };
      }
    }

    // 任务四：游戏与复习隔天交替（启蒙期聚焦已学高频词）
    const gSrc = c <= 44 ? EASY_WORDS : ALL_WORDS;
    const gBase = c <= 44 ? ((c-1)*4) % gSrc.length : (c*5) % gSrc.length;
    const gWords = sliceCycle(gSrc, gBase, 5);
    const gKey = gSrc === EASY_WORDS ? 'easy' : 'all';
    const fourth = c % 2 === 0
      ? { id:'d', icon:'🎮', name:'单词配对游戏', desc:'第 '+(gBase+1)+' 词起配对：'+wordNames(gWords,2), xp:15, mod:'game', cfg:{ start:gBase, count:5, src:gKey } }
      : { id:'d', icon:'🔁', name:'复习巩固', desc:'复习第 '+(gBase+1)+' 词起：'+wordNames(gWords,2), xp:15, mod:'review', cfg:{ start:gBase, count:5, src:gKey } };

    return [first, second, third, fourth];
  }

  function dailyTasks(day) {
    const n = day == null ? state.dayIndex : day;
    const base = planForDay(n);
    const due = dueTaskForDay(n);
    const list = due ? base.concat([due]) : base;
    if (n === state.dayIndex && state.owed.length) {
      state.owed.forEach(d => {
        const t = planForDay(d);
        const w = t.find(x => x.id === 'b');
        list.push({
          id: 'f_' + d, icon: '🧾', name: '补做第 ' + d + ' 天', xp: 15, mod: 'review',
          desc: '断签欠账：' + (w ? w.desc : '当日核心单词'),
          cfg: { start: w && w.cfg ? w.cfg.start : null, count: w && w.cfg ? w.cfg.count : 8 }
        });
      });
    }
    return list;
  }
  // 单任务预计用时（分钟）：用于把“每天 33 分钟”落到每个任务上，避免内容变多后时间却不变
  function taskMinutes(t) {
    if (!t) return 0;
    const m = t.mod;
    const cfg = t.cfg || {};
    if (m === 'mockFull') return 25;
    if (m === 'cenReading') return 8;
    if (m === 'writing') return 12;
    if (m === 'translation') return 10;
    if (m === 'cenListening' || m === 'speaking') return 5;
    if (m === 'dueReview') return Math.min(9, 0.3 * ((cfg.keys || []).length || 5));
    if (m === 'words') return 0.5 * (cfg.count || 6);
    if (m === 'letter' || m === 'phonetic' || m === 'blend') return 0.6 * ((cfg.idx || []).length || 2);
    if (m === 'grammar') return 1.5;
    if (m === 'game' || m === 'review') return 2.5;
    return 3;
  }
  function planMinutes(day) {
    const tasks = dailyTasks(day == null ? state.dayIndex : day);
    return Math.max(1, Math.round(tasks.reduce((sum, t) => sum + taskMinutes(t), 0)));
  }
  function doneList() { return state.completed[todayTasksKey()] || []; }
  function isDone(id) { return doneList().indexOf(id) !== -1; }

  /* ---------- 奖励与成就 ---------- */
  function award(xp) { state.xp += xp; saveState(); checkBadges(); updateHeader(); }
  // 任务积分 = 任务最高分 × 答对题数 / 总题数；例如 20 分 4 题，答对 2 题得 10 分
  function taskXpFor(task, correct, total) {
    if (!task || !task.xp || !total || total <= 0) return 0;
    return clamp(Math.round(task.xp * (correct || 0) / total), 0, task.xp);
  }
  function taskById(id) { return dailyTasks().find(t => t.id === id); }
  // 同一任务当天累计发放，取历史最高分补差额：先答对 2 题拿 10 分，重做答对 4 题再补 10 分，最多拿满任务分
  function completeTask(id, targetXp) {
    const key = todayTasksKey();
    if (!state.completed[key]) state.completed[key] = [];
    if (state.completed[key].indexOf(id) === -1) state.completed[key].push(id);
    if (state.lastActive !== dateKey()) {
      state.streak = (state.lastActive === dateKey(new Date(Date.now() - 86400000))) ? state.streak + 1 : 1;
      state.lastActive = dateKey();
      state.bestStreak = Math.max(state.bestStreak || 0, state.streak);
    }
    if (id.indexOf('f_') === 0) {
      const d = Number(id.slice(2));
      state.owed = state.owed.filter(x => x !== d);
    }
    const task = taskById(id);
    const cap = task ? task.xp : Math.max(0, targetXp || 0);
    const day = dateKey();
    if (!state.xpLog[day]) state.xpLog[day] = {};
    const logKey = 'task:' + id;
    const prev = state.xpLog[day][logKey] || 0;
    const next = clamp(Math.max(prev, Math.round(targetXp || 0)), 0, cap);
    const delta = next - prev;
    if (delta > 0) { state.xpLog[day][logKey] = next; award(delta); }
    return delta;
  }
  function awardTaskScore(id, correct, total) {
    const task = taskById(id);
    if (!task) return 0;
    return completeTask(id, taskXpFor(task, correct, total));
  }
  function checkBadges() {
    BADGES.forEach(b => {
      if (state.badges.indexOf(b.id) === -1 && b.check(state)) {
        state.badges.push(b.id);
        setTimeout(() => { toast('🏅 解锁成就：' + b.name); confetti(); }, 400);
      }
    });
    saveState();
  }
  function confetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti';
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const colors = ['#6C5CE7', '#FF9F43', '#00B894', '#E84393', '#FDCB6E'];
    const parts = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width, y: -20 - Math.random() * 200,
      vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4,
      size: 5 + Math.random() * 7, color: colors[Math.floor(Math.random() * colors.length)], rot: Math.random() * 6
    }));
    let frames = 0;
    function tick() {
      frames++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += .04; p.rot += .12;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .7);
        ctx.restore();
      });
      if (frames < 150) requestAnimationFrame(tick); else canvas.remove();
    }
    tick();
  }
  let toastTimer2;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer2);
    toastTimer2 = setTimeout(() => el.classList.remove('show'), 2200);
  }
  function voiceList() {
    if (!('speechSynthesis' in window)) return [];
    try { return window.speechSynthesis.getVoices() || []; } catch (e) { return []; }
  }
  function englishVoices() { return voiceList().filter(v => /^en/i.test(v.lang) || /english/i.test(v.name)); }
  function chosenVoice() {
    if (!state.voiceURI) return null;
    return englishVoices().find(v => v.voiceURI === state.voiceURI || v.name === state.voiceURI) || null;
  }
  function femaleVoice(list) {
    const re = /female|aria|zira|jenny|samantha|kate|victoria|linda|susan|karen|moira|tessa|fiona|serena|nora|libby|ava|emma|zoe|lily|lucy|michelle|natasha|helen|huihui|xiaoxiao|tingting|ting-ting|yaoyao|mei-jia|sin-ji/i;
    return list.find(v => re.test(v.name)) || null;
  }
  function maleVoice(list) {
    const re = /male|daniel|alex|david|george|guy|ryan|fred|arthur|thomas|oliver|james|yunxi|yunyang|kangkang|liangliang|dong|male/i;
    const notFemale = list.filter(v => !/female|aria|zira|jenny|samantha|kate|victoria|linda|susan|karen|moira|tessa|fiona|serena|nora|libby|ava|emma|zoe|lily|lucy|michelle|natasha|helen|huihui|xiaoxiao|tingting|yaoyao|mei-jia|sin-ji/i.test(v.name));
    return notFemale.find(v => re.test(v.name)) || notFemale[0] || null;
  }
  function genderLabel(g) { return g === 'female' ? '女声' : g === 'male' ? '男声' : '中性'; }

  /* ---------- 音色识别：录一段 → 分析音色 → 生成朗读/提示语音包 ---------- */
  const VOICE_SAMPLE = 'Hello! This is my voice. Let us learn English together.';
  let recState = null;
  let audioEl = null;
  function playClip(src, onend) {
    try {
      if (audioEl) audioEl.pause();
      audioEl = new Audio(src);
      if (onend) audioEl.onended = onend;
      audioEl.play().catch(() => {});
      return true;
    } catch (e) { return false; }
  }
  function recSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }
  // 基频估计：在有声帧上做归一化自相关，取中位频率
  function estimateF0(samples, sr) {
    const frame = Math.floor(sr * .04), minLag = Math.floor(sr / 400), maxLag = Math.min(Math.floor(sr / 70), frame - 2);
    const step = 3, frames = [];
    for (let s = 0; s + frame <= samples.length; s += frame) frames.push(s);
    const picked = frames.length > 24 ? frames.filter((_, i) => i % Math.ceil(frames.length / 24) === 0) : frames;
    const found = [];
    picked.forEach(s => {
      let e = 0;
      for (let i = s; i < s + frame; i++) e += samples[i] * samples[i];
      if (Math.sqrt(e / frame) < .008) return;
      let bestLag = -1, best = 0;
      const corrs = [];
      for (let lag = minLag; lag <= maxLag; lag++) {
        let num = 0, p = 0, q = 0;
        for (let i = s; i + lag < s + frame; i += step) {
          const a = samples[i], b = samples[i + lag];
          num += a * b; p += a * a; q += b * b;
        }
        const c = num / (Math.sqrt(p * q) + 1e-9);
        corrs[lag] = c;
        if (c > best) { best = c; bestLag = lag; }
      }
      // 倍频修正：自相关常把 220Hz 误判成 110Hz（取了 2 倍周期），
      // 若 lag/2 处的相关度接近峰值，就取更短的 lag（更高的基频）。
      let outLag = bestLag, outBest = best;
      for (let div = 2; div <= 3; div++) {
        const cand = Math.round(bestLag / div);
        if (cand < minLag) continue;
        let localMax = 0, localLag = cand;
        for (let l = Math.max(minLag, cand - 3); l <= Math.min(maxLag, cand + 3); l++) {
          if ((corrs[l] || 0) > localMax) { localMax = corrs[l]; localLag = l; }
        }
        if (localMax > best * .82) { outLag = localLag; outBest = localMax; break; }
      }
      if (outLag > 0 && outBest > .4) found.push(sr / outLag);
    });
    if (!found.length) return 0;
    found.sort((a, b) => a - b);
    return found[Math.floor(found.length / 2)];
  }
  function estimateZcr(samples) {
    let cross = 0, n = 0;
    for (let i = 3; i < samples.length; i += 3) {
      if ((samples[i] >= 0) !== (samples[i - 3] >= 0)) cross++;
      n++;
    }
    return n ? cross / n : 0;
  }
  function estimateSyllRate(samples, sr, duration) {
    const frame = Math.floor(sr * .04), energies = [];
    for (let s = 0; s + frame <= samples.length; s += frame) {
      let e = 0;
      for (let i = s; i < s + frame; i++) e += samples[i] * samples[i];
      energies.push(Math.sqrt(e / frame));
    }
    if (!energies.length) return 0;
    const mean = energies.reduce((a, b) => a + b, 0) / energies.length;
    let bursts = 0, above = false;
    energies.forEach(e => {
      if (e > mean * 1.25 && !above) { bursts++; above = true; }
      else if (e < mean * .8) above = false;
    });
    return bursts / Math.max(duration, .1);
  }
  function closeAudioCtx(ctx) { try { const p = ctx.close(); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
  function markRecording() {
    const btn = $('#voiceRecBtn');
    if (btn) { btn.textContent = recState ? '■ 停止录音' : (state.voiceProfile ? '🎙️ 重新录一段' : '🎙️ 开始录一段'); btn.classList.toggle('recording', !!recState); }
    const st = $('#voiceRecStatus');
    if (st) st.textContent = recState ? '● 正在听你说话…（最多 8 秒，也可以点按钮结束）' : (state.voiceProfile ? '识别完成，可随时重录' : '允许麦克风后，读出上面那句英文即可；说完自动识别。');
  }
  function toggleRecord() {
    if (recState) { try { recState.mr.stop(); } catch (e) {} return; }
    if (!recSupported()) { toast('当前浏览器不支持录音，请用 Chrome / Edge 或手机浏览器打开'); return; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
      const mt = types.find(t => window.MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) || '';
      let mr;
      try { mr = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined); }
      catch (e) { try { mr = new MediaRecorder(stream); } catch (e2) { stream.getTracks().forEach(t => t.stop()); toast('录音启动失败'); return; } }
      const chunks = [];
      mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        recState = null; markRecording();
        const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
        if (!blob.size) { toast('没录到声音，再试一次'); return; }
        if (blob.size > 800 * 1024) { toast('录音太长啦，请控制在 8 秒内'); return; }
        const st = $('#voiceRecStatus');
        if (st) st.textContent = '🔍 正在识别你的音色…';
        blob.arrayBuffer().then(ab => analyzeVoice(ab, blob)).catch(() => toast('识别失败，请再录一次'));
      };
      mr.start();
      recState = { mr, stream };
      markRecording();
      setTimeout(() => { if (recState && recState.mr === mr) { try { mr.stop(); } catch (e) {} } }, 8000);
    }).catch(() => toast('无法使用麦克风，请检查浏览器权限'));
  }
  function analyzeVoice(arrayBuffer, blob) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { toast('浏览器不支持音频分析'); return; }
    const ctx = new AC();
    ctx.decodeAudioData(arrayBuffer.slice(0), buf => {
      const data = buf.getChannelData(0), sr = buf.sampleRate;
      const f0 = estimateF0(data, sr), zcr = estimateZcr(data), syll = estimateSyllRate(data, sr, buf.duration);
      const gender = f0 >= 180 ? 'female' : f0 > 0 && f0 < 155 ? 'male' : (zcr > .12 ? 'female' : 'male');
      const base = gender === 'female' ? 205 : 125;
      const pitch = f0 ? clamp(f0 / base, .65, 1.55) : (gender === 'female' ? 1.18 : .82);
      const rate = syll ? clamp(syll / 4.2, .8, 1.3) : 1;
      const fr = new FileReader();
      fr.onload = () => {
        state.voiceProfile = {
          pitch: Number(pitch.toFixed(2)), rate: Number(rate.toFixed(2)), volume: 1,
          gender, f0: Math.round(f0), zcr: Number(zcr.toFixed(3)), syll: Number(syll.toFixed(2)),
          sample: String(fr.result), created: dateKey()
        };
        // 生成后直接用于朗读和提示音
        state.voiceURI = 'style:mine';
        state.feedbackVoice = 'style:mine';
        saveState(); renderMe();
        closeAudioCtx(ctx);
        toast('🎉 已识别你的音色，朗读和提示音都换成「我的声音」啦');
        speakZh('已识别你的音色，现在开始用你的声音陪你学习。');
      };
      fr.onerror = () => { closeAudioCtx(ctx); toast('录音保存失败，请再试一次'); };
      fr.readAsDataURL(blob);
    }, () => { closeAudioCtx(ctx); toast('音频解码失败，请再录一次'); });
  }
  // 把音色档案套用到系统语音上（朗读 + 提示音通用）
  function mineVoiceFor(lang) {
    const p = state.voiceProfile;
    if (!p) return null;
    const list = /^zh/i.test(lang || '') ? voiceList().filter(v => /^zh/i.test(v.lang)) : englishVoices();
    return (p.gender === 'female' ? femaleVoice(list) : maleVoice(list)) || list[0] || null;
  }
  function minePitch(base) {
    const p = state.voiceProfile;
    return p ? clamp(p.pitch, .5, 2) : (base || 1);
  }
  function mineRate(base) {
    const p = state.voiceProfile;
    return p ? clamp(p.rate, .6, 1.5) : (base || 1);
  }

  // 优先挑设备里最像真人的语音：自然/神经音色 > 常见高质量音色 > 普通系统音
  function voiceNaturalScore(v) {
    const n = String(v.name || '').toLowerCase();
    let s = 0;
    if (/natural|neural|premium|enhanced/.test(n)) s += 100;
    if (/aria|jenny|guy|sonia|ana|emma|brian|google|microsoft|samantha|daniel|karen|victoria|zira/.test(n)) s += 50;
    if (/espeak|pico|compact|robot|sapi/.test(n)) s -= 100;
    if (v.localService) s += 5;
    return s;
  }
  function pickNaturalVoice(lang) {
    const list = voiceList().filter(x => (lang && /^zh/i.test(lang)) ? /^zh/i.test(x.lang) : /^en/i.test(x.lang));
    if (!list.length) return null;
    return list.slice().sort((a, b) => voiceNaturalScore(b) - voiceNaturalScore(a))[0];
  }
  function speechPieces(text) {
    const s = String(text || '').trim();
    if (s.length <= 55 || !/[.!?。！？；;]/.test(s)) return [s];
    const parts = s.split(/([.!?。！？；;])\s+/);
    const out = [];
    for (let i = 0; i < parts.length; i += 2) out.push((parts[i] || '') + (parts[i + 1] || ''));
    return out.filter(Boolean);
  }
  function speak(text, rate, opts) {
    opts = opts || {};
    if (!('speechSynthesis' in window)) { if (!opts.silent) toast('当前浏览器不支持语音朗读'); return null; }
    try {
      window.speechSynthesis.cancel();
      const key = opts.voiceURI || state.voiceURI;
      const st = VOICE_STYLES.find(s => s.key === key);
      const natural = state.naturalVoice !== false && !opts.noNatural;
      const usingMine = key === 'style:mine' && !!state.voiceProfile;
      const isZh = !!(opts.lang && /^zh/i.test(opts.lang));
      const pool = isZh ? voiceList().filter(x => /^zh/i.test(x.lang)) : englishVoices();
      let v = null;
      if (usingMine) v = mineVoiceFor(isZh ? 'zh-CN' : 'en-US') || pool[0] || null;
      else if (key && key !== 'none' && !st) v = pool.find(x => x.voiceURI === key || x.name === key) || null;
      else if (natural) v = pickNaturalVoice(isZh ? 'zh-CN' : 'en-US');
      else if (key === 'none') v = null;
      else v = chosenVoice() || pool[0] || null;
      if (!v && key === 'none' && !natural && isZh) v = femaleVoice(pool);
      const pieces = natural && !opts.noSplit ? speechPieces(text) : [String(text || '')];
      let firstU = null, i = 0;
      const make = (piece) => {
        const u = new SpeechSynthesisUtterance(piece);
        if (v) { try { u.voice = v; } catch (e) {} }
        u.lang = v ? v.lang : (isZh ? 'zh-CN' : 'en-US');
        const baseRate = natural ? clamp(rate || state.rate || .95, .75, 1.15) : ((rate || state.rate || .85) * ((st && !opts.noStyle && st.rate) ? st.rate : 1));
        u.rate = usingMine ? mineRate(baseRate) : baseRate;
        u.pitch = usingMine ? minePitch(1) : (natural ? 1 : ((st && !opts.noStyle) ? st.pitch : 1));
        u.volume = usingMine ? state.voiceProfile.volume : 1;
        return u;
      };
      const next = () => {
        if (i >= pieces.length) { if (opts.onend) opts.onend(); return; }
        const u = make(pieces[i++]);
        if (!firstU) firstU = u;
        u.onend = () => setTimeout(next, natural ? 110 : 40);
        u.onerror = (e) => { if (opts.onerror) opts.onerror(e); };
        window.speechSynthesis.speak(u);
      };
      next();
      return firstU;
    } catch (e) { if (!opts.silent) toast('语音播放失败，请检查系统语音包'); return null; }
  }
  function speakZh(text, opts) {
    opts = opts || {};
    return speak(text, opts.rate || 1.05, Object.assign({ lang: 'zh-CN', noStyle: true }, opts));
  }
  function feedbackPool() {
    const tone = FEEDBACK_LINES[state.feedbackTone] ? state.feedbackTone : 'funny';
    const en = FEEDBACK_EN[tone] || FEEDBACK_EN.funny;
    const zh = FEEDBACK_LINES[tone];
    if (state.feedbackLang === 'en') return en;
    if (state.feedbackLang === 'mix') return { good: zh.good.concat(en.good), bad: zh.bad.concat(en.bad) };
    return zh;
  }
  function voiceFeedback(ok, force) {
    if (!state.voiceFx && !force) return;
    const pool = feedbackPool();
    const arr = ok ? pool.good : pool.bad;
    const line = arr[Math.floor(Math.random() * arr.length)];
    if (!('speechSynthesis' in window)) return line;
    // 空表示跟随朗读声音；'none' 表示系统原声；其余为内置风格或系统语音 URI
    const uri = state.feedbackVoice || state.voiceURI;
    const enLine = /^[\x20-\x7E\s]+$/.test(line);
    const rate = state.feedbackTone === 'funny' ? 1.1 : 1.05;
    if (enLine) speak(line, rate, { voiceURI: uri, noStyle: false });
    else speakZh(line, { noStyle: false, voiceURI: uri, rate });
    return line;
  }

  /* ---------- 微课讲解：动画 + 字幕 + 语音，离线可用，可挂接自定义视频 ---------- */
  function lessonName(kind) {
    return { word: '单词', phonetic: '音标', grammar: '语法', mock: '模考' }[kind] || '知识';
  }
  function lessonScript(kind, item) {
    if (!item) return [];
    if (kind === 'word') {
      const w = item;
      return [
        { tag: '第 1 步 · 认识它', big: w.w, sub: w.ph || '', note: '这个词是 ' + w.w + '，跟我读三遍。', en: w.w, sec: 6 },
        { tag: '第 2 步 · 记住意思', big: w.cn, sub: w.w + ' = ' + w.cn, note: '它的意思是' + w.cn + '。先记住意思，拼写可以慢慢来。', sec: 6 },
        { tag: '第 3 步 · 放进句子', big: w.ex || w.w, sub: w.cnEx || '', note: '看例句：' + (w.ex || w.w) + '，' + (w.cnEx || w.cn) + '。一个词配一句话，更好记。', en: w.ex, sec: 8 },
        { tag: '第 4 步 · 记忆小窍门', big: '💡', sub: '把「' + w.cn + '」和这个词连成一个画面', note: '现在合上画面，自己说出 ' + w.w + ' 和它的意思。能说出来，就算真的记住了。', sec: 7 }
      ];
    }
    if (kind === 'phonetic') {
      const p = item;
      return [
        { tag: '第 1 步 · 看清符号', big: p.sym, sub: p.type, note: '这是' + p.type + '，符号写作 ' + p.sym + '，先记住它长什么样。', sec: 6 },
        { tag: '第 2 步 · 听发音', big: '🔊', sub: '点下面的喇叭，再听两遍', note: '仔细听这个音，注意口型和长短。', en: p.ex, sec: 6 },
        { tag: '第 3 步 · 例词跟读', big: p.ex, sub: p.cn, note: '跟着读 ' + p.ex + '，感受 ' + p.sym + ' 这个音。', en: p.ex, sec: 7 },
        { tag: '第 4 步 · 反过来想', big: p.sym + ' ↔ ' + p.ex, sub: '音标 + 例词一起记', note: '先想例词 ' + p.ex + '，再回想音标 ' + p.sym + '，这样记得更牢。', sec: 7 }
      ];
    }
    if (kind === 'grammar') {
      const g = item;
      return [
        { tag: '第 1 步 · 今天讲什么', big: g.title, sub: '别背术语，先看它怎么用', note: '今天我们学：' + g.title + '。不用死记概念，看懂例子就会用。', sec: 6 },
        { tag: '第 2 步 · 核心规则', big: g.point.length > 46 ? g.point.slice(0, 46) + '…' : g.point, sub: g.point, note: '记住这条规则：' + g.point, sec: 9 },
        { tag: '第 3 步 · 例句拆解', big: g.ex, sub: g.cn, note: '看例句：' + g.ex + '，' + g.cn + '。找找规则在句子里体现在哪儿。', en: g.ex, sec: 9 },
        { tag: '第 4 步 · 避开陷阱', big: '⚠️', sub: g.why, note: '最容易错的地方是：' + g.why + ' 考试就爱考这里。', sec: 8 },
        { tag: '第 5 步 · 做题口诀', big: '找主语 → 看时间 → 定形式', sub: '遇到这类题，按这三步想', note: '做语法题的口诀：先找主语，再看时间，最后确定动词形式。', sec: 8 }
      ];
    }
    if (kind === 'mock') {
      const q = item;
      return [
        { tag: '第 1 步 · 读懂题目', big: q.q, sub: '先圈出关键词', note: '别急着选。先看清题目问的是什么，把关键词圈出来。', sec: 7 },
        { tag: '第 2 步 · 逐个排除', big: '🔍', sub: '明显不对的先划掉', note: '四个选项一个个看，明显不对的先排除，剩下两个再比较。', sec: 7 },
        { tag: '第 3 步 · 锁定答案', big: q.opts[q.ans], sub: q.why || '', note: '正确答案是 ' + q.opts[q.ans] + '。' + (q.why || '') + ' 记住这个考点。', sec: 9 }
      ];
    }
    return [];
  }
  function stopLessonTimer() { if (lessonTimer) { clearInterval(lessonTimer); lessonTimer = null; } }
  let lessonSpeakToken = 0;
  // 按实际文本长度估算兜底时长：中文每字约 280ms，英文每字母约 90ms + 停顿，留 1.6 倍余量
  function lessonStepDuration(s) {
    const zh = (s.note || '').length * 280;
    const en = s.en ? (s.en.length * 90 + 1200) : 0;
    return Math.max(7000, Math.ceil((zh + en) * 1.6));
  }
  function lessonSay() {
    const L = lessonState;
    if (!L) return;
    const s = lessonScript(L.kind, L.item)[L.step];
    if (!s) return;
    const stepAt = L.step;
    const myToken = ++lessonSpeakToken;
    const alive = () => lessonState === L && L.step === stepAt && L.playing && lessonSpeakToken === myToken;
    const advance = () => { if (alive()) window.setTimeout(() => { if (alive()) lessonGo(1); }, 500); };
    let enStarted = false;
    const playEn = () => {
      if (!alive() || enStarted) return;
      enStarted = true;
      const eu = speak(s.en, Math.max(.72, state.rate), { silent: true, onend: advance, onerror: advance });
      if (!eu) advance();
    };
    const zu = speakZh(s.note, { onend: s.en ? playEn : advance, onerror: s.en ? playEn : advance });
    if (!zu) { if (s.en) playEn(); else advance(); }
  }
  function renderLesson(say) {
    const L = lessonState;
    if (!L) return;
    const steps = lessonScript(L.kind, L.item);
    const s = steps[L.step];
    const pct = Math.round((L.step + L.sec / s.sec) / steps.length * 100);
    const url = state.videos[L.kind];
    let media = '';
    if (url) {
      media = /\.(mp4|webm|ogg|m4v|mov)(\?|$)/i.test(url)
        ? '<video class="lesson-video" controls playsinline src="' + esc(url) + '"></video>'
        : '<div class="lesson-link">🎞️ 已设置讲解视频：<a href="' + esc(url) + '" target="_blank" rel="noopener">点此打开视频</a></div>';
    }
    openModal(
      '<div class="modal-head"><h2>🎬 ' + lessonName(L.kind) + '微课讲解</h2><button class="close-btn" data-action="lessonClose">×</button></div>' +
      '<div class="lesson-stage">' +
        '<div class="lesson-top"><span>英语启航 · 微课课堂</span><span>' + (L.step + 1) + ' / ' + steps.length + '</span></div>' +
        '<div class="lesson-teacher">👩‍🏫</div>' +
        '<div class="lesson-tag">' + esc(s.tag) + '</div>' +
        '<div class="lesson-big">' + esc(s.big) + '</div>' +
        (s.sub && s.sub !== s.big ? '<div class="lesson-sub">' + esc(s.sub) + '</div>' : '') +
        (L.captions ? '<div class="lesson-caption">' + esc(s.note) + '</div>' : '') +
        '<div class="lesson-bar"><i style="width:' + pct + '%"></i></div>' +
      '</div>' +
      media +
      '<div class="lesson-controls">' +
        '<button class="btn sm" data-action="lessonPrev">⏮ 上一段</button>' +
        '<button class="btn sm" data-action="lessonToggle">' + (L.playing ? '⏸ 暂停' : '▶ 播放') + '</button>' +
        '<button class="btn sm" data-action="lessonNext">下一段 ⏭</button>' +
        '<button class="btn sm" data-action="lessonCaption">' + (L.captions ? '隐藏字幕' : '显示字幕') + '</button>' +
        '<button class="btn sm" data-action="lessonReplay">↻ 重播</button>' +
      '</div>' +
      '<button class="btn primary big" data-action="lessonBack">学会啦，返回学习 →</button>'
    );
    if (say) lessonSay();
  }
  function openLesson(kind, item) {
    if (!lessonScript(kind, item).length) { toast('这一题暂时没有讲解内容'); return; }
    const prev = $('#modal').innerHTML;
    lessonState = { kind, item, step: 0, sec: 0, playing: true, captions: true, prevHtml: prev };
    renderLesson(true);
    stopLessonTimer();
    lessonTimer = setInterval(() => {
      const L = lessonState;
      if (!L || !L.playing) return;
      const steps = lessonScript(L.kind, L.item);
      L.sec += 0.1;
      const bar = $('.lesson-bar i');
      if (bar) bar.style.width = Math.round((L.step + L.sec / steps[L.step].sec) / steps.length * 100) + '%';
      if (L.sec * 1000 >= lessonStepDuration(steps[L.step])) lessonGo(1);
    }, 100);
  }
  function lessonGo(d) {
    const L = lessonState;
    if (!L) return;
    const steps = lessonScript(L.kind, L.item);
    const n = L.step + d;
    if (n >= steps.length) {
      stopLessonTimer(); L.playing = false;
      toast('🎬 微课讲完啦，去练一练吧');
      renderLesson(false);
      return;
    }
    L.step = Math.max(0, n); L.sec = 0;
    renderLesson(true);
  }
  function closeLesson() {
    if (!lessonState) return;
    const prev = lessonState.prevHtml;
    stopLessonTimer();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    lessonState = null;
    $('#modal').innerHTML = '<div class="modal-box">' + prev + '</div>';
    $('#modal').classList.remove('hidden');
  }

  /* ---------- 弹层 ---------- */
  function openModal(html) {
    const m = $('#modal');
    m.innerHTML = '<div class="modal-box">' + html + '</div>';
    m.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    stopLessonTimer(); lessonState = null;
    if (dialogueState && dialogueState.rec) { try { dialogueState.rec.stop(); } catch (e) {} }
    dialogueState = null;
    document.body.classList.remove('write-fs');
    if (document.fullscreenElement && document.exitFullscreen) { try { document.exitFullscreen().catch(() => {}); } catch (e) {} }
    $('#modal').classList.add('hidden');
    $('#modal').innerHTML = '';
    document.body.style.overflow = '';
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    ex = null; writeState = null;
    render();
  }
  function modalHead(title) {
    return '<div class="modal-head"><h2>' + esc(title) + '</h2><button class="close-btn" data-action="close" aria-label="关闭">×</button></div>';
  }

  /* ---------- 渲染各页面 ---------- */
  function updateHeader() {
    const li = levelInfo();
    const streakEl = $('#topStreak'), xpEl = $('#topXp'), lvEl = $('#topLevel');
    if (streakEl) streakEl.textContent = state.streak || 0;
    if (xpEl) xpEl.textContent = state.xp || 0;
    if (lvEl) lvEl.textContent = 'Lv.' + li.level;
  }
  function renderHome() {
    const el = $('#view-home');
    if (!state.startDate) { el.innerHTML = ''; return; }
    const phase = phaseOf();
    const day = state.dayIndex;
    const quote = QUOTES[(day || 1) % QUOTES.length];
    const tasks = dailyTasks();
    const done = doneList();
    const doneCount = tasks.filter(t => done.indexOf(t.id) !== -1).length;
    const li = levelInfo();
    const words = Object.keys(state.learnedWords).length;
    const percent = clamp(Math.round(doneCount / tasks.length * 100), 0, 100);
    const overall = clamp(Math.round(day / totalDays() * 100), 0, 100);
    const greet = new Date().getHours() < 12 ? '早上好' : new Date().getHours() < 18 ? '下午好' : '晚上好';
    el.innerHTML =
      '<div class="hero">' +
        '<div class="hello">' + greet + '，学习者 👋 · 第 ' + day + ' 天 / 共 ' + totalDays() + ' 天</div>' +
        '<h1>' + (day >= totalDays() ? '恭喜你完成旅程！🎓' : '今天也要元气满满地学英语！') + '</h1>' +
        '<p>当前阶段：' + phase.name + ' · ' + phase.goal + '</p>' +
        '<div class="quote">✨ ' + esc(quote) + '</div>' +
        '<div class="hero-rocket">🚀</div>' +
        '<div class="progress-wrap"><div class="progress-meta"><span>总旅程进度</span><span>' + overall + '% · 还剩 ' + Math.max(0, totalDays() - day) + ' 天</span></div><div class="progress"><i style="width:' + overall + '%"></i></div></div>' +
      '</div>' +
      (state.owed.length ? '<div class="timeline-note" style="margin-top:14px"><span style="font-size:20px">🧾</span><div><b>断签欠账：还有 ' + state.owed.length + ' 天没补</b><br>今天计划末尾已加入补做任务，做完才能拿全勤奖励。最多补 2 天，更早的自动翻篇，不用背着包袱。</div></div>' : '') +

      '<div class="section-title"><h2>📊 我的战绩</h2><span class="hint">每天进步一点点</span></div>' +
      '<div class="stats-grid">' +
        statCard('🔥', state.streak, '连续学习(天)') +
        '<button class="stat-card stat-link" data-action="goArchive" title="点击查看学习档案"><div class="ic">📖</div><b>' + words + '</b><span>已掌握单词 →</span></button>' +
        statCard('⭐', state.xp, '总经验值') +
        statCard('🎓', 'Lv.' + li.level, '当前等级') +
      '</div>' +

      '<div class="section-title"><h2>📋 今日学习计划</h2><span class="hint">' + doneCount + '/' + tasks.length + ' 已完成 · 预计 ' + planMinutes(day) + ' 分钟 · 积分按答对题数发放</span></div>' +
      '<div class="task-list">' + tasks.map(t => {
        const d = done.indexOf(t.id) !== -1;
        return '<div class="task-item' + (d ? ' done' : '') + '" data-task="' + t.id + '" data-mod="' + t.mod + '">' +
          '<div class="task-ic" style="background:' + (d ? '#E3F9F3' : '#F0EDFF') + '">' + t.icon + '</div>' +
          '<div class="task-info"><div class="task-name">' + t.name + '</div><div class="task-desc">' + esc(t.desc) + '</div><div class="task-time">⏱ 约 ' + taskMinutes(t) + ' 分钟</div></div>' +
          '<span class="task-reward">最高 +' + t.xp + ' XP</span><span class="task-status">' + (d ? '已完成 ✓' : '开始 →') + '</span></div>';
      }).join('') + '</div>' +

      '<div class="card" style="margin-top:16px"><div class="day-header">' +
        '<div class="day-icon">📅</div>' +
        '<div><h3>第 ' + day + ' 天 · 固定课程表 + 智能复习</h3><p>固定任务按天号排好，到期复习和断签补做由系统自动加进来 · 全部完成额外 +30 XP 🎁</p></div></div>' +
        '<div class="progress"><i style="width:' + percent + '%"></i></div>' +
        '<div class="muted" style="margin-top:8px">' + (percent === 100 ? '今日任务全部完成，你太棒了！🎉' : '再完成 ' + (tasks.length - doneCount) + ' 项，解锁今日满额奖励') + '</div></div>';
    if (percent === 100 && !state.completed['bonus_' + dateKey()]) {
      state.completed['bonus_' + dateKey()] = true;
      award(30);
      setTimeout(() => { toast('🎁 今日全勤！额外奖励 30 XP'); confetti(); }, 300);
      if (state.comeback && state.comeback.date === dateKey()) {
        award(40); state.comebackDone = (state.comebackDone || 0) + 1; state.comeback = null; saveState(); checkBadges();
        setTimeout(() => { toast('🌈 欢迎回来！断签 ' + state.lastGap + ' 天后重新满勤，额外奖励 40 XP'); confetti(); }, 900);
      }
    }
  }
  function statCard(ic, val, label) {
    return '<div class="stat-card"><div class="ic">' + ic + '</div><b>' + val + '</b><span>' + label + '</span></div>';
  }
  function focusIcon(dow) {
    const f = WEEK_ROUTINE.find(r => r.day === dow) || WEEK_ROUTINE[6];
    return f.icon;
  }
  function focusName(dow) {
    const f = WEEK_ROUTINE.find(r => r.day === dow) || WEEK_ROUTINE[6];
    return f.name;
  }
  function renderLearn() {
    const mods = [
      ['archive', '🗂️', '我的学习档案', '学过全汇总，随时查和复习', 'm-review'],
      ['write', '✍️', '手写练习板', '描红书写，记牢拼写', 'm-reading'],
      ['dictation', '📝', '默写测验', '今日单词，听音看义手写后自己核对', 'm-game'],
      ['dictationAll', '🎓', '四级词库默写', '4642 词随机抽题，手写后自己核对', 'm-game'],
      ['dialogue', '💬', '口语对话', '按进度情景对话，开口说', 'm-speaking'],
      ['cenListening', '🎧', '四级听力', '新闻/对话/讲座 · 5 题', 'm-listening'],
      ['cenReading', '📚', '四级阅读', '选词填空/匹配/仔细阅读', 'm-reading'],
      ['writing', '✍️', '四级写作', '12 话题 · 范文+词组', 'm-reading'],
      ['translation', '🌏', '四级翻译', '12 篇汉译英 · 参考译文', 'm-reading'],
      ['mockFull', '📝', '四级真题模考', '完整流程 · 分项评分', 'm-game'],
      ['wrongBook', '📕', '四级错题本', '自动收集 · 集中攻克', 'm-review'],
      ['translate', '🔁', '中英互译', '词句双向 · 可朗读', 'm-reading'],
      ['letter', '🔤', '字母音', '字母在词里发什么音', 'm-phonetic'],
      ['words', '📖', '单词卡片', '每天新词，翻卡记忆', 'm-words'],
      ['phonetic', '🔤', '音标启蒙', '44 个音标，发音无忧', 'm-phonetic'],
      ['blend', '🧩', '自然拼读', '把音拼成词，见词能读', 'm-grammar'],
      ['grammar', '🧩', '语法课堂', '24 讲，从入门到四级', 'm-grammar'],
      ['listening', '🎧', '听力训练', '听音选义，磨出语感', 'm-listening'],
      ['reading', '📚', '阅读闯关', '短文精读，理解提升', 'm-reading'],
      ['speaking', '🎤', '口语跟读', '开口表达，自信交流', 'm-speaking'],
      ['game', '🎮', '单词配对', '边玩边记，快乐加倍', 'm-game'],
      ['review', '🔁', '复习巩固', '对抗遗忘，牢记单词', 'm-review'],
      ['mock', '📝', '四级模考', '综合训练，检验成果', 'm-game']
    ];
    $('#view-learn').innerHTML =
      '<div class="section-title" style="margin-top:4px"><h2>🎒 自由练习区</h2><span class="hint">今天的必做任务在首页，含自动复习</span></div>' +
      '<div class="timeline-note" style="margin-bottom:14px"><span style="font-size:20px">📌</span><div>这里是可以随时加练的工具箱。每天<u>必做</u>的任务请到「今日」页面完成：四项固定内容按第 ' + (state.dayIndex || 1) + ' 天排好，另有系统按遗忘曲线算出的到期复习，不需要自己挑。</div></div>' +
      '<div class="module-grid">' + mods.map(m =>
        '<button class="module-card ' + m[4] + '" data-mod="' + m[0] + '"><div class="m-ic">' + m[1] + '</div><h3>' + m[2] + '</h3><p>' + m[3] + '</p></button>'
      ).join('') + '</div>' +
      '<div class="card" style="margin-top:18px"><h3>💡 高效学习小贴士</h3><p class="muted">① 先听发音再记拼写，声音比文字更好记；② 每张卡片主动回忆后再翻开；③ 每天睡前用 3 分钟复盘当天单词；④ 不要怕犯错，错题记得越牢。</p></div>';
  }
  /* ---------- 我的学习档案：按已学天数汇总单词/音标/字母/拼读/语法/句子 ---------- */
  let archiveState = { cat: 'w', q: '', scope: 'learned' };
  let exportSelection = { w:true, p:true, l:true, b:true, g:true, s:true, scope:'learned' };
  function courseDaysLearned() {
    // 已学"课程日"数，映射到源课程日（1..SOURCE_DAYS）
    const day = state.dayIndex || 1;
    const out = [];
    for (let d = 1; d <= day; d++) out.push(courseDay(d));
    return out;
  }
  function collectArchive() {
    const seen = { w:{}, p:{}, l:{}, b:{}, g:{}, s:{} };
    const data = { w:[], p:[], l:[], b:[], g:[], s:[] };
    function add(cat, key, item) {
      if (seen[cat][key]) return;
      seen[cat][key] = true;
      data[cat].push(item);
    }
    // 遍历已学的每个课程日，从固定课程表收集
    courseDaysLearned().forEach(c0 => {
      const c = effectiveCourseDay(c0);
      // 任务一：字母 / 音标 / 拼读 / 语法
      if (c <= 6) {
        const groups = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24,25],[0,4,8,12,16,20,24]];
        (groups[c-1]||[]).forEach(i => { const L = LETTERS[i]; if (L) add('l', 'L'+i, { key:'L'+i, main:L.letter, sub:'字母音 '+L.sound+' · 例词 '+L.soundEx+' '+L.soundCn, ph:L.sound, cn:L.soundCn, audio:L.soundEx, tip:L.tip, day:c, kind:'字母音' }); });
      } else if (c <= 28) {
        const from = (c-7)*2;
        [from, from+1].forEach(i => { const P = PHONETICS[i]; if (P) add('p', 'P'+i, { key:'P'+i, main:P.sym, sub:P.type+' · 例词 '+P.ex+' '+P.cn, ph:P.sym, cn:P.cn, audio:P.ex, day:c, kind:'音标' }); });
      } else if (c <= 44) {
        const base = (c-29)*3;
        [base%44,(base+1)%44,(base+2)%44].forEach(i => { const P = PHONETICS[i]; if (P) add('p', 'P'+i, { key:'P'+i, main:P.sym, sub:P.type+' · 例词 '+P.ex+' '+P.cn, ph:P.sym, cn:P.cn, audio:P.ex, day:c, kind:'音标' }); });
      } else if (c <= 90) {
        const start = ((c-45)*2) % BLEND_LESSONS.length;
        [start,(start+1)%BLEND_LESSONS.length].forEach(i => { const B = BLEND_LESSONS[i%BLEND_LESSONS.length]; if (B) add('b', 'B'+i, { key:'B'+i, main:B.word, sub:'拼读 '+B.parts.join(' + ')+' → '+B.cn, ph:B.parts.map(x=>'/'+x+'/').join(' '), cn:B.cn, audio:B.word, day:c, kind:'自然拼读' }); });
      } else {
        const gi = (c-91) % GRAMMAR.length;
        const G = GRAMMAR[gi];
        if (G) add('g', 'G'+gi, { key:'G'+gi, main:G.title, sub:G.point, ex:G.ex, cn:G.cn, audio:G.ex, day:c, kind:'语法' });
      }
      // 任务二：每日单词
      let wSrc, wCount, wStart;
      if (c <= 44) { wSrc = EASY_WORDS; wCount = wordCountForCourse(c); wStart = ((c-1)*4) % Math.max(1, EASY_WORDS.length-wCount); }
      else if (c <= 90) { wSrc = ALL_WORDS; wCount = wordCountForCourse(c); wStart = 55 + ((c-45)*6) % Math.max(1, ALL_WORDS.length-55-wCount); }
      else { wSrc = ALL_WORDS; wCount = wordCountForCourse(c); wStart = ((c-91)*10) % Math.max(1, ALL_WORDS.length-wCount); }
      wSrc.slice(wStart, wStart+wCount).forEach(w => { if (w && w.w) add('w', w.w, { key:w.w, main:w.w, sub:w.ex || '', ph:w.ph || '', cn:w.cn || '', cnEx:w.cnEx || '', audio:w.w, day:c, kind:'单词' }); });
      // 任务三：听力句子 / 口语话题 / 阅读短文
      if (c > 90) {
        const mode = (c-1)%4;
        if (mode === 0 || mode === 3) {
          const li = (mode===0 ? (c*2) : (c*3)) % LISTEN_BANK.length;
          [li,(li+7)%LISTEN_BANK.length].forEach(i => { const S = LISTEN_BANK[i]; if (S) add('s', 'S'+i, { key:'S'+i, main:S[0], sub:'听力句型', cn:S[1], audio:S[0], day:c, kind:'句子' }); });
        } else if (mode === 1) {
          const ph = phaseOf(c);
          const pool = PASSAGES.filter(x => x.lvl <= Math.min(4, ph.id));
          const pi = c % Math.max(1,pool.length);
          const P = pool[pi];
          if (P) add('s', 'P'+P.title, { key:'P'+P.title, main:P.text, sub:'短文《'+P.title+'》', cn:P.cn, audio:P.text, day:c, kind:'短文' });
        } else if (mode === 2) {
          const ti = (c-1) % SPEAK_TOPICS.length;
          const T = SPEAK_TOPICS[ti];
          if (T) add('s', 'T'+ti, { key:'T'+ti, main:T.sample, sub:'口语：'+T.q, cn:T.cn, audio:T.sample, day:c, kind:'口语句' });
        }
      }
    });
    // 补充：口语对话场景（按已解锁档位的全部句子）
    const tier = dialogueTier();
    const tiers = tier === 'fluent' ? ['starter','builder','fluent'] : (tier === 'builder' ? ['starter','builder'] : ['starter']);
    tiers.forEach(t => (DIALOGUE_SCENES[t]||[]).forEach(sc => (sc.turns||[]).forEach((turn,i) => {
      add('s', 'D'+t+sc.id+i, { key:'D'+t+sc.id+i, main:turn.sample, sub:'对话《'+sc.title+'》', cn:turn.sampleCn||'', audio:turn.sample, day:0, kind:'对话句' });
      add('s', 'DQ'+t+sc.id+i, { key:'DQ'+t+sc.id+i, main:turn.sys, sub:'对话《'+sc.title+'》· 系统问句', cn:turn.cn||'', audio:turn.sys, day:0, kind:'对话句' });
    })));
    // 补充：已实际学过但可能不在课程表推导里的单词（learnedWords）
    Object.keys(state.learnedWords||{}).forEach(w => {
      if (seen.w[w]) return;
      let info = null;
      for (const arr of [EASY_WORDS, ALL_WORDS]) { const f = arr.find(x => x.w === w); if (f) { info = f; break; } }
      const rec = state.learnedWords[w] || {};
      add('w', w, { key:w, main:w, sub:info && info.ex || '', ph:info && info.ph || '', cn:info && info.cn || '', cnEx:info && info.cnEx || '', audio:w, day:0, kind:'单词', learned:rec.t });
    });
    return data;
  }
  function xmlCell(v) {
    const s = String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    return '<Cell><Data ss:Type="String">' + s + '</Data></Cell>';
  }
  const EXPORT_CATS = [
    ['w','📖','单词','words'], ['p','🔤','音标','phonetics'], ['l','🔤','字母音','letters'],
    ['b','🧩','自然拼读','blends'], ['g','🧩','语法','grammar'], ['s','💬','句子','sentences']
  ];
  function archiveCats() { return EXPORT_CATS.map(c => ({ id:c[0], icon:c[1], name:c[2] })); }
  // 选择导出哪些类别：每类显示实际条数与内容示例，勾选后才导出
  function openExportDialog() {
    const data = collectArchive();
    const sel = exportSelection;
    const counts = { w:data.w.length, p:data.p.length, l:data.l.length, b:data.b.length, g:data.g.length, s:data.s.length };
    const sample = c => {
      const x = (data[c]||[])[0];
      if (!x) return '暂无记录';
      return (x.main||'') + (x.ph ? ' ' + x.ph : '') + (x.cn ? ' · ' + x.cn : '');
    };
    openModal(modalHead('📊 导出学习内容') +
      '<div class="reward-banner">勾选要导出的类别，表格里是<b>完整学习内容</b>（不是数量统计）。可多选，一次导出为一个 Excel 文件。</div>' +
      '<div class="exp-list">' + EXPORT_CATS.map(c => {
        const on = sel[c[0]];
        return '<label class="exp-item' + (on ? ' on' : '') + '">' +
          '<input type="checkbox" data-exp-cat="' + c[0] + '"' + (on ? ' checked' : '') + '>' +
          '<span class="exp-ic">' + c[1] + '</span>' +
          '<span class="exp-body"><b>' + c[2] + '</b><small>' + sample(c[0]) + '</small></span>' +
          '<span class="exp-count">' + counts[c[0]] + ' 条</span></label>';
      }).join('') + '</div>' +
      '<div class="exp-scope"><span>单词范围</span>' +
        '<button class="arch-tab' + (sel.scope==='learned' ? ' active' : '') + '" data-action="expScope" data-scope="learned">已学单词</button>' +
        '<button class="arch-tab' + (sel.scope==='all' ? ' active' : '') + '" data-action="expScope" data-scope="all">完整四级词库 ' + ALL_WORDS.length + ' 词</button></div>' +
      '<div class="exp-actions"><button class="btn sm" data-action="expAll">全选</button><button class="btn sm" data-action="expNone">全不选</button></div>' +
      '<button class="btn primary big" data-action="expDo">导出所选内容 →</button>');
  }
  // 生成工作表：内容表在前、说明表在最后，每张表含完整字段而非只有数量
  function buildExportSheets(chosen, data, sel) {
    const build = {
      w: () => ({ name:'单词', rows:[['序号','单词','音标','中文释义','例句','例句中文','学习天数','来源']].concat(data.w.map((x,i) => [i+1, x.main, x.ph, x.cn, x.sub, x.cnEx, x.day||'', x.kind||''])) }),
      p: () => ({ name:'音标', rows:[['序号','音标','类型/说明','中文','例词','学习天数','来源']].concat(data.p.map((x,i) => [i+1, x.main, x.sub, x.cn, x.audio, x.day||'', x.kind||''])) }),
      l: () => ({ name:'字母音', rows:[['序号','字母','字母音','例词','中文','提示','学习天数']].concat(data.l.map((x,i) => [i+1, x.main, x.ph, x.audio, x.cn, x.sub, x.day||''])) }),
      b: () => ({ name:'自然拼读', rows:[['序号','单词','拼读拆分','中文','学习天数']].concat(data.b.map((x,i) => [i+1, x.main, x.ph, x.cn, x.day||''])) }),
      g: () => ({ name:'语法', rows:[['序号','语法点','要点','例句','中文','学习天数']].concat(data.g.map((x,i) => [i+1, x.main, x.sub, x.ex, x.cn, x.day||''])) }),
      s: () => ({ name:'句子', rows:[['序号','句子','说明','中文','学习天数','来源']].concat(data.s.map((x,i) => [i+1, x.main, x.sub, x.cn, x.day||'', x.kind||''])) })
    };
    // 内容表在前，说明表在最后；每张表第一行就是完整内容
    const sheets = chosen.map(c => build[c[0]]());
    sheets.push({ name:'导出说明', rows:[['项目','内容'],
      ['导出日期', dateKey()], ['英语启航','EnglishQuest'],
      ['导出类别', chosen.map(c => c[2]).join('、')],
      ['各类条数', chosen.map(c => c[2] + ' ' + data[c[0]].length + ' 条').join('；')],
      ['单词范围', (sel.w && sel.scope==='all') ? '完整四级词库' : '已学单词'],
      ['提示','每个类别一个工作表，含完整内容与例句；可用 Excel/WPS 直接打开'] ] });
    return sheets;
  }
  function exportArchiveExcel() {
    const sel = exportSelection;
    const chosen = EXPORT_CATS.filter(c => sel[c[0]]);
    if (!chosen.length) { toast('请至少勾选一个要导出的类别'); return; }
    const data = collectArchive();
    // 单词可选导出完整四级词库
    if (sel.w && sel.scope === 'all') {
      data.w = ALL_WORDS.map(w => ({ main:w.w, ph:w.ph||'', cn:w.cn||'', sub:w.ex||'', cnEx:w.cnEx||'', day:0, kind:'四级词库' }));
    }
    const sheets = buildExportSheets(chosen, data, sel);
    const xml = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      sheets.map(sh => '<Worksheet ss:Name="' + String(sh.name).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;') + '"><Table>' +
        sh.rows.map(row => '<Row>' + row.map(xmlCell).join('') + '</Row>').join('') +
        '</Table></Worksheet>').join('') + '</Workbook>';
    const blob = new Blob(['\ufeff' + xml], { type:'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '英语启航-' + chosen.map(c => c[0]).join('') + '-' + dateKey() + '.xls';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    closeModal();
    toast('📊 已导出 ' + chosen.length + ' 类学习内容：' + chosen.map(c => c[2]).join('、'));
  }
  function renderArchive() {
    const el = $('#view-archive');
    if (!el) return;
    const data = collectArchive();
    const cats = [
      ['w','📖','单词','words'], ['p','🔤','音标','phonetics'], ['l','🔤','字母音','letters'],
      ['b','🧩','自然拼读','blends'], ['g','🧩','语法','grammar'], ['s','💬','句子','sentences']
    ];
    const q = (archiveState.q||'').trim().toLowerCase();
    let list = data[archiveState.cat] || [];
    const allScope = archiveState.scope === 'all';
    if (allScope && archiveState.cat === 'w') {
      list = ALL_WORDS.map(w => ({ key:w.w, main:w.w, sub:w.ex || '', ph:w.ph || '', cn:w.cn || '', cnEx:w.cnEx || '', audio:w.w, day:0, kind:'四级词库' }));
    }
    if (q) list = list.filter(x => (x.main+' '+(x.cn||'')+' '+(x.ph||'')+' '+(x.sub||'')).toLowerCase().indexOf(q) !== -1);
    el.innerHTML =
      '<div class="section-title" style="margin-top:4px"><h2>🗂️ 我的学习档案</h2><div style="display:flex;gap:8px"><button class="btn sm" data-action="archExport">📊 导出学习内容</button><button class="arch-back" data-action="archBack">← 返回学习</button></div></div>' +
      '<div class="timeline-note" style="margin-bottom:12px"><span style="font-size:20px">📚</span><div>' + (allScope ? '当前展示<b>完整四级词库 ' + ALL_WORDS.length + ' 词</b>，可点 🔊 听读音、搜索中文或英文；切回「已学」只看自己学过的内容。' : '这里汇总了从第 1 天到<b>第 ' + (state.dayIndex||1) + ' 天</b>你学过的所有内容：单词、音标、字母音、拼读、语法和句子。点 🔊 随时听，点「再练」重新复习。') + '</div></div>' +
      '<div style="margin-bottom:10px"><button class="arch-tab active" data-action="archScope">' + (allScope ? '👀 只看已学' : '📚 查看完整四级词库（' + ALL_WORDS.length + ' 词）') + '</button></div>' +
      '<div class="arch-tabs">' + cats.map(c => '<button class="arch-tab' + (archiveState.cat===c[0] ? ' active' : '') + '" data-action="archTab" data-cat="' + c[0] + '">' + c[1] + ' ' + c[2] + '<span class="arch-num">' + (allScope && c[0]==='w' ? ALL_WORDS.length : (data[c[0]]||[]).length) + '</span></button>').join('') + '</div>' +
      '<div class="arch-search"><input id="archSearch" type="search" placeholder="🔍 搜索' + (cats.find(c=>c[0]===archiveState.cat)||[])[2] + '（英文或中文）" value="' + esc(archiveState.q||'') + '"></div>' +
      '<div class="arch-meta">共 ' + list.length + (q ? ' 条结果' : ' 条记录') + '</div>' +
      '<div class="arch-list">' + (list.length ? list.map((x,i) =>
        '<div class="arch-item"><div class="arch-row">' +
          '<div class="arch-main">' + esc(x.main) + '</div>' +
          '<button class="arch-play" data-action="archSpeak" data-key="' + x.key + '">🔊</button>' +
        '</div>' +
        (x.ph ? '<div class="arch-ph">' + esc(x.ph) + '</div>' : '') +
        (x.cn ? '<div class="arch-cn">' + esc(x.cn) + '</div>' : '') +
        (x.cnEx ? '<div class="arch-sub">例：' + esc(x.cnEx) + '</div>' : '') +
        (x.sub ? '<div class="arch-sub">' + esc(x.sub) + '</div>' : '') +
        '<div class="arch-foot"><span class="badge purple">' + esc(x.kind) + '</span>' + (x.day ? '<span class="muted">第 ' + x.day + ' 天</span>' : '') + '</div>' +
        '</div>').join('') : '<div class="card center muted" style="padding:24px">没有找到相关内容。换个关键词试试，或先去完成几天课程。</div>') + '</div>';
    // 搜索框事件（每次渲染重新绑定）
    const input = $('#archSearch');
    if (input) input.addEventListener('input', e => {
      archiveState.q = e.target.value;
      clearTimeout(archiveState.timer);
      archiveState.timer = setTimeout(() => { renderArchive(); const n = $('#archSearch'); if (n) { n.focus(); n.setSelectionRange(n.value.length,n.value.length); } }, 180);
    });
  }
  function archiveFind(key) {
    const data = collectArchive();
    for (const cat of Object.keys(data)) { const f = data[cat].find(x => x.key === key); if (f) return f; }
    const w = ALL_WORDS.find(x => x.w === key);
    return w ? { key:w.w, main:w.w, ph:w.ph, cn:w.cn, audio:w.w } : null;
  }
  function goArchive() { renderArchive(); go('archive'); }

  function renderPlan() {
    const day = state.dayIndex;
    const total = totalDays();
    const n90 = realDayOf(90), n365 = realDayOf(365), n547 = realDayOf(547);
    const phases = PHASES.map(p => {
      const from = realDayOf(p.days[0]); const to = realDayOf(p.days[1]);
      const cur = p.id === phaseOf().id;
      const pct = clamp(Math.round((day - from + 1) / (to - from + 1) * 100), 0, 100);
      return '<div class="phase-card ' + p.color + (cur ? ' current' : '') + '">' +
        '<div class="phase-top"><h3>第 ' + p.id + ' 阶段 · ' + p.name + (cur ? ' <span class="badge purple">进行中</span>' : '') + '</h3>' +
        '<span class="muted">第 ' + from + ' – ' + to + ' 天</span></div>' +
        '<div class="phase-goal">🎯 ' + esc(p.goal) + '</div>' +
        '<div class="phase-desc">' + esc(p.desc) + '</div>' +
        '<div class="tag-row">' + p.focus.map(f => '<span class="tag">' + esc(f) + '</span>').join('') + '</div>' +
        '<div class="progress" style="background:#EEF0F7;margin-top:12px"><i style="width:' + pct + '%"></i></div>' +
        '</div>';
    }).join('');
    const upcoming = Array.from({ length: 7 }, (_, i) => Math.max(1, day || 1) + i).map(n => {
      const t = dailyTasks(n);
      return '<div class="card" style="margin-bottom:10px;box-shadow:none">' +
        '<div class="phase-top"><h3>第 ' + n + ' 天' + (n === day ? ' <span class="badge purple">今天</span>' : '') + '</h3><span class="muted">' + phaseOf(n).name + ' · ' + t.length + ' 项</span></div>' +
        '<div class="tag-row">' + t.map(x => '<span class="tag">' + x.icon + ' ' + esc(x.name) + '：' + esc(x.desc.length > 30 ? x.desc.slice(0, 30) + '…' : x.desc) + '</span>').join('') + '</div></div>';
    }).join('');
    const templates = PHASES.map(p => {
      const tpl = p.id === 1
        ? '第 1–6 天：字母音（跳过已会的字母名）+ 4 个高频词 + 听音辨字母；第 8–30 天：每天 2 个音标 + 4 个词 + 听音辨音标；第 31–48 天：音标巩固 + 4 个词 + 听音辨音标；第 49–83 天：自然拼读 + 6 个词 + 听词选义。第 84 天起才进入语法与整句听力。'
        : p.id === 2
          ? '每天固定：语法 1 讲（24 讲循环）+ 单词 10 个 + 听力/阅读/口语/听力加练四天一循环 + 复习或游戏隔天交替。'
          : '每天固定：语法 1 讲 + 单词 10 个 + 四级听力 / 仔细阅读 / 写作 / 翻译 / 口语 / 真题模考六天一循环 + 复习或游戏隔天交替。';
      return '<div class="card" style="margin-bottom:10px;box-shadow:none"><b>第 ' + p.id + ' 阶段 · ' + p.name + '（第 ' + realDayOf(p.days[0]) + '–' + realDayOf(p.days[1]) + ' 天）</b><p class="muted" style="margin:6px 0 0">' + tpl + '</p></div>';
    }).join('');
    $('#view-plan').innerHTML =
      '<div class="section-title" style="margin-top:4px"><h2>🗺️ ' + (total === 730 ? '两年' : '约 ' + Math.round(total / 30.44) + ' 个月') + '通关路线图</h2><span class="hint">只认识字母 → 英语四级</span></div>' +
      '<div class="timeline-note"><span style="font-size:22px">🎓</span><div><b>目标：' + total + ' 天后通过大学英语四级（CET-4）</b><br>按你现在的情况固定安排：你会认字母，就从<b>字母在单词里的发音</b>开始，接着音标 → 自然拼读 → 语法句子 → 四级题型，不跳过任何一步。词汇量累积到 4642 词完整词库，分四个阶段循序渐进。每天目标 ' + state.minutes + ' 分钟；阅读/写作/翻译/模考当天自动减少新词，首页会显示今日预计用时，坚持就是胜利！</div></div>' +
      '<div class="card" style="margin-bottom:16px"><div class="progress-meta" style="color:var(--sub)"><span>当前进度</span><span>第 ' + day + ' 天 / ' + total + ' 天</span></div><div class="progress"><i style="width:' + clamp(day / total * 100, 0, 100) + '%"></i></div></div>' +
      phases +
      '<div class="section-title"><h2>📅 每天固定做什么</h2><span class="hint">按顺序做，不用自己挑</span></div>' +
      '<div class="timeline-note"><span style="font-size:20px">✅</span><div>从你设定的开始日期算起，第 1 天到第 ' + total + ' 天，每天四项固定内容都是预先定好的。另外，学过的单词、语法、音标和字母会按 1 / 3 / 7 / 15 / 30 天的间隔自动加入当天计划，成为第 5 项「今日到期复习」，不用自己记。</div></div>' +
      templates +
      '<div class="card" style="margin-bottom:16px"><h3>🔎 查看任意一天的任务</h3><p class="muted">输入 1–' + total + ' 的天号，提前看看那天具体学什么。</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><input id="viewDayInput" type="number" min="1" max="' + total + '" value="' + (day || 1) + '" style="flex:1;min-width:110px;padding:11px 12px;border:2px solid var(--line);border-radius:12px">' +
        '<button class="btn primary" data-action="viewDay">查看这一天 →</button></div></div>' +
      '<div class="section-title"><h2>🗓️ 未来 7 天安排</h2><span class="hint">固定任务 + 按遗忘曲线到期的复习</span></div>' + upcoming +
      '<div class="card" style="margin-top:16px"><h3>📌 四级备考关键节点</h3><p class="muted">第 ' + n90 + ' 天：完成字母、音标与基础词 · 第 ' + n365 + ' 天：核心词汇与语法全部过完 · 第 ' + n547 + ' 天：进入真题模考 · 第 ' + total + ' 天：冲刺应考。</p></div>';
  }
  function showDayPlan() {
    const input = $('#viewDayInput');
    const n = clamp(Number(input && input.value) || 1, 1, totalDays());
    const t = dailyTasks(n);
    const tag = n === state.dayIndex ? '<span class="badge purple">今天</span>' : n < state.dayIndex ? '<span class="badge mint">已过去</span>' : '<span class="badge orange">未来</span>';
    openModal(modalHead('第 ' + n + ' 天 · 学习任务') +
      '<p class="muted">' + tag + ' ' + phaseOf(n).name + ' · ' + t.length + ' 项（4 项固定 + 自动复习），按顺序完成即可</p>' +
      t.map((x, i) => '<div class="task-item" style="cursor:default"><div class="task-ic" style="background:var(--purple-pale)">' + x.icon + '</div>' +
        '<div class="task-info"><div class="task-name">' + (i + 1) + '. ' + esc(x.name) + '</div><div class="task-desc" style="white-space:normal">' + esc(x.desc) + '</div></div>' +
        '<span class="task-reward">+' + x.xp + ' XP</span></div>').join('') +
      '<button class="btn primary big" data-action="close">知道了</button>');
  }
  function renderBadges() {
    const list = BADGES.map(b => {
      const ok = state.badges.indexOf(b.id) !== -1;
      return '<div class="badge-card' + (ok ? '' : ' locked') + '"><div class="b-ic">' + b.icon + '</div><b>' + esc(b.name) + '</b><span>' + esc(b.desc) + '</span></div>';
    }).join('');
    $('#view-badges').innerHTML =
      '<div class="section-title" style="margin-top:4px"><h2>🏅 我的成就馆</h2><span class="hint">已解锁 ' + state.badges.length + ' / ' + BADGES.length + '</span></div>' +
      '<div class="badge-grid">' + list + '</div>' +
      '<div class="card" style="margin-top:16px"><h3>🌟 等级说明</h3><p class="muted">每获得 200 XP 提升一级。完成每日任务、解锁新词、连续打卡都能获得经验值。每项每日任务的经验值固定，同一项当天重复完成不再累加，每天重新计算。当前等级 Lv.' + levelInfo().level + '，距离下一级还差 ' + (200 - levelInfo().cur) + ' XP。</p></div>';
  }
  function renderMe() {
    const scores = state.mockScores.slice(-5);
    $('#view-me').innerHTML =
      '<div class="section-title" style="margin-top:4px"><h2>⚙️ 个人设置</h2><span class="hint">数据保存在本机</span></div>' +
      '<div class="card">' +
        row('开始日期', state.startDate || '未设置') +
        row('计划周期', totalDays() + ' 天（压缩后内容按 ' + Math.round(totalDays() / 30.44) + ' 个月排完）') +
        row('每日目标时长', state.minutes + ' 分钟') +
        row('语音语速', state.rate.toFixed(2) + 'x') +
        row('朗读语音包', voiceDisplayName()) +
        row('答题提示音', state.voiceFx === false ? '已关闭' : voiceDisplayName(state.feedbackVoice) + ' · ' + toneName() + ' · ' + ({ zh: '中文', en: '英文', mix: '中英混合' }[state.feedbackLang] || '中文')) +
        row('我的声音语音包', state.voiceProfile ? (genderLabel(state.voiceProfile.gender) + ' · 音调 ' + state.voiceProfile.pitch.toFixed(2) + ' · 语速 ' + state.voiceProfile.rate.toFixed(2) + '（' + state.voiceProfile.created + '）') : '未创建（录一段即可生成）') +
        row('答题人声', state.voiceFx === false ? '关闭' : '开启') +
        row('连续学习纪录', state.bestStreak + ' 天') +
        row('累计经验值', state.xp + ' XP') +
        row('最近模考成绩', scores.length ? scores.join(' / ') : '暂无') +
        row('今天该复习', dueRawFor(dateKey()).length + ' 项') +
        row('累计进入复习计划', Object.keys(state.srs).length + ' 项') +
        row('累计断签天数', (state.misses || 0) + ' 天') +
        row('当前欠账补做', (state.owed || []).length + ' 天') +
      '</div>' +
      '<div class="card"><h3>🎯 学习画像</h3>' +
        '<div class="info-row"><span class="label">当前水平</span><span class="value">只认识字母（按你的情况固定，无需选择）</span></div>' +
        '<div class="info-row"><span class="label">起步内容</span><span class="value">字母音 → 音标 → 自然拼读 → 语法 → 四级题型</span></div>' +
        '<div class="info-row"><span class="label">目标</span><span class="value">大学英语四级 CET-4 · 4642 词完整词库</span></div>' +
        '<div class="info-row"><span class="label">每日安排</span><span class="value">目标 ' + state.minutes + ' 分钟 · 今日预计 ' + planMinutes(state.dayIndex) + ' 分钟 · 4 项固定任务 + 到期复习（重任务日已减词）</span></div>' +
        '<p class="muted" style="font-size:11px">计划已按你「只认识字母、不认识音标/单词/语法/句子」的真实情况固定。670 天完整计划覆盖全部 4642 词、全部四级题型与到期复习；最低 30 分钟档，低于 30 分钟无法保证完整覆盖。模考当天新词自动减量，想更从容可选 45 分钟档。</p></div>' +
      '<div class="card"><h3>🔊 调整设置</h3>' +
        '<label class="onboard-label">学习目标</label><select id="setTarget" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' +
          '<option value="cet4"' + (state.target === 'cet4' ? ' selected' : '') + '>大学英语四级 CET-4（4642 词完整词库）</option></select>' +
        '<label class="onboard-label">人声自然度（推荐开启）</label><select id="setNaturalVoice" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' +
          '<option value="1"' + (state.naturalVoice !== false ? ' selected' : '') + '>开启：优先真人/神经语音，按句意自然停顿</option>' +
          '<option value="0"' + (state.naturalVoice === false ? ' selected' : '') + '>关闭：使用风格化语音（变声效果）</option></select>' +
        '<div style="margin:8px 0"><button class="btn sm" data-action="tryNatural">🔊 试听自然语音</button></div>' +
        '<label class="onboard-label">开始日期（修改后重新计算计划）</label><input type="date" id="setStart" value="' + esc(state.startDate || '') + '" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' +
        '<label class="onboard-label">计划总周期</label><select id="setTargetDays" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' +
          [[670, '670 天（22 个月 · 完整四级计划）']].map(d => '<option value="' + d[0] + '"' + (d[0] === totalDays() ? ' selected' : '') + '>' + d[1] + '</option>').join('') + '</select>' +
        '<label class="onboard-label">每日目标时长</label><select id="setMinutes" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' +
          [[30, '30 分钟'], [33, '33 分钟（推荐）'], [45, '45 分钟（从容）'], [60, '60 分钟（冲刺）']].map(m => '<option value="' + m[0] + '"' + (m[0] === state.minutes ? ' selected' : '') + '>' + m[1] + '</option>').join('') + '</select>' +
        '<label class="onboard-label">语音朗读速度</label><select id="setRate" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' +
          [[0.7, '慢速 0.7x'], [0.85, '标准 0.85x'], [1, '正常 1.0x'], [1.15, '快速 1.15x']].map(r => '<option value="' + r[0] + '"' + (Math.abs(r[0] - state.rate) < .01 ? ' selected' : '') + '>' + r[1] + '</option>').join('') + '</select>' +
        '<label class="onboard-label">🔊 朗读语音包（像地图语音一样挑一个）</label>' +
        '<select id="voiceSelect" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' + voiceOptionsHtml('read') + '</select>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn sm" data-action="tryVoice">🔊 试听这句</button><button class="btn sm" data-action="refreshVoices">↻ 刷新语音列表</button></div>' +
        '<p class="muted" style="font-size:11px;margin-top:6px"><span id="voiceCount">内置 ' + VOICE_STYLES.length + ' 种语音风格 · 系统提供 ' + englishVoices().length + ' 个英文语音</span> · <b>选中立即生效并试听，不用点保存</b>。内置风格在任何设备都能变声；系统语音只在部分浏览器可见。如果完全没声音，请改用 Chrome / Edge 或手机系统浏览器打开。</p>' +
        '<label class="onboard-label">💬 答题提示音声音（可与朗读不同）</label>' +
        '<select id="feedbackVoiceSelect" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' + voiceOptionsHtml('feedback') + '</select>' +
        '<label class="onboard-label">😄 答题提示音风格</label>' +
        '<select id="setFeedbackTone" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' +
          [['funny', '幽默搞笑（默认·推荐）'], ['gentle', '温柔鼓励'], ['short', '简洁干脆']].map(t => '<option value="' + t[0] + '"' + (state.feedbackTone === t[0] ? ' selected' : '') + '>' + t[1] + '</option>').join('') + '</select>' +
        '<label class="onboard-label">🌐 答题提示音语言</label>' +
        '<select id="setFeedbackLang" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' +
          [['zh', '中文'], ['en', 'English 英文'], ['mix', '中英混合']].map(l => '<option value="' + l[0] + '"' + (state.feedbackLang === l[0] ? ' selected' : '') + '>' + l[1] + '</option>').join('') + '</select>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn sm" data-action="tryFeedback">🔊 试听答对/答错</button></div>' +
        '<label class="onboard-label">答题人声反馈</label><select id="setVoiceFx" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">' +
          '<option value="1"' + (state.voiceFx !== false ? ' selected' : '') + '>开启（答对/答错有人声鼓励）</option>' +
          '<option value="0"' + (state.voiceFx === false ? ' selected' : '') + '>关闭（保持安静）</option></select>' +
        '<button class="btn primary big" data-action="saveSettings">保存设置</button>' +
      '</div>' +
      '<div class="card"><h3>🎤 我的专属语音包（录一段，识别音色）</h3>' +
        '<p class="muted" style="font-size:12px">不用一个词一个词地录。只要读出下面这句英文（约 5 秒），APP 会分析你的<b>音调高低、语速快慢、男女声</b>，自动生成专属音色。生成后，<b>所有朗读和答题对错的提示音都会用这个音色</b>，中英文都能用。识别只在本机完成，录音不会上传。</p>' +
        '<p class="reward-banner" style="font-size:14px;margin:8px 0">请朗读：<b>' + esc(VOICE_SAMPLE) + '</b></p>' +
        (state.voiceProfile ?
          '<div class="voice-profile-box">' +
            '<div class="vp-line"><span class="badge purple">' + genderLabel(state.voiceProfile.gender) + '</span> 音调 ' + state.voiceProfile.pitch.toFixed(2) + 'x · 语速 ' + state.voiceProfile.rate.toFixed(2) + 'x · 基频 ' + state.voiceProfile.f0 + 'Hz</div>' +
            '<div class="vp-line muted">生成于 ' + esc(state.voiceProfile.created) + '，当前朗读与提示音已使用「我的声音」</div>' +
            '<div class="vp-btns"><button class="btn sm primary" data-action="previewVoice">🔊 试听我的声音</button>' +
            '<button class="btn sm" data-action="playMySample" id="voiceRecBtn2">▶ 听我原声</button>' +
            '<button class="btn sm" data-action="recordVoice" data-role="start" id="voiceRecBtn">🎙️ 重新录一段</button>' +
            '<button class="btn sm danger" data-action="delVoiceProfile">删除语音包</button></div>' +
            '<div class="muted" id="voiceRecStatus" style="font-size:11px;margin-top:6px"></div>' +
          '</div>' :
          '<div style="margin-top:10px"><button class="btn primary" data-action="recordVoice" id="voiceRecBtn">🎙️ 开始录一段</button>' +
          '<div class="muted" id="voiceRecStatus" style="font-size:11px;margin-top:6px">允许麦克风后，读出上面那句英文即可；说完自动识别。</div></div>') +
      '</div>' +
      '<div class="card"><h3>🎬 讲解视频链接（可选）</h3>' +
        '<p class="muted">APP 自带动画微课（语音+字幕，离线可用）。如果你有喜欢的视频课，可以填一个链接，讲解时一起显示。<br>推荐填 mp4 / webm 直链；普通网页链接会显示"打开视频"按钮。</p>' +
        ['word', 'phonetic', 'grammar', 'mock'].map(k =>
          '<label class="onboard-label">' + lessonName(k) + '讲解视频</label><input id="video_' + k + '" type="url" placeholder="https://…（留空则用内置微课）" value="' + esc(state.videos[k] || '') + '" style="width:100%;padding:10px 12px;border:2px solid var(--line);border-radius:12px">'
        ).join('') +
        '<p class="muted" style="font-size:11px;margin-top:8px">视频需联网播放，不影响离线学习；链接只保存在本机。</p>' +
        '<button class="btn sm" data-action="saveSettings">保存视频链接</button>' +
      '</div>' +
      '<div class="card"><h3>⏰ 智能复习规则</h3><p class="muted">学过的单词、语法、音标和字母会自动排进 1 / 3 / 7 / 15 / 30 天后当天的学习计划里。答对就拉长间隔，答错第二天再来。每天最多 10 项，超出的自动顺延，不用自己惦记。</p></div>' +
      '<div class="card"><h3>🧾 断签处理规则</h3><p class="muted">断签后连续天数清零；次日计划会追加「补做昨天」任务，最多补 2 天，更早的自动翻篇。不倒扣经验值，但当天有欠账时无法拿到全勤 +30 XP。断签 3 天以上后重新完成全天任务，额外奖励 40 XP 并解锁「回归勇士」徽章。</p></div>' +
      '<div class="card"><h3>📲 安装到设备</h3><p class="muted"><b>Windows：</b>用 Edge/Chrome 打开本应用 → 地址栏右侧"安装此应用"图标 → 安装，即可像普通软件一样从开始菜单启动。<br><b>安卓：</b>用 Chrome 打开本应用 → 右上角菜单 → "安装应用 / 添加到主屏幕"，桌面会出现图标，全屏离线使用。<br>详细步骤见 README.md。</p></div>' +
      '<div class="card"><h3>💾 数据管理</h3><p class="muted">所有学习进度仅保存在本机浏览器中，不会上传。建议定期导出备份。</p>' +
        '<div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap"><button class="btn sm" data-action="export">导出进度</button><button class="btn sm" data-action="import">导入进度</button><button class="btn sm danger" data-action="reset">重置全部进度</button></div>' +
        '<input type="file" id="importFile" accept="application/json" style="display:none"></div>' +
      '<div class="card center muted" style="font-size:12px">英语启航 EnglishQuest · 让坚持变得有趣 🚀</div>';
  }
  function voiceOptionsHtml(mode) {
    const feedback = mode === 'feedback';
    const cur = feedback ? state.feedbackVoice : state.voiceURI;
    const vs = feedback ? voiceList().filter(v => /^zh/i.test(v.lang)) : englishVoices();
    const styles = VOICE_STYLES.map(s =>
      '<option value="' + s.key + '"' + (cur === s.key ? ' selected' : '') + '>' + s.name + '</option>'
    ).join('');
    const sys = vs.map(v =>
      '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === cur || v.name === cur ? ' selected' : '') + '>' + esc(v.name) + ' · ' + esc(v.lang) + '</option>'
    ).join('');
    const built = '<optgroup label="内置语音风格（所有设备可用）">' + styles + '</optgroup>';
    const mine = state.voiceProfile ? '<option value="style:mine"' + (cur === 'style:mine' ? ' selected' : '') + '>🎤 我的声音（录音识别）</option>' : '';
    const mineGroup = mine ? '<optgroup label="我的专属语音包">' + mine + '</optgroup>' : '';
    if (feedback) {
      return '<option value=""' + (cur ? '' : ' selected') + '>跟随朗读声音</option>' +
        '<option value="none"' + (cur === 'none' ? ' selected' : '') + '>系统中文原声（不变声）</option>' +
        mineGroup + built + (sys ? '<optgroup label="系统中文语音（取决于设备）">' + sys + '</optgroup>' : '');
    }
    return '<option value=""' + (cur ? '' : ' selected') + '>系统默认声音</option>' + mineGroup + built +
      (sys ? '<optgroup label="系统语音（取决于设备）">' + sys + '</optgroup>' : '');
  }
  function voiceDisplayName(uri) {
    const key = uri === undefined ? state.voiceURI : uri;
    const st = VOICE_STYLES.find(s => s.key === key);
    if (st) return st.name;
    if (key === 'style:mine') return state.voiceProfile ? '🎤 我的声音（录音识别）' : '跟随朗读声音';
    if (key === 'none') return '系统中文原声';
    if (!key) return '跟随朗读声音';
    const v = voiceList().find(x => x.voiceURI === key || x.name === key);
    return v ? v.name : '跟随朗读声音';
  }
  function toneName() {
    return { funny: '幽默搞笑', gentle: '温柔鼓励', short: '简洁干脆' }[state.feedbackTone] || '幽默搞笑';
  }
  function refreshVoiceSelect() {
    const sel = $('#voiceSelect');
    if (sel) sel.innerHTML = voiceOptionsHtml('read');
    const fsel = $('#feedbackVoiceSelect');
    if (fsel) fsel.innerHTML = voiceOptionsHtml('feedback');
    const n = $('#voiceCount');
    if (n) n.textContent = '内置 ' + VOICE_STYLES.length + ' 种语音风格 · 系统提供 ' + englishVoices().length + ' 个英文语音';
  }
  function row(label, value) { return '<div class="info-row"><span class="label">' + label + '</span><span class="value">' + esc(value) + '</span></div>'; }
  function render() {
    refreshDay(); updateHeader(); renderHome(); renderLearn(); renderPlan(); renderBadges(); renderMe(); saveState();
  }
  function go(view) {
    $$('.view').forEach(v => v.classList.remove('active'));
    const target = $('#view-' + view);
    if (target) target.classList.add('active');
    $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.nav === view));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- 练习引擎 ---------- */
  function startExercise(type, taskId, cfg) {
    ex = { type, taskId, cfg: cfg || {}, step: 0, correct: 0, total: 0, locked: false, readingDone: {} };
    const phase = phaseOf();
    const C = ex.cfg;
    const seed = C.seed || ((state.dayIndex || 1) * 100 + (taskId ? taskId.charCodeAt(0) : 0));
    if (type === 'letter') {
      ex.cards = C.idx ? C.idx.map(i => LETTERS[i]) : [LETTERS[(Math.max(1, state.dayIndex || 1) - 1) % 26]];
      renderLetter();
    } else if (type === 'blend') {
      ex.cards = C.idx ? C.idx.map(i => BLEND_LESSONS[i % BLEND_LESSONS.length]) : pick(BLEND_LESSONS, 3);
      renderBlend();
    } else if (type === 'words') {
      const src = C.src === 'easy' ? EASY_WORDS : ALL_WORDS;
      if (C.start != null) ex.cards = sliceCycle(src, C.start, C.count);
      else { const count = phase.id === 1 ? 4 : 10; ex.cards = pick(wordPool(), count); }
      renderCard();
    } else if (type === 'phonetic') {
      ex.cards = C.idx ? C.idx.map(i => PHONETICS[i]) : pick(PHONETICS, 2);
      renderPhonetic();
    } else if (type === 'grammar') {
      ex.grammarIdx = C.idx != null ? C.idx : grammarIndex();
      ex.item = GRAMMAR[ex.grammarIdx];
      renderGrammar();
    } else if (type === 'listening') {
      if (C.kind === 'letter') {
        ex.questions = makeLetterListening(C.idx || [], seed);
        renderQuiz('🎧 听音辨字母', '听例词发音，选出它的开头字母');
      } else if (C.kind === 'phonetic') {
        ex.questions = makePhoneticListening(C.idx || [], seed);
        renderQuiz('🎧 听音辨音标', '听例词发音，选出正确的音标');
      } else if (C.kind === 'word') {
        ex.questions = makeWordListening(C.idx || [], seed);
        renderQuiz('🎧 听词选义', '听单词发音，选出中文意思');
      } else {
        ex.questions = C.idx ? makeListeningFromIndices(C.idx, seed) : makeListeningQuestions(4, seed);
        renderQuiz('🎧 听力挑战 · 听音选义', '听英文句子，选出正确的中文意思');
      }
    } else if (type === 'reading') {
      const pool = PASSAGES.filter(p => p.lvl <= Math.min(4, phase.id));
      ex.item = C.idx != null ? (pool[C.idx] || PASSAGES[C.idx % PASSAGES.length]) : pick(pool.length ? pool : PASSAGES, 1)[0];
      renderReading();
    } else if (type === 'speaking') {
      ex.item = C.idx != null ? SPEAK_TOPICS[C.idx % SPEAK_TOPICS.length] : pick(SPEAK_TOPICS, 1)[0];
      renderSpeaking();
    } else if (type === 'game') {
      const gsrc = C.src === 'easy' ? EASY_WORDS : ALL_WORDS;
      ex.pairs = C.start != null ? sliceCycle(gsrc, C.start, C.count) : pick(wordPool().filter(w => w.cn && w.w.length < 12), 5);
      ex.left = seededShuffle(ex.pairs, seed); ex.right = seededShuffle(ex.pairs, seed + 7);
      ex.selected = null; ex.matched = []; ex.total = ex.pairs.length;
      renderGame();
    } else if (type === 'review') {
      const pool = C.src === 'easy' ? EASY_WORDS : ALL_WORDS;
      ex.questions = C.start != null
        ? makeWordQuestions(sliceCycle(pool, C.start, C.count), C.count, seed)
        : makeWordQuestions(pool, 5, seed);
      renderQuiz('🔁 复习巩固', '看看你还记得多少单词');
    } else if (type === 'dueReview') {
      ex.results = [];
      ex.questions = makeDueQuestions(C.keys || [], seed);
      if (!ex.questions.length) { ex = null; toast('当前没有到期的复习内容'); return; }
      renderQuiz('⏰ 今日到期复习', '系统按遗忘曲线安排的 ' + ex.questions.length + ' 项，答完自动排下次复习');
    } else if (type === 'mock') {
      ex.questions = makeMockQuestions(10, seed);
      renderQuiz('📝 四级综合模考', '10 道题，检验你的学习成果');
    } else if (type === 'cenListening') {
      ex.questions = makeCET4ListeningQuestions(5, seed);
      renderQuiz('🎧 四级听力训练', '新闻 / 对话 / 讲座 · 听后选择答案');
    } else if (type === 'cenReading') {
      const kind = C.kind || 'careful';
      if (kind === 'cloze') {
        ex.questions = makeClozeQuestions(CET4_CLOZE[seed % CET4_CLOZE.length]);
        renderQuiz('📚 选词填空', '根据上下文，为空格选择合适的词');
      } else if (kind === 'matching') {
        ex.questions = makeMatchingQuestions(CET4_MATCHING[seed % CET4_MATCHING.length]);
        renderQuiz('📚 长篇阅读匹配', '判断每个陈述对应哪一段');
      } else {
        ex.questions = makeCarefulQuestions(CET4_CAREFUL[seed % CET4_CAREFUL.length]);
        renderQuiz('📚 仔细阅读', '阅读短文并回答问题');
      }
    } else if (type === 'writing') {
      openWriting(C.id, taskId);
    } else if (type === 'translation') {
      openTranslationExercise(C.id, taskId);
    } else if (type === 'mockFull') {
      openFullMock(taskId);
    }
  }
  function makeWordQuestions(pool, n, seed) {
    const S = seed || Date.now();
    const chosen = seededShuffle(pool.filter(w => w.cn), S).slice(0, Math.min(n, pool.length));
    return chosen.map((w, i) => {
      const wrong = seededShuffle(pool.filter(x => x.w !== w.w && x.cn && x.cn !== w.cn), S + i + 1).slice(0, 3).map(x => x.cn);
      const opts = seededShuffle([w.cn].concat(wrong), S + i + 101);
      return { q: '“' + w.w + '” 的意思是？', opts, ans: opts.indexOf(w.cn), why: w.w + ' = ' + w.cn + (w.ex ? '；例句：' + w.ex : ''), audio: w.w };
    });
  }
  function makeDueQuestions(keys, seed) {
    const S = seed || Date.now();
    return keys.map((k, i) => {
      const p = String(k).indexOf(':');
      const kind = String(k).slice(0, p); const id = String(k).slice(p + 1);
      if (kind === 'w') {
        const w = ALL_WORDS.find(x => x.w === id);
        if (w) {
          const wrong = [];
          seededShuffle(ALL_WORDS.filter(x => x.w !== w.w && x.cn && x.cn !== w.cn), S + i).forEach(x => {
            if (wrong.length < 3 && wrong.indexOf(x.cn) < 0) wrong.push(x.cn);
          });
          const opts = seededShuffle([w.cn].concat(wrong), S + i + 101);
          return {
            q: '“' + w.w + '” 的意思是？', opts, ans: opts.indexOf(w.cn),
            why: w.w + ' = ' + w.cn + (w.ex ? '；例句：' + w.ex : ''), audio: w.w, srsKey: k
          };
        }
      } else if (kind === 'g') {
        const g = GRAMMAR[Number(id)];
        if (g) return { q: '语法复习：' + g.q, opts: g.opts, ans: g.ans, why: g.why, srsKey: k };
      } else if (kind === 'p' || kind === 'phonetic') {
        const ph = PHONETICS[Number(id)];
        if (ph) {
          const wrong = seededShuffle(PHONETICS.filter(x => x.ex !== ph.ex), S + i).slice(0, 3).map(x => x.ex);
          const opts = seededShuffle([ph.ex].concat(wrong), S + i + 31);
          return { q: '音标 ' + ph.sym + ' 的例词是？', opts, ans: opts.indexOf(ph.ex), why: ph.sym + ' 例词：' + ph.ex + ' ' + ph.cn, srsKey: k };
        }
      } else if (kind === 'l' || kind === 'letter') {
        const l = LETTERS[Number(id)];
        if (l) {
          const wrong = seededShuffle(LETTERS.filter(x => x.sound !== l.sound && x.sound), S + i).slice(0, 3).map(x => x.sound);
          const opts = seededShuffle([l.sound].concat(wrong), S + i + 41);
          return { q: '字母 ' + l.letter + ' 在单词里发什么音？', opts, ans: opts.indexOf(l.sound), why: l.soundEx + ' 以 ' + l.letter + ' 开头，发 ' + l.sound, audio: l.soundEx, srsKey: k };
        }
      }
      return null;
    }).filter(Boolean);
  }
  function makeLetterListening(indices, seed) {
    return indices.map((idx, i) => {
      const L = LETTERS[idx % LETTERS.length];
      const wrong = seededShuffle(LETTERS.filter(x => x.letter !== L.letter), seed + i + 1).slice(0, 3).map(x => x.letter);
      const opts = seededShuffle([L.letter].concat(wrong), seed + i + 51);
      return { q: '听一听，这个单词是哪个字母开头？', audio: L.soundEx, opts, ans: opts.indexOf(L.letter), why: L.soundEx + ' 以 ' + L.letter + ' 开头，字母音是 ' + L.sound };
    });
  }
  function makePhoneticListening(indices, seed) {
    return indices.map((idx, i) => {
      const ph = PHONETICS[idx % PHONETICS.length];
      const wrong = seededShuffle(PHONETICS.filter(x => x.sym !== ph.sym), seed + i + 1).slice(0, 3).map(x => x.sym);
      const opts = seededShuffle([ph.sym].concat(wrong), seed + i + 51);
      return { q: '听一听，这个例词里的音是？', audio: ph.ex, opts, ans: opts.indexOf(ph.sym), why: ph.ex + ' 里的关键音是 ' + ph.sym + '（' + ph.cn + '）' };
    });
  }
  function makeWordListening(indices, seed) {
    return indices.map((idx, i) => {
      const w = ALL_WORDS[idx % ALL_WORDS.length];
      if (!w || !w.cn) return null;
      const wrong = seededShuffle(ALL_WORDS.filter(x => x.w !== w.w && x.cn && x.cn !== w.cn), seed + i + 1).slice(0, 3).map(x => x.cn);
      const opts = seededShuffle([w.cn].concat(wrong), seed + i + 51);
      return { q: '听一听，这个单词是什么意思？', audio: w.w, opts, ans: opts.indexOf(w.cn), why: w.w + ' = ' + w.cn };
    });
  }
  function makeListeningFromIndices(indices, seed) {
    return indices.map((idx, i) => {
      const item = LISTEN_BANK[idx % LISTEN_BANK.length];
      const wrong = seededShuffle(LISTEN_BANK.filter(x => x[1] !== item[1]), seed + i + 1).slice(0, 3).map(x => x[1]);
      const opts = seededShuffle([item[1]].concat(wrong), seed + i + 51);
      return { q: '听一听，这句话是什么意思？', audio: item[0], opts, ans: opts.indexOf(item[1]), why: item[0] + ' = ' + item[1] };
    });
  }
  function makeListeningQuestions(n, seed) {
    const S = seed || Date.now();
    return makeListeningFromIndices(seededShuffle(LISTEN_BANK.map((_, i) => i), S).slice(0, n), S);
  }
  function makeMockQuestions(n, seed) {
    const S = seed || Date.now();
    const vocab = makeWordQuestions(wordPool(), Math.ceil(n / 2), S);
    const gram = seededShuffle(GRAMMAR, S + 9).slice(0, Math.floor(n / 2)).map(g => ({ q: g.q, opts: g.opts, ans: g.ans, why: g.why }));
    return seededShuffle(vocab.concat(gram), S + 17).slice(0, n);
  }
  function makeCET4ListeningQuestions(n, seed) {
    const S = seed || Date.now();
    return seededShuffle(CET4_LISTENING, S).slice(0, n).map(x => ({
      id:'L:'+x.id, q:x.q, audio:x.audio, opts:x.opts, ans:x.ans, why:x.why, type:'四级听力'
    }));
  }
  function makeClozeQuestions(item) {
    if (!item) return [];
    return item.ans.map((a, i) => {
      const right = item.bank[a];
      const wrong = seededShuffle(item.bank.filter((_, j) => j !== a), 7 + i).slice(0, 3);
      const opts = seededShuffle([right].concat(wrong), 13 + i);
      return { id:'C:'+item.id+':'+i, q:'第 ' + (i+1) + ' 空：' + item.text.replace(new RegExp('__' + (i+1) + '__'), '______'), opts, ans:opts.indexOf(right), why:(item.why && item.why[i]) || '', type:'选词填空' };
    });
  }
  function makeMatchingQuestions(item) {
    if (!item) return [];
    return item.ans.map((a, i) => ({
      id:'M:'+item.id+':'+i, q:'陈述：' + item.statements[i] + '\n它对应哪一段？',
      opts:item.paras.map(p => p.slice(0, 1)), ans:a, why:item.why && item.why[i] || '', type:'长篇阅读'
    }));
  }
  function makeCarefulQuestions(item) {
    if (!item) return [];
    return item.qs.map((q, i) => ({ id:'R:'+item.id+':'+i, q:'《'+item.title+'》'+q.q, opts:q.opts, ans:q.ans, why:q.why, type:'仔细阅读' }));
  }
  function dots() {
    if (!ex.questions) return '';
    return '<div class="progress-dots">' + ex.questions.map((_, i) => '<i class="' + (i <= ex.step ? 'on' : '') + '"></i>').join('') + '</div>';
  }
  function renderQuiz(title, subtitle) {
    ex.total = ex.questions.length;
    const q = ex.questions[ex.step];
    openModal(modalHead(title) +
      '<p class="muted">' + subtitle + ' · 第 ' + (ex.step + 1) + '/' + ex.questions.length + ' 题</p>' +
      dots() +
      (q.audio ? '<div class="listening-box"><div class="big-play">🎧</div><button class="btn sm" style="margin-top:10px;background:rgba(255,255,255,.15);color:#fff;border:none" data-action="speak" data-text="' + esc(q.audio) + '">🔊 再听一遍</button><p>点击播放英文原句</p></div>' : '') +
      '<div class="quiz-q">' + esc(q.q) + '</div>' +
      '<div class="opts">' + q.opts.map((o, i) => '<button class="opt" data-action="opt" data-i="' + i + '">' + String.fromCharCode(65 + i) + '. ' + esc(o) + '</button>').join('') + '</div>' +
      '<div id="fb"></div>');
    if (q.audio) setTimeout(() => speak(q.audio), 250);
  }
  function answer(i) {
    if (!ex || ex.locked || !ex.questions) return;
    ex.locked = true;
    const q = ex.questions[ex.step];
    const right = i === q.ans;
    if (right) ex.correct++;
    if (ex.type === 'dueReview' && q.srsKey) {
      if (!ex.results) ex.results = [];
      ex.results.push({ key: q.srsKey, ok: right });
      if (!right && q.srsKey.indexOf('w:') === 0) {
        const w = ALL_WORDS.find(x => x.w === q.srsKey.slice(2));
        if (w) {
          if (!ex.wrongWords) ex.wrongWords = [];
          if (!ex.wrongWords.some(x => x.w === w.w)) ex.wrongWords.push(w);
        }
      }
    }
    if (!right && q.id) {
      state.wrongBook[q.id] = { id:q.id, type:q.type || '练习', q:q.q, audio:q.audio || '', opts:q.opts, ans:q.ans, why:q.why || '', t:dateKey(), count:(state.wrongBook[q.id] ? state.wrongBook[q.id].count || 0 : 0) + 1 };
      saveState();
    }
    if (right && ex.type === 'wrongBook' && q.id) { delete state.wrongBook[q.id]; saveState(); }
    $$('.opt').forEach((b, idx) => {
      b.classList.add('disabled');
      if (idx === q.ans) b.classList.add('right');
      else if (idx === i) b.classList.add('wrong');
    });
    const spoken = voiceFeedback(right) || '';
    $('#fb').innerHTML = '<div class="quiz-feedback' + (right ? '' : ' bad') + '">' + (right ? '✅ 答对了！' : '❌ 正确答案：' + esc(q.opts[q.ans])) + '<br>' + esc(q.why || '') + '</div>' +
      (spoken ? '<div class="voice-line">🔊 ' + esc(spoken) + '</div>' : '') +
      '<div class="lesson-entry"><button class="btn sm" data-action="microLesson" data-kind="mock">🎬 看这道题的讲解</button></div>';
    setTimeout(() => {
      if (!ex) return;
      ex.step++; ex.locked = false;
      if (ex.step >= ex.questions.length) finishExercise(); else renderQuiz('🎯 继续挑战', '答对 ' + ex.correct + ' 题');
    }, right ? 700 : 1500);
  }
  function renderCard() {
    const w = ex.cards[ex.step];
    openModal(modalHead('📖 每日单词 · 第 ' + (ex.step + 1) + '/' + ex.cards.length + ' 张') +
      '<div class="progress-dots">' + ex.cards.map((_, i) => '<i class="' + (i <= ex.step ? 'on' : '') + '"></i>').join('') + '</div>' +
      '<div class="flashcard hide-cn" id="flash" data-action="flip">' +
        '<div class="word">' + esc(w.w) + '</div>' +
        '<div class="ph">' + esc(w.ph || '') + '</div>' +
        '<div class="cn">' + esc(w.cn) + '</div>' +
        (w.ex ? '<div class="ex">' + esc(w.ex) + '<br>' + esc(w.cnEx || '') + '</div>' : '') +
        '<button class="speak-btn" data-action="speak" data-text="' + esc(w.w) + '">🔊</button>' +
        '<div class="muted" style="margin-top:10px;font-size:11px">点击卡片翻开释义</div>' +
      '</div>' +
      '<div class="lesson-entry"><button class="btn sm" data-action="microLesson" data-kind="word">🎬 视频讲解：听老师讲这个单词</button></div>' +
      '<button class="btn primary big" data-action="learned">我记住了，下一张 →</button>');
    speak(w.w);
  }
  function learnedNext() {
    const w = ex.cards[ex.step];
    state.learnedWords[w.w] = { cnt: (state.learnedWords[w.w] ? state.learnedWords[w.w].cnt : 0) + 1, t: dateKey() };
    scheduleItem('w', w.w, dateKey());
    saveState();
    ex.step++;
    if (ex.step >= ex.cards.length) {
      ex.questions = makeWordQuestions(ex.cards, ex.cards.length);
      ex.step = 0; ex.cards = null;
      renderQuiz('🧠 小测验', '刚记的单词，考考你');
    } else renderCard();
  }
  function renderLetter() {
    const L = ex.cards[ex.step];
    const soundMode = !!(ex.cfg && ex.cfg.soundMode);
    const card = soundMode
      ? '<div class="reward-banner" style="font-size:13px">字母名叫 ' + esc(L.ph) + ' —— 你已经会了，现在学它在单词里发什么音</div>' +
        '<div class="flashcard" style="cursor:default">' +
          '<div class="word" style="font-size:44px">' + esc(L.letter) + '</div>' +
          '<div class="ph" style="font-size:32px">字母音 ' + esc(L.sound) + '</div>' +
          '<div class="ph" style="font-size:13px">👄 ' + esc(L.tip) + '</div>' +
          '<div class="cn" style="font-size:26px">' + esc(L.soundEx) + ' <span style="font-size:14px">' + esc(L.soundCn) + '</span></div>' +
          '<button class="speak-btn speak-label" data-action="speak" data-text="' + esc(L.soundEx) + '">🔊 听例词</button>' +
          '<div class="muted" style="margin-top:10px;font-size:12px">' + esc(L.hint) + '</div>' +
        '</div>'
      : '<div class="flashcard" style="cursor:default">' +
          '<div class="word" style="font-size:52px">' + esc(L.letter) + '</div>' +
          '<div class="ph">' + esc(L.ph) + '</div>' +
          '<div class="cn" style="font-size:24px">' + esc(L.ex) + ' <span style="font-size:14px">' + esc(L.cn) + '</span></div>' +
          '<button class="speak-btn" data-action="speak" data-text="' + esc(L.ex) + '">🔊</button>' +
        '</div>';
    openModal(modalHead((soundMode ? '🔤 字母音学习' : '🔤 字母学习') + ' · 第 ' + (ex.step + 1) + '/' + ex.cards.length + ' 个') +
      '<div class="progress-dots">' + ex.cards.map((_, i) => '<i class="' + (i <= ex.step ? 'on' : '') + '"></i>').join('') + '</div>' +
      card +
      '<button class="btn primary big" data-action="nextPhonetic">' + (ex.step === ex.cards.length - 1 ? '学会了，完成 →' : '下一个字母 →') + '</button>');
    speak(soundMode ? L.soundEx : L.ex);
  }
  function renderPhonetic() {
    const p = ex.cards[ex.step];
    openModal(modalHead('🔤 音标启蒙 · ' + (ex.step + 1) + '/' + ex.cards.length) +
      '<div class="reward-banner">发音是英语的第一把钥匙 🔑</div>' +
      '<div class="flashcard" style="cursor:default">' +
        '<div class="word" style="font-size:52px">' + esc(p.sym) + '</div>' +
        '<div class="ph">' + esc(p.type) + '</div>' +
        '<div class="cn" style="font-size:26px">' + esc(p.ex) + ' <span style="font-size:14px">' + esc(p.cn) + '</span></div>' +
        '<button class="speak-btn" data-action="speak" data-text="' + esc(p.ex) + '">🔊</button>' +
      '</div>' +
      '<div class="lesson-entry"><button class="btn sm" data-action="microLesson" data-kind="phonetic">🎬 视频讲解：口型与例词</button></div>' +
      '<button class="btn primary big" data-action="nextPhonetic">' + (ex.step === ex.cards.length - 1 ? '完成音标学习 →' : '下一个音标 →') + '</button>');
    speak(p.ex);
  }
  function renderBlend() {
    const b = ex.cards[ex.step];
    openModal(modalHead('🧩 自然拼读 · 第 ' + (ex.step + 1) + '/' + ex.cards.length + ' 个') +
      '<div class="progress-dots">' + ex.cards.map((_, i) => '<i class="' + (i <= ex.step ? 'on' : '') + '"></i>').join('') + '</div>' +
      '<div class="reward-banner" style="font-size:13px">把这几个音连起来，就能读出这个单词</div>' +
      '<div class="flashcard" style="cursor:default">' +
        '<div class="word" style="font-size:40px">' + b.parts.map(p => esc(p)).join(' + ') + '</div>' +
        '<div class="ph">拼起来 →</div>' +
        '<div class="cn" style="font-size:34px">' + esc(b.word) + ' <span style="font-size:14px">' + esc(b.cn) + '</span></div>' +
        '<button class="speak-btn speak-label" data-action="speak" data-text="' + esc(b.word) + '">🔊 听单词</button>' +
      '</div>' +
      '<button class="btn primary big" data-action="nextPhonetic">' + (ex.step === ex.cards.length - 1 ? '学会了，完成 →' : '下一个 →') + '</button>');
    speak(b.word);
  }
  function makeLetterSoundQuestions(cards, seed) {
    const S = seed || Date.now();
    return cards.map((L, i) => {
      const wrong = seededShuffle(LETTERS.filter(x => x.sound !== L.sound), S + i).slice(0, 3).map(x => x.sound);
      const opts = seededShuffle([L.sound].concat(wrong), S + i + 51);
      return { q: '字母 ' + L.letter + ' 在单词里发什么音？', opts, ans: opts.indexOf(L.sound), why: L.hint, audio: L.soundEx, type: '字母音' };
    });
  }
  function makePhoneticCardQuestions(cards, seed) {
    const S = seed || Date.now();
    return cards.map((p, i) => {
      const wrong = seededShuffle(PHONETICS.filter(x => x.sym !== p.sym), S + i).slice(0, 3).map(x => x.ex);
      const opts = seededShuffle([p.ex].concat(wrong), S + i + 51);
      return { q: '音标 ' + p.sym + ' 的例词是？', opts, ans: opts.indexOf(p.ex), why: p.sym + ' = ' + p.ex + ' ' + p.cn, audio: p.ex, type: '音标' };
    });
  }
  function makeBlendQuestions(cards, seed) {
    const S = seed || Date.now();
    return cards.map((b, i) => {
      const wrong = seededShuffle(BLEND_LESSONS.filter(x => x.word !== b.word), S + i).slice(0, 3).map(x => x.word);
      const opts = seededShuffle([b.word].concat(wrong), S + i + 51);
      return { q: '拼读 ' + b.parts.join(' + ') + ' → 哪个单词？', opts, ans: opts.indexOf(b.word), why: b.parts.join('+') + ' = ' + b.word + ' ' + b.cn, audio: b.word, type: '自然拼读' };
    });
  }
  function nextPhonetic() {
    ex.step++;
    if (ex.step >= ex.cards.length) {
      if ((ex.type === 'letter' || ex.type === 'phonetic') && ex.cfg.idx) {
        const kind = ex.type === 'letter' ? 'l' : 'p';
        ex.cfg.idx.forEach(i => scheduleItem(kind, i, dateKey()));
      }
      if (ex.type === 'blend' && ex.cfg.idx) {
        ex.cfg.idx.forEach(i => scheduleItem('w', BLEND_LESSONS[i % BLEND_LESSONS.length].word, dateKey()));
      }
      const seed = (state.dayIndex || 1) * 100 + (ex.taskId ? ex.taskId.charCodeAt(0) : 0);
      if (ex.type === 'letter') ex.questions = makeLetterSoundQuestions(ex.cards, seed);
      else if (ex.type === 'phonetic') ex.questions = makePhoneticCardQuestions(ex.cards, seed);
      else ex.questions = makeBlendQuestions(ex.cards, seed);
      ex.step = 0; ex.cards = null;
      renderQuiz('🧠 小测验', '刚学的 ' + ex.questions.length + ' 题，答对越多积分越高');
    } else if (ex.type === 'letter') renderLetter();
    else if (ex.type === 'blend') renderBlend();
    else renderPhonetic();
  }
  function renderGrammar() {
    ex.total = 1;
    const g = ex.item;
    openModal(modalHead('🧩 语法小课堂') +
      '<div class="reward-banner">今日语法点：' + esc(g.title) + '</div>' +
      '<div class="lesson-entry"><button class="btn sm" data-action="microLesson" data-kind="grammar">🎬 视频讲解：五步讲懂这个语法</button></div>' +
      '<div class="card" style="box-shadow:none">' +
        '<p style="font-size:16px"><b>📌 语法规则</b><br>' + esc(g.point) + '</p>' +
        '<p><b>✍️ 例句</b><br>' + esc(g.ex) + '<br><span class="muted">' + esc(g.cn) + '</span> ' +
        '<button class="btn sm" data-action="speak" data-text="' + esc(g.ex) + '">🔊 听例句</button></p>' +
      '</div>' +
      '<div class="quiz-q" style="margin-top:16px">练一练：' + esc(g.q) + '</div>' +
      '<div class="opts">' + g.opts.map((o, i) => '<button class="opt" data-action="grammarOpt" data-i="' + i + '">' + String.fromCharCode(65 + i) + '. ' + esc(o) + '</button>').join('') + '</div>' +
      '<div id="fb"></div>');
  }
  function grammarAnswer(i) {
    const g = ex.item;
    if (ex.locked) return;
    ex.locked = true;
    const right = i === g.ans;
    if (right) ex.correct = 1;
    $$('.opt').forEach((b, idx) => { b.classList.add('disabled'); if (idx === g.ans) b.classList.add('right'); else if (idx === i) b.classList.add('wrong'); });
    const spoken = voiceFeedback(right) || '';
    $('#fb').innerHTML = '<div class="quiz-feedback' + (right ? '' : ' bad') + '">' + (right ? '✅ 太棒了！' : '❌ 正确答案：' + esc(g.opts[g.ans])) + '<br>' + esc(g.why) + '</div>' +
      (spoken ? '<div class="voice-line">🔊 ' + esc(spoken) + '</div>' : '') +
      '<button class="btn primary big" data-action="finish">完成本节课 →</button>';
  }
  function renderReading() {
    ex.total = ex.item.qs.length;
    ex.readingDone = {};
    const p = ex.item;
    openModal(modalHead('📚 阅读闯关 · ' + esc(p.title)) +
      '<div class="sentence-display" style="text-align:left;font-size:16px">' + esc(p.text) + '</div>' +
      '<button class="btn sm" data-action="toggleTrans">👀 显示/隐藏中文</button>' +
      '<button class="btn sm" data-action="speak" data-text="' + esc(p.text) + '">🔊 听全文</button>' +
      '<div id="trans" class="muted" style="display:none;margin:12px 0;padding:12px;background:var(--bg);border-radius:12px">' + esc(p.cn) + '</div>' +
      '<div style="margin-top:16px"><h3>阅读理解</h3>' +
      p.qs.map((q, qi) => '<div class="quiz-q" style="font-size:15px;margin-top:12px">' + (qi + 1) + '. ' + esc(q.q) + '</div>' +
        '<div class="opts">' + q.opts.map((o, i) => '<button class="opt" data-action="readingOpt" data-q="' + qi + '" data-i="' + i + '">' + String.fromCharCode(65 + i) + '. ' + esc(o) + '</button>').join('') + '</div>').join('') +
      '</div><div id="fb"></div><button class="btn primary big" data-action="finish">完成阅读 →</button>');
  }
  function readingAnswer(qi, i) {
    const q = ex.item.qs[qi];
    if (ex.readingDone[qi]) return;
    ex.readingDone[qi] = true;
    const right = i === q.ans;
    if (right) ex.correct++;
    $$('[data-action="readingOpt"][data-q="' + qi + '"]').forEach((b, idx) => { b.classList.add('disabled'); if (idx === q.ans) b.classList.add('right'); else if (idx === i) b.classList.add('wrong'); });
    const spoken = voiceFeedback(right) || '';
    toast((right ? '✅ ' : '❌ ') + (spoken || (right ? '答对啦！' : '再想想，正确答案是 ' + String.fromCharCode(65 + q.ans))));
  }
  function renderSpeaking() {
    ex.total = 1;
    const t = ex.item;
    const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    openModal(modalHead('🎤 口语跟读') +
      '<div class="reward-banner">大胆开口，说得不好也没关系！</div>' +
      '<div class="record-area"><div class="prompt">' + esc(t.q) + '</div><div class="muted">参考回答：</div>' +
      '<div style="font-size:15px;margin:8px 0">' + esc(t.sample) + '</div><div class="muted">' + esc(t.cn) + '</div></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-action="speak" data-text="' + esc(t.sample) + '">🔊 听示范</button>' +
      (supported ? '<button class="btn orange" data-action="rec">🎙️ 开始朗读评分</button>' : '') +
      '<button class="btn mint" data-action="finish">我读好了 ✓</button></div>' +
      '<div id="recResult" class="muted" style="margin-top:12px"></div>');
    speak(t.sample);
  }
  function startRec() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
    $('#recResult').textContent = '🎙️ 正在聆听，请大声读出参考回答…';
    rec.onresult = e => {
      const said = e.results[0][0].transcript.toLowerCase().replace(/[^a-z ]/g, '');
      const target = ex.item.sample.toLowerCase().replace(/[^a-z ]/g, '');
      const words = target.split(/\s+/).filter(Boolean);
      const hit = words.filter(w => said.indexOf(w) !== -1).length;
      const score = Math.round(hit / Math.max(1, words.length) * 100);
      ex.correct = score >= 60 ? 1 : 0;
      $('#recResult').innerHTML = '<b>识别结果：</b>' + esc(e.results[0][0].transcript) + '<br><b>匹配度：</b>' + score + '% ' + (score >= 60 ? '🎉 非常棒！' : '继续加油，再试一次！');
      if (score >= 60) { confetti(); voiceFeedback(true); toast('🎉 发音很棒！口语能力 +1'); }
      else voiceFeedback(false);
    };
    rec.onerror = () => { $('#recResult').textContent = '😅 没听清，请检查麦克风权限后再试'; };
    try { rec.start(); } catch (e) { $('#recResult').textContent = '麦克风启动失败，可点击"我读好了"继续'; }
  }
  /* ---------- 情景口语对话：按学习进度分层，系统问 → 学生答 → 关键词判分 ---------- */
  let dialogueState = null;
  function dialogueTier() {
    const day = state.dayIndex || 1;
    const words = Object.keys(state.learnedWords || {}).length;
    if (day <= 83 || words < 30) return 'starter';
    if (day <= 240 || words < 150) return 'builder';
    return 'fluent';
  }
  function dialogueJudge(said, turn) {
    const s = String(said || '').toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim();
    const keys = (turn.keys || []).map(k => String(k).toLowerCase());
    const need = turn.need || 1;
    const hit = keys.filter(k => s.indexOf(k) !== -1).length;
    return { said: String(said || '').trim(), score: Math.min(100, Math.round(hit / need * 100)), ok: hit >= need };
  }
  function openDialogue(variant) {
    const tier = dialogueTier();
    const scenes = DIALOGUE_SCENES[tier] || DIALOGUE_SCENES.starter;
    const idx = variant ? Math.floor(Math.random() * scenes.length) : ((state.dayIndex || 1) - 1) % scenes.length;
    const scene = scenes[idx] || scenes[0];
    ex = null; writeState = null;
    document.body.classList.remove('write-fs');
    dialogueState = { tier, scene, step: 0, results: [], hint: false, busy: false, rec: null,
      supported: !!(window.SpeechRecognition || window.webkitSpeechRecognition) };
    renderDialogue();
    toast('💬 今日对话：' + scene.title + ' · 按第 ' + (state.dayIndex || 1) + ' 天进度匹配');
  }
  function dialogueSpeak() {
    const d = dialogueState;
    if (!d) return;
    const turn = d.scene.turns[d.step];
    if (turn) speak(turn.sys, Math.max(.75, state.rate), { silent: true });
  }
  function renderDialogue(reSpeak) {
    const d = dialogueState;
    if (!d) return;
    const turn = d.scene.turns[d.step];
    const tierName = { starter: '启蒙档', builder: '积累档', fluent: '进阶档' }[d.tier];
    const bubbles = [];
    d.results.forEach((r, i) => {
      const t = d.scene.turns[i];
      bubbles.push('<div class="chat-bubble sys">🗣️ ' + esc(t.sys) + '<div class="cn">' + esc(t.cn) + '</div></div>');
      bubbles.push('<div class="chat-bubble me">' + esc(r.said || '（没听清）') +
        (t.sampleCn ? '<div class="cn-mean">中文意思：' + esc(t.sampleCn) + '</div>' : '') +
        '<div class="score' + (r.ok ? '' : ' low') + '">' + (r.ok ? '👍 答对了' : '💪 再练练') + ' · 匹配 ' + r.score + '%</div></div>');
    });
    bubbles.push('<div class="chat-bubble sys">🗣️ ' + esc(turn.sys) +
      ' <button class="en-play" data-action="dlgSpeak" title="再听一遍">🔊</button>' +
      '<div class="cn">' + esc(turn.cn) + '</div></div>');
    const ctrl = d.supported
      ? '<div class="chat-ctrl"><button class="btn primary" data-action="dlgRec">🎙️ 我来回答</button>' +
        '<button class="btn" data-action="dlgHint">' + (d.hint ? '🙈 收起参考' : '💡 看参考回答') + '</button>' +
        '<button class="btn" data-action="dlgSkip">跳过这轮 →</button></div>'
      : '<input class="chat-input" id="dlgText" placeholder="这台设备不支持语音识别，请输入英文回答" autocomplete="off">' +
        '<div class="chat-ctrl"><button class="btn primary" data-action="dlgSubmitText">提交回答 →</button>' +
        '<button class="btn" data-action="dlgHint">' + (d.hint ? '🙈 收起参考' : '💡 看参考回答') + '</button>' +
        '<button class="btn" data-action="dlgSkip">跳过这轮 →</button></div>';
    openModal(modalHead('💬 情景口语对话') +
      '<div class="reward-banner">第 ' + (d.step + 1) + ' / ' + d.scene.turns.length + ' 轮 · ' + esc(d.scene.title) +
      ' <span class="dialogue-level">' + esc(d.scene.emoji + ' ' + tierName) + '</span></div>' +
      '<div class="chat-wrap">' + bubbles.join('') + '</div>' +
      (d.hint ? '<div class="chat-hint"><b>参考回答：</b>' + esc(turn.sample) +
        (turn.sampleCn ? '<div class="cn-mean">中文意思：' + esc(turn.sampleCn) + '</div>' : '') +
        '<span class="muted">' + esc(turn.tip || '') + '</span></div>' : '') +
      ctrl +
      '<p class="muted center" style="font-size:11px;margin:10px 0 0">按第 ' + (state.dayIndex || 1) + ' 天 · 已学 ' +
      Object.keys(state.learnedWords || {}).length + ' 词为你匹配 · 说不准也没关系，大胆开口</p>');
    if (reSpeak !== false) setTimeout(dialogueSpeak, 320);
  }
  function dialogueStartRec() {
    const d = dialogueState;
    if (!d || d.busy || !d.supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
    d.rec = rec; d.busy = true;
    const btn = $('[data-action="dlgRec"]');
    if (btn) { btn.innerHTML = '<span class="rec-pulse"></span>正在聆听…'; btn.disabled = true; }
    const finish = (said, err) => {
      d.busy = false; d.rec = null;
      if (err || !said) {
        const b = $('[data-action="dlgRec"]');
        if (b) { b.textContent = '🎙️ 再说一次'; b.disabled = false; }
        toast('没听清，请检查麦克风后再说一次，或点「看参考」');
        return;
      }
      d.results.push(dialogueJudge(said, d.scene.turns[d.step]));
      voiceFeedback(d.results[d.results.length - 1].ok);
      setTimeout(dialogueNext, 850);
    };
    rec.onresult = e => finish(e.results[0][0].transcript, false);
    rec.onerror = () => finish(null, true);
    rec.onend = () => { if (d.busy) finish(null, true); };
    try { rec.start(); } catch (e) { finish(null, true); }
  }
  function dialogueSubmitText() {
    const d = dialogueState;
    if (!d) return;
    const input = $('#dlgText');
    const val = input ? input.value.trim() : '';
    if (!val) { toast('先写出你的英文回答'); return; }
    d.results.push(dialogueJudge(val, d.scene.turns[d.step]));
    voiceFeedback(d.results[d.results.length - 1].ok);
    dialogueNext();
  }
  function dialogueToggleHint() {
    const d = dialogueState;
    if (!d) return;
    d.hint = !d.hint;
    renderDialogue(false);
  }
  function dialogueNext() {
    const d = dialogueState;
    if (!d) return;
    if (d.step < d.scene.turns.length - 1) { d.step++; d.hint = false; renderDialogue(); }
    else dialogueFinish();
  }
  function dialogueFinish() {
    const d = dialogueState;
    if (!d) return;
    const good = d.results.filter(r => r.ok).length;
    const total = d.scene.turns.length;
    const pct = Math.round(good / total * 100);
    const weak = d.results.filter(r => !r.ok).map(r => r.said).filter(Boolean);
    if (!state.dialogueStats || typeof state.dialogueStats !== 'object') state.dialogueStats = { total: 0, good: 0, weak: [] };
    state.dialogueStats.total += total;
    state.dialogueStats.good += good;
    state.dialogueStats.weak = weak.slice(0, 12);
    saveState();
    dialogueState = null;
    openModal(modalHead('🎉 对话完成') +
      '<div class="reward-banner" style="font-size:17px">答对 ' + good + ' / ' + total + ' 轮 · ' + pct + ' 分</div>' +
      '<div class="center" style="font-size:48px;margin:8px 0">' + (pct >= 75 ? '🏆' : (pct >= 50 ? '🌟' : '💪')) + '</div>' +
      '<p class="center">' + (pct >= 75 ? '对话很流畅，继续保持！' : '多说几遍就顺了，下次再挑战') + '</p>' +
      (weak.length ? '<p class="muted center" style="font-size:12px">这些句子再练练：' + esc(weak.join(' / ')) + '</p>' : '') +
      '<div class="center muted" style="font-size:12px;margin:8px 0">自由口语练习不计积分，开口就是进步</div>' +
      '<button class="btn primary big" data-action="dlgRetry">换个场景再练一次</button>' +
      '<button class="btn big" data-action="close" style="margin-top:8px">完成，返回 →</button>');
    confetti();
  }
  function renderGame() {
    const tile = (w, side) => '<button class="game-tile' + (side === 'L' && ex.selected === w.w ? ' selected' : '') + (ex.matched.indexOf(w.w) !== -1 ? ' matched' : '') + '" data-action="gameTile" data-side="' + side + '" data-w="' + esc(w.w) + '">' + esc(side === 'L' ? w.w : w.cn) + '</button>';
    openModal(modalHead('🎮 单词配对游戏') +
      '<p class="muted">点击左侧英文，再点击右侧对应的中文。全部配对成功即通关！</p>' +
      '<div class="progress"><i style="width:' + Math.round(ex.matched.length / ex.pairs.length * 100) + '%"></i></div>' +
      '<div class="game-grid"><div class="game-pairs">' + ex.left.map(w => tile(w, 'L')).join('') + '</div>' +
      '<div class="game-pairs">' + ex.right.map(w => tile(w, 'R')).join('') + '</div></div>' +
      '<p class="muted center">已配对 ' + ex.matched.length + ' / ' + ex.pairs.length + '</p>');
  }
  function gameTile(w, side) {
    if (ex.matched.indexOf(w) !== -1 || ex.type !== 'game') return;
    if (side === 'L') { ex.selected = w; ex.wrong = null; renderGame(); return; }
    if (!ex.selected) { toast('先点左边的英文单词哦'); return; }
    if (ex.selected === w) {
      ex.matched.push(w); ex.selected = null; ex.correct++;
      state.learnedWords[w] = { cnt: 1, t: dateKey() }; scheduleItem('w', w, dateKey()); saveState();
      voiceFeedback(true);
      if (ex.matched.length === ex.pairs.length) { setTimeout(finishExercise, 350); return; }
      renderGame();
    } else {
      ex.wrong = w; voiceFeedback(false); toast('❌ 不是这个，再看看～');
      const btn = $('[data-action="gameTile"][data-side="R"][data-w="' + w + '"]');
      if (btn) { btn.style.borderColor = '#E17055'; setTimeout(() => { if (btn.isConnected) btn.style.borderColor = ''; }, 500); }
    }
  }
  function finishExercise() {
    if (!ex) return;
    applyReviewResults();
    const task = ex.taskId ? taskById(ex.taskId) : null;
    const score = ex.correct || 0;
    const total = ex.total || (ex.questions ? ex.questions.length : 0) || 1;
    // 自由学习区不发放积分；每日任务按「答对题数 / 总题数」比例发放，当天重做只补差额
    const target = task ? taskXpFor(task, score, total) : 0;
    const xp = task ? completeTask(task.id, target) : 0;
    const accumulated = task ? (state.xpLog[dateKey()] && state.xpLog[dateKey()]['task:' + task.id]) || 0 : 0;
    const type = ex.type;
    const wrongWords = type === 'dueReview' && ex.wrongWords ? ex.wrongWords.slice(0, 3) : [];
    ex = null;
    let xpLine;
    if (!task) xpLine = '自由练习不计积分，练多少都算数！';
    else if (target <= 0) xpLine = '答对 ' + score + '/' + total + ' 题，本次暂不得分，再练一次还能补上';
    else if (xp <= 0) xpLine = '答对 ' + score + '/' + total + ' 题，今日这项已累计 ' + accumulated + '/' + task.xp + ' XP';
    else xpLine = '+' + xp + ' XP（答对 ' + score + '/' + total + ' 题，本题组最高 ' + task.xp + ' XP）';
    const finishHtml = modalHead('🎉 挑战完成') +
      '<div class="reward-banner" style="font-size:18px">' + xpLine + '</div>' +
      '<div class="center" style="font-size:52px;margin:10px 0">' + (score > 0 ? '🌟' : '💪') + '</div>' +
      '<p class="center">' + (type === 'mock' ? '模考答对 ' + score + ' 题' : '答对 ' + score + ' 题') + '，每一次练习都在让你更接近四级！</p>' +
      '<button class="btn primary big" data-action="close">完成，返回 →</button>';
    if (wrongWords.length) {
      const items = wrongWords.map(w => ({ kind: '错词', text: w.w, sub: (w.cn || '') + (w.ph ? ' ' + w.ph : '') }));
      openWritePad(items, { mode: 'reviewFix', finishHtml: finishHtml });
      toast('✍️ ' + wrongWords.length + ' 个词答错了，写一遍描红再结束');
    } else {
      openModal(finishHtml);
    }
    if (xp > 0) confetti();
    toast(xp > 0 ? '🎉 太棒了！获得 ' + xp + ' XP' : (task ? '🌟 答对 ' + score + '/' + total + '，继续加油！' : '🌟 自由练习完成！'));
  }

  /* ---------- 事件处理 ---------- */
  /* ---------- 手写练习板 ---------- */
  function writeItems() {
    const t = dailyTasks().find(x => x.id === 'b');
    const cfg = t && t.cfg;
    const today = cfg ? sliceCycle(ALL_WORDS, cfg.start, cfg.count) : ALL_WORDS.slice(0, 8);
    const items = [];
    today.forEach(w => items.push({ kind: '今日单词', text: w.w, sub: w.cn + (w.ph ? ' ' + w.ph : '') }));
    LETTERS.forEach(l => items.push({ kind: '字母', text: l.letter, sub: l.ph + ' · ' + l.ex + ' ' + l.cn }));
    ALL_WORDS.slice(0, 20).forEach(w => items.push({ kind: '常用词', text: w.w, sub: w.cn }));
    return items;
  }
  /* ---------- 默写测验：听朗读 + 看中文 → 手写 → 自己对照答案 ---------- */
  function dictationItems(scope) {
    const all = scope === 'all';
    const S = Date.now();
    const items = [];
    const t = dailyTasks().find(x => x.id === 'b');
    const cfg = t && t.cfg;
    const src = all ? ALL_WORDS : (cfg && cfg.src === 'easy' ? EASY_WORDS : ALL_WORDS);
    const start = cfg ? cfg.start : 0;
    const wordPool = all ? seededShuffle(ALL_WORDS.filter(w => w.cn), S).slice(0, 4)
      : sliceCycle(src, start, cfg ? cfg.count : 8).filter(w => w.cn);
    seededShuffle(wordPool, S).slice(0, 4).forEach(w => {
      items.push({ kind:'单词', text:w.w, sub:w.cn + (w.ph ? ' ' + w.ph : ''),
        prompt:w.cn + (w.ph ? '（' + w.ph + '）' : ''), audio:w.w, answer:w.w, srsKind:'w', srsId:w.w });
    });
    seededShuffle(LETTERS, S + 7).slice(0, 3).forEach(l => {
      const letter = String(l.letter).split(' ')[0];
      const idx = LETTERS.findIndex(x => x.letter === l.letter);
      items.push({ kind:'字母音', text:letter, sub:'例词 ' + l.soundEx + ' ' + l.soundCn + ' · 发音 ' + l.sound,
        prompt:'听例词，写出开头字母（' + l.soundCn + '，' + l.sound + '）', audio:l.soundEx,
        answer:letter, srsKind:'l', srsId:idx });
    });
    seededShuffle(GRAMMAR, S + 13).slice(0, 3).forEach(g => {
      const firstEx = String(g.ex || '').split('.')[0];
      const firstCn = String(g.cn || '').split('。')[0];
      const idx = GRAMMAR.findIndex(x => x === g);
      items.push({ kind:'语法句型', text:firstEx, sub:g.title + ' · ' + firstCn,
        prompt:firstCn + '（听英文，写出句子）', audio:firstEx,
        answer:firstEx, srsKind:'g', srsId:idx });
    });
    return seededShuffle(items, S + 29);
  }
  function openDictation(scope) {
    ex = null; writeState = null; closeModal();
    openWritePad(dictationItems(scope), { mode:'dictation' });
    toast(scope === 'all' ? '🎓 四级词库默写：4642 词随机抽题，听音看义写英文' : '✍️ 默写测验开始：听发音、看中文，写出英文');
  }

  function openWritePad(items, opts) {
    const o = opts || {};
    writeState = {
      items: items || writeItems(), idx: 0, strokes: [], cur: null,
      color: '#6C5CE7', size: 6, guide: (o.mode === 'dictation' ? false : true),
      mode: o.mode || 'free', finishHtml: o.finishHtml || null,
      results: [], checking: false, fs: false
    };
    renderWritePad();
  }
  function renderWritePad() {
    const w = writeState;
    if (!w) return;
    const item = w.items[w.idx];
    const fix = w.mode === 'reviewFix';
    const dict = w.mode === 'dictation';
    const colors = [['#6C5CE7', '紫'], ['#0984E3', '蓝'], ['#2D3436', '黑'], ['#E17055', '红'], ['#00B894', '绿']];
    openModal(modalHead(dict ? '📝 默写测验' : (fix ? '✍️ 错词手写巩固' : '✍️ 手写练习板')) +
      '<div class="reward-banner">' + (dict ? '听发音、看提示，写出英文 · 写好后自己对照答案' : (fix ? '这几个词刚才答错了，各写一遍描红就完成复习' : '用手写加深记忆 · 今日写满可 +5 XP')) + '</div>' +
      (dict
        ? '<div class="dict-prompt"><button class="dict-play" data-action="dictSpeak">🔊 播放朗读</button>' +
          '<div class="dict-mean">' + esc(item.prompt || item.sub) + '</div>' +
          '<div class="muted" style="font-size:11px;margin-top:6px">不要看答案，凭记忆默写</div></div>'
        : '<div class="write-nav"><div><div class="write-target" id="writeTarget">' + esc(item.text) + '</div>' +
          '<div class="write-hint"><span class="badge purple">' + item.kind + '</span> ' + esc(item.sub) + '</div></div>' +
          '<div class="muted" id="writeIdx">' + (w.idx + 1) + ' / ' + w.items.length + '</div></div>') +
      '<div class="write-toolbar">' +
        '<div class="group"><span class="lbl">颜色</span>' + colors.map(c =>
          '<button class="color-dot' + (c[0] === w.color ? ' on' : '') + '" style="background:' + c[0] + '" data-action="writeColor" data-color="' + c[0] + '" title="' + c[1] + '"></button>').join('') + '</div>' +
        '<div class="group"><span class="lbl">粗细</span>' + [[3, '细'], [6, '中'], [11, '粗']].map(s =>
          '<button class="size-btn' + (s[0] === w.size ? ' on' : '') + '" data-action="writeSize" data-size="' + s[0] + '"><i style="width:' + Math.max(4, s[0]) + 'px;height:' + Math.max(4, s[0]) + 'px"></i></button>').join('') + '</div>' +
      '</div>' +
      '<div class="write-canvas-wrap"><canvas id="writeCanvas"></canvas></div>' +
      '<div class="write-toolbar" style="margin-top:12px">' +
        (fix || dict ? '' : '<button class="btn sm" data-action="writePrev">← 上一个</button><button class="btn sm" data-action="writeNext">下一个 →</button>') +
        (dict ? '' : '<button class="btn sm" data-action="writeGuide">' + (w.guide ? '👻 隐藏描红' : '👻 显示描红') + '</button>') +
        '<button class="btn sm" data-action="writeUndo">↩️ 撤销</button>' +
        '<button class="btn sm" data-action="writeClear">🗑️ 清空</button>' +
        '<button class="btn sm" data-action="writeSave">💾 保存图片</button>' +
        '<button class="btn sm" data-action="writeFull">' + (w.fs ? '⛶ 退出全屏' : '⛶ 全屏书写') + '</button>' +
      '</div>' +
      '<button class="btn primary big" data-action="' + (dict ? 'dictSubmit' : 'writeDone') + '">' + (dict ? (w.idx < w.items.length - 1 ? '写好了，核对答案 →' : '写好了，核对答案 →') : (fix ? (w.idx < w.items.length - 1 ? '写好了，下一个 →' : '写好了，完成复习 →') : '我写好了 ✓ 领取奖励')) + '</button>' +
      '<p class="write-foot muted center" style="margin:10px 0 0;font-size:12px">' + (dict ? '手写后点按钮查看正确答案，由你自己判断写对没有' : '可以用手指、触控笔或鼠标书写；浅灰色字是描红底稿') + '</p>' +
      (w.fs ? '<p class="write-fs-tip">横屏书写体验更佳 · 点上方按钮或按 Esc 退出全屏</p>' : ''));
    // 优先立即初始化；若 modal 尚未布局（宽高为 0），再在下一帧重试
    setupWriteCanvas();
    requestAnimationFrame(setupWriteCanvas);
    if (dict) speak(item.audio || item.text, Math.max(.72, state.rate), { silent:true });
  }
  function drawWriteScene(ctx, width, height, guide) {
    const w = writeState;
    if (!w) return;
    ctx.clearRect(0, 0, width, height);
    if (guide) {
      const item = w.items[w.idx];
      ctx.save();
      ctx.fillStyle = '#E4E8F5';
      const size = Math.min(width * 0.34, height * 0.72);
      ctx.font = '800 ' + size + 'px Arial, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(item.text, width / 2, height / 2 + 4);
      ctx.restore();
    }
    const drawStroke = s => {
      if (!s.points.length) return;
      ctx.save();
      ctx.strokeStyle = s.color; ctx.fillStyle = s.color;
      ctx.lineWidth = s.size; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      s.points.forEach((p, i) => { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
      if (s.points.length === 1) ctx.arc(s.points[0].x, s.points[0].y, s.size / 2, 0, Math.PI * 2);
      ctx.stroke(); ctx.restore();
    };
    w.strokes.forEach(drawStroke);
    if (w.cur) drawStroke(w.cur);
  }
  function redrawWrite() {
    const w = writeState;
    if (!w || !w.ctx) return;
    drawWriteScene(w.ctx, w.w, w.h, w.guide);
  }
  // 用「布局尺寸」建立画布坐标系：getBoundingClientRect 会被弹窗缩放动画/全屏变换污染，
  // 用 clientWidth/clientHeight 才能保证画布像素、笔画坐标、手指位置三者一致。
  function writeLayoutSize(c) {
    return { w: c.clientWidth || c.offsetWidth || 0, h: c.clientHeight || c.offsetHeight || 0 };
  }
  function setupWriteCanvas() {
    const c = $('#writeCanvas');
    const w = writeState;
    if (!c || !w) return;
    const size = writeLayoutSize(c);
    if (size.w < 2 || size.h < 2) return; // 还没完成布局，等下一次回调
    const dpr = window.devicePixelRatio || 1;
    // 横竖屏切换后画布尺寸会变：把已有笔画按新尺寸等比缩放，避免旧笔迹跑到别处
    if (w.w > 2 && w.h > 2 && (Math.abs(w.w - size.w) > 1 || Math.abs(w.h - size.h) > 1)) {
      const kx = size.w / w.w, ky = size.h / w.h;
      const scalePts = pts => pts.forEach(p => { p.x *= kx; p.y *= ky; });
      (w.strokes || []).forEach(s => scalePts(s.points));
      if (w.cur) scalePts(w.cur.points);
    }
    c.width = Math.round(size.w * dpr); c.height = Math.round(size.h * dpr);
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    w.ctx = ctx; w.w = size.w; w.h = size.h;
    redrawWrite();
    // 手指坐标换算到布局坐标系，抵消祖先元素的 transform 缩放（弹窗入场动画、全屏缩放、浏览器缩放）
    const pos = e => {
      const r = c.getBoundingClientRect();
      const sx = r.width ? r.width / (c.clientWidth || c.offsetWidth || r.width) : 1;
      const sy = r.height ? r.height / (c.clientHeight || c.offsetHeight || r.height) : 1;
      return { x: (e.clientX - r.left) / sx, y: (e.clientY - r.top) / sy };
    };
    c.onpointerdown = e => {
      e.preventDefault();
      try { c.setPointerCapture(e.pointerId); } catch (err) { /* 某些浏览器/触控笔不支持捕获，忽略即可继续书写 */ }
      w.cur = { color: w.color, size: w.size, points: [pos(e)] }; redrawWrite();
    };
    c.onpointermove = e => {
      if (!w.cur) return; e.preventDefault();
      w.cur.points.push(pos(e)); redrawWrite();
    };
    const finish = () => { if (w.cur) { w.strokes.push(w.cur); w.cur = null; redrawWrite(); } };
    c.onpointerup = finish; c.onpointercancel = finish; c.onpointerleave = finish;
  }
  // 旋转/窗口尺寸变化后必须重建画布，否则横屏会出现「手写 A 处、显示 B 处」的错位
  function onWriteViewportChange() {
    if (!writeState) return;
    setupWriteCanvas();
    setTimeout(setupWriteCanvas, 120);
    setTimeout(setupWriteCanvas, 380);
  }
  /* 全屏书写：优先用系统全屏（可旋转横屏），iOS 不支持时用 CSS 铺满兜底 */
  function setWriteFull(on) {
    const w = writeState;
    if (!w) return;
    w.fs = !!on;
    const m = $('#modal');
    if (w.fs) {
      document.body.classList.add('write-fs');
      if (m && m.requestFullscreen) { try { m.requestFullscreen().catch(() => {}); } catch (e) {} }
    } else {
      document.body.classList.remove('write-fs');
      if (document.fullscreenElement && document.exitFullscreen) { try { document.exitFullscreen().catch(() => {}); } catch (e) {} }
    }
    const btn = $('[data-action="writeFull"]');
    if (btn) btn.textContent = w.fs ? '⛶ 退出全屏' : '⛶ 全屏书写';
    const box = $('.modal-box');
    let tip = $('.write-fs-tip');
    if (!w.fs) { if (tip) tip.remove(); }
    else if (box && !tip) {
      tip = document.createElement('p');
      tip.className = 'write-fs-tip';
      tip.textContent = '横屏书写体验更佳 · 点上方按钮或按 Esc 退出全屏';
      box.appendChild(tip);
    }
    onWriteViewportChange();
  }
  function writeStep(delta) {
    const w = writeState;
    if (!w) return;
    w.idx = (w.idx + delta + w.items.length) % w.items.length;
    w.strokes = []; w.cur = null;
    const item = w.items[w.idx];
    $('#writeTarget').textContent = item.text;
    $('#writeIdx').textContent = (w.idx + 1) + ' / ' + w.items.length;
    $('.write-hint').innerHTML = '<span class="badge purple">' + item.kind + '</span> ' + esc(item.sub);
    const action = $('[data-action="writeDone"]');
    if (action && w.mode === 'reviewFix') action.textContent = w.idx < w.items.length - 1 ? '写好了，下一个 →' : '写好了，完成复习 →';
    redrawWrite();
  }
  // 手写默写不再做 OCR 自动判分：显示正确答案，由用户自己判断，结果只用于档案与复习队列
  function dictSubmit() {
    const w = writeState;
    if (!w || w.mode !== 'dictation') return;
    if (!w.strokes.length) { toast('先写出你的答案再核对哦'); return; }
    if (w.fs) setWriteFull(false);
    const item = w.items[w.idx];
    const nextTxt = w.idx < w.items.length - 1 ? '下一题' : '查看成绩';
    openModal(modalHead('📝 默写核对 · ' + item.kind) +
      '<div class="dict-compare"><div><span class="lbl">正确答案</span><div class="val right">' + esc(item.answer) + '</div></div>' +
      '<div><span class="lbl">中文提示</span><div class="val">' + esc(item.sub || '') + '</div></div></div>' +
      '<p class="muted center" style="font-size:12px;margin:12px 0">对照你刚才写的内容，自己判断写对没有；写错的会加入复习队列。</p>' +
      '<button class="btn primary big" data-action="dictGrade" data-ok="1">✅ 我写对了 · ' + nextTxt + ' →</button>' +
      '<button class="btn big" data-action="dictGrade" data-ok="0" style="margin-top:8px">❌ 写错了 · ' + nextTxt + ' →</button>' +
      '<button class="btn sm" data-action="dictAgain" style="margin-top:8px">↩️ 返回重写</button>');
  }
  function dictGrade(ok) {
    const w = writeState;
    if (!w || w.mode !== 'dictation') return;
    const item = w.items[w.idx];
    const result = { ok:!!ok, got:ok ? '自评：写对' : '自评：写错', self:true };
    w.results.push(Object.assign({ item:item, userStrokes:w.strokes.map(x => x) }, result));
    if (item.kind === '单词' && item.answer) {
      const prev = state.learnedWords[item.answer];
      state.learnedWords[item.answer] = { cnt:(prev ? prev.cnt : 0) + 1, t:dateKey() };
      saveState();
    }
    if (!ok && item.srsId != null && item.srsId >= 0) scheduleItem(item.srsKind, item.srsId, dateKey());
    voiceFeedback(!!ok);
    if (w.idx < w.items.length - 1) { w.idx++; w.strokes = []; w.cur = null; renderWritePad(); }
    else dictFinish();
  }
  function dictFinish() {
    const w = writeState;
    if (!w || w.mode !== 'dictation') return;
    const rs = w.results;
    const good = rs.filter(r => r.ok === true).length;
    const bad = rs.filter(r => r.ok === false).length;
    const pct = rs.length ? Math.round(good / rs.length * 100) : 0;
    const wrongList = rs.filter(r => r.ok === false).map(r => r.item.answer);
    writeState = null;
    openModal(modalHead('🎉 默写完成') +
      '<div class="reward-banner" style="font-size:18px">自评答对 ' + good + ' / ' + rs.length + ' 题 · ' + pct + ' 分</div>' +
      '<div class="center" style="font-size:52px;margin:10px 0">' + (pct >= 80 ? '🏆' : (pct >= 50 ? '🌟' : '💪')) + '</div>' +
      '<p class="center">' + (pct >= 80 ? '默写得很扎实，继续保持！' : '别灰心，写错的已进复习，多写几遍就记住了') + '</p>' +
      (wrongList.length ? '<p class="muted center" style="font-size:12px">需复习：' + esc(wrongList.join('、')) + '</p>' : '') +
      '<div class="center muted" style="font-size:12px;margin:8px 0">自由默写不计积分，多写一遍就多一分熟练</div>' +
      '<button class="btn primary big" data-action="close">完成，返回 →</button>');
    confetti();
  }

  function writeDone() {
    const w = writeState;
    if (!w) return;
    if (w.mode === 'reviewFix') {
      if (!w.strokes.length) { toast('先用手指或鼠标写一遍再继续哦'); return; }
      if (w.idx < w.items.length - 1) { writeStep(1); toast('✍️ 写得不错，继续下一个'); return; }
      const html = w.finishHtml;
      writeState = null;
      openModal(html);
      toast('✅ 错词已写完，复习完成');
      return;
    }
    toast('✍️ 已保存今天的自由书写练习（自由学习区不计积分）');
    closeModal();
  }
  function writeSave() {
    const c = $('#writeCanvas');
    const w = writeState;
    if (!c || !w) return;
    const tmp = document.createElement('canvas');
    tmp.width = c.width; tmp.height = c.height;
    const ctx = tmp.getContext('2d');
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, tmp.width, tmp.height);
    ctx.drawImage(c, 0, 0);
    const a = document.createElement('a');
    a.href = tmp.toDataURL('image/png');
    a.download = '手写练习-' + w.items[w.idx].text.replace(/[^\w\u4e00-\u9fa5]/g, '') + '-' + dateKey() + '.png';
    a.click();
    toast('💾 手写图片已保存');
  }
  /* ---------- 四级错题本 ---------- */
  function openWrongBook() {
    const keys = Object.keys(state.wrongBook || {});
    if (!keys.length) { openModal(modalHead('📕 四级错题本') + '<div class="card center" style="padding:28px">目前还没有错题。做四级听力、阅读或模考时答错的题会自动收集到这里。<br><br><button class="btn primary" data-action="close">知道了</button></div>'); return; }
    const html = keys.map(k => {
      const w = state.wrongBook[k];
      return '<div class="arch-item"><div class="arch-row"><div class="arch-main">' + esc((w.q || '').replace(/\n/g, ' ').slice(0, 90)) + '</div><button class="arch-play" data-action="wrongSpeak" data-id="' + esc(k) + '">🔊</button></div>' +
        '<div class="arch-sub">' + esc(w.type || '练习') + ' · ' + esc(w.t || '') + ' · 错 ' + (w.count || 1) + ' 次</div>' +
        '<div class="arch-foot"><button class="btn sm primary" data-action="wrongReview" data-id="' + esc(k) + '">▶ 重做</button> <button class="btn sm danger" data-action="wrongRemove" data-id="' + esc(k) + '">移除</button></div></div>';
    }).join('');
    openModal(modalHead('📕 四级错题本 · ' + keys.length + ' 题') + '<div class="arch-list">' + html + '</div><div style="margin-top:12px"><button class="btn" data-action="close">返回</button></div>');
  }
  function wrongReview(id) {
    const w = state.wrongBook[id];
    if (!w) return;
    ex = { type:'wrongBook', cfg:{}, step:0, correct:0, locked:false, questions:[{ id:w.id, q:w.q, audio:w.audio, opts:w.opts, ans:w.ans, why:w.why, type:w.type }] };
    renderQuiz('📕 错题重做', w.type + ' · 答对后自动移出错题本');
  }

  /* ---------- 四级写作 ---------- */
  let writingState = null;
  function openWriting(id, taskId) {
    const item = CET4_WRITING.find(x => x.id === id) || CET4_WRITING[0];
    writingState = { item, taskId: taskId || null };
    const prev = state.writings[item.id];
    openModal(modalHead('✍️ 四级写作 · ' + esc(item.title)) +
      '<div class="reward-banner">' + esc(item.prompt) + '</div>' +
      '<textarea id="writingText" rows="9" placeholder="在这里写你的作文（建议 120 词以上）" style="width:100%;padding:12px;border:2px solid var(--line);border-radius:12px;line-height:1.6">' + esc(prev ? prev.text : '') + '</textarea>' +
      '<p class="muted" style="font-size:12px">写完点提交，可对照范文、中文意思和常用词组。' + (writingState.taskId ? '本题按写作完成度发放积分。' : '自由练习不计积分。') + '</p>' +
      '<button class="btn primary big" data-action="writingSubmit">提交并看范文 →</button>');
  }
  function submitWriting() {
    if (!writingState) return;
    const item = writingState.item;
    const text = ($('#writingText') && $('#writingText').value || '').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    if (words < 20) { toast('再多写几句吧，至少 20 词才能对照范文'); return; }
    const lower = text.toLowerCase();
    const phrases = (item.phrases || []).filter(p => lower.indexOf(String(p).toLowerCase()) !== -1).length;
    const score = clamp(Math.round(words / 120 * 70 + phrases * 8), 0, 100);
    state.writings[item.id] = { text, words, score, t:dateKey() };
    saveState();
    const gained = writingState.taskId ? awardTaskScore(writingState.taskId, score, 100) : 0;
    const gainLine = writingState.taskId
      ? (gained > 0 ? '+' + gained + ' XP（按写作完成度 ' + score + ' 分发放）' : '本次按完成度 ' + score + ' 分计分，自由修改后再提交可补差额')
      : '自由练习不计积分。';
    openModal(modalHead('✅ 写作已保存 · ' + esc(item.title)) +
      '<div class="reward-banner">你写了 ' + words + ' 词 · ' + (words >= 120 ? '达到四级作文长度要求' : '建议写到 120 词以上') + ' · ' + gainLine + '</div>' +
      '<div class="arch-item"><div class="arch-main">参考范文</div><div class="arch-sub">' + esc(item.model) + '</div>' +
      '<div class="arch-cn">中文意思：' + esc(item.modelCn) + '</div>' +
      '<div class="arch-foot"><button class="btn sm" data-action="speak" data-text="' + esc(item.model) + '">🔊 听范文</button></div></div>' +
      '<div class="arch-item"><div class="arch-main">可套用词组</div>' + item.phrases.map(p => '<div class="arch-sub">· ' + esc(p) + '</div>').join('') + '</div>' +
      '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-action="writingAgain">再写一遍</button><button class="btn" data-action="close">返回</button></div>');
  }

  /* ---------- 四级翻译 ---------- */
  let transExState = null;
  function openTranslationExercise(id, taskId) {
    const item = CET4_TRANSLATION.find(x => x.id === id) || CET4_TRANSLATION[0];
    transExState = { item, taskId: taskId || null };
    const prev = state.translations[item.id];
    openModal(modalHead('🌏 四级翻译 · 汉译英') +
      '<div class="reward-banner">' + esc(item.cn) + '</div>' +
      '<textarea id="transExText" rows="7" placeholder="把上面的中文翻译成英文" style="width:100%;padding:12px;border:2px solid var(--line);border-radius:12px;line-height:1.6">' + esc(prev ? prev.text : '') + '</textarea>' +
      '<div class="arch-sub" style="margin-top:8px">词组提示：' + item.phrases.map(esc).join(' · ') + '</div>' +
      '<button class="btn primary big" data-action="transExSubmit">提交并看参考译文 →</button>');
  }
  function submitTranslationExercise() {
    if (!transExState) return;
    const item = transExState.item;
    const text = ($('#transExText') && $('#transExText').value || '').trim();
    if (!text) { toast('先写下你的英文翻译'); return; }
    const mine = new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean));
    const ref = item.model.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    const hit = ref.filter(w => mine.has(w)).length;
    const score = ref.length ? Math.round(hit / new Set(ref).size * 100) : 0;
    state.translations[item.id] = { text, score, t:dateKey() };
    saveState();
    const gained = transExState.taskId ? awardTaskScore(transExState.taskId, score, 100) : 0;
    const gainLine = transExState.taskId
      ? (gained > 0 ? '+' + gained + ' XP（按覆盖率 ' + score + ' 分发放）' : '本次按覆盖率 ' + score + ' 分计分，修改后再提交可补差额')
      : '自由练习不计积分。';
    openModal(modalHead('✅ 翻译已保存') +
      '<div class="reward-banner">参考词覆盖率约 ' + clamp(score, 0, 100) + '%（粗略参考，请对照译文自行判断） · ' + gainLine + '</div>' +
      '<div class="arch-item"><div class="arch-main">你的翻译</div><div class="arch-sub">' + esc(text) + '</div></div>' +
      '<div class="arch-item"><div class="arch-main">参考译文</div><div class="arch-sub">' + esc(item.model) + '</div>' +
      '<div class="arch-foot"><button class="btn sm" data-action="speak" data-text="' + esc(item.model) + '">🔊 听译文</button></div></div>' +
      '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-action="transExAgain">再译一遍</button><button class="btn" data-action="close">返回</button></div>');
  }

  /* ---------- 中英互译 ---------- */
  let transState = { dir:'en2zh', q:'' };
  function openTranslate() { transState = { dir:'en2zh', q:'' }; renderTranslate(); }
  function renderTranslate() {
    const d = transState.dir;
    const results = transState.q ? translateLookup(transState.q, d) : [];
    const body = results.length ? results.map(r =>
      '<div class="arch-item"><div class="arch-row"><div class="arch-main">' + esc(r.main) + '</div><button class="arch-play" data-action="transSpeak" data-text="' + esc(r.speak || r.main) + '">🔊</button></div>' +
      (r.ph ? '<div class="arch-ph">' + esc(r.ph) + '</div>' : '') +
      '<div class="arch-cn">' + esc(r.cn) + '</div>' +
      (r.note ? '<div class="arch-sub">' + esc(r.note) + '</div>' : '') +
      (r.word ? '<div class="arch-foot"><button class="btn sm" data-action="transLearn" data-word="' + esc(r.word) + '">＋ 加入已学词</button></div>' : '') + '</div>'
    ).join('') : '<div class="card center muted" style="padding:24px">输入英文或中文，即可查询词库与内置例句/范文/译文中的对应表达。</div>';
    openModal(modalHead('🔁 中英互译 · 离线词句库') +
      '<div class="arch-tabs"><button class="arch-tab' + (d === 'en2zh' ? ' active' : '') + '" data-action="transDir" data-dir="en2zh">英文 → 中文</button>' +
      '<button class="arch-tab' + (d === 'zh2en' ? ' active' : '') + '" data-action="transDir" data-dir="zh2en">中文 → 英文</button></div>' +
      '<div class="arch-search"><input id="transInput" type="search" placeholder="' + (d === 'en2zh' ? '输入英文单词或句子' : '输入中文词句') + '" value="' + esc(transState.q) + '"></div>' +
      '<div style="margin:8px 0"><button class="btn primary" data-action="transGo">🔍 翻译</button></div>' +
      '<div class="arch-meta">' + (transState.q ? '找到 ' + results.length + ' 条结果' : '支持 4642 词 + 四级范文/译文/阅读例句') + '</div>' +
      '<div class="arch-list">' + body + '</div>');
    const input = $('#transInput');
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') { transState.q = input.value; renderTranslate(); } });
  }
  function translateLookup(q, dir) {
    const s = String(q || '').trim().toLowerCase();
    if (!s) return [];
    const out = [];
    if (dir === 'en2zh') {
      ALL_WORDS.forEach(w => {
        if (w.w.toLowerCase() === s || (s.length > 3 && w.w.toLowerCase().indexOf(s) === 0)) {
          out.push({ main:w.w, ph:w.ph, cn:w.cn || '', note:w.ex ? '例：' + w.ex + ' ' + (w.cnEx || '') : '', speak:w.w, word:w.w });
        }
      });
      const sentencePools = [
        CET4_TRANSLATION.map(x => ({ en:x.model, cn:x.cn, note:'四级翻译参考' })),
        CET4_WRITING.map(x => ({ en:x.model, cn:x.modelCn, note:'四级写作范文' })),
        CET4_CAREFUL.map(x => ({ en:x.text, cn:'（仔细阅读短文）', note:x.title })),
        CET4_LISTENING.map(x => ({ en:x.audio, cn:x.why || '', note:'四级听力原文' }))
      ];
      sentencePools.forEach(pool => pool.forEach(x => { if (x.en.toLowerCase().indexOf(s) !== -1) out.push({ main:x.en.slice(0, 180), cn:x.cn, note:x.note, speak:x.en.slice(0, 180) }); }));
    } else {
      ALL_WORDS.forEach(w => { if (w.cn && w.cn.indexOf(q) !== -1) out.push({ main:w.w, ph:w.ph, cn:w.cn, note:'词库词条', speak:w.w, word:w.w }); });
      CET4_TRANSLATION.forEach(x => { if (x.cn.indexOf(q) !== -1 || x.model.toLowerCase().indexOf(s) !== -1) out.push({ main:x.model, cn:x.cn, note:'四级翻译参考', speak:x.model }); });
      CET4_WRITING.forEach(x => { if ((x.modelCn || '').indexOf(q) !== -1) out.push({ main:x.model, cn:x.modelCn, note:'四级写作范文', speak:x.model }); });
    }
    const seen = {}, uniq = [];
    out.forEach(x => { const k = x.main.slice(0, 80); if (!seen[k]) { seen[k] = 1; uniq.push(x); } });
    return uniq.slice(0, 40);
  }

  /* ---------- 四级完整模考 ---------- */
  let fm = null;
  function openFullMock(taskId) {
    fm = { paper:makeFullMock(Date.now()), sec:0, idx:0, answers:{}, scores:{}, start:Date.now(), translation:'', writing:'', taskId: taskId || null };
    renderFullMock();
  }
  function fmObjective() {
    if (fm.sec === 0) return fm.paper.listening;
    if (fm.sec === 1) return fm.paper.vocab;
    if (fm.sec === 2) return fm.paper.reading;
    return [];
  }
  function renderFullMock() {
    if (!fm) return;
    const names = ['听力理解', '词汇语法', '阅读理解', '翻译（汉译英）', '写作', '成绩报告'];
    const head = modalHead('📝 四级真题模考 · ' + names[fm.sec]) +
      '<div class="reward-banner">完整流程：听力 5 题 → 词汇语法 5 题 → 阅读 2 题 → 翻译 1 篇 → 写作 1 篇 · ' + (fm.taskId ? '每日任务按正确量计分' : '自由模考不计积分') + '</div>';
    if (fm.sec <= 2) {
      const qs = fmObjective();
      const q = qs[fm.idx];
      if (!q) { fm.sec++; fm.idx = 0; renderFullMock(); return; }
      openModal(head + '<p class="muted">第 ' + (fm.idx + 1) + '/' + qs.length + ' 题</p>' +
        (q.audio ? '<div class="listening-box"><button class="btn sm" data-action="fmSpeak" data-text="' + esc(q.audio) + '">🔊 播放</button></div>' : '') +
        '<div class="quiz-q">' + esc(q.q) + '</div>' +
        '<div class="opts">' + q.opts.map((o, i) => '<button class="opt' + (fm.answers[fm.sec + ':' + fm.idx] === i ? ' right' : '') + '" data-action="fmOpt" data-i="' + i + '">' + String.fromCharCode(65 + i) + '. ' + esc(o) + '</button>').join('') + '</div>' +
        '<div style="margin-top:12px"><button class="btn primary" data-action="fmNext">' + (fm.idx < qs.length - 1 ? '下一题 →' : '完成本部分 →') + '</button></div>');
      if (q.audio) setTimeout(() => speak(q.audio), 250);
      return;
    }
    if (fm.sec === 3) {
      const t = fm.paper.translation;
      openModal(head + '<div class="reward-banner">' + esc(t.cn) + '</div><div class="arch-sub">提示词组：' + t.phrases.map(esc).join(' · ') + '</div>' +
        '<textarea id="fmTrans" rows="7" style="width:100%;padding:12px;border:2px solid var(--line);border-radius:12px">' + esc(fm.translation) + '</textarea>' +
        '<button class="btn primary big" data-action="fmTransSubmit">提交翻译 →</button>');
      return;
    }
    if (fm.sec === 4) {
      const w = fm.paper.writing;
      openModal(head + '<div class="reward-banner">' + esc(w.prompt) + '</div>' +
        '<textarea id="fmWrite" rows="9" style="width:100%;padding:12px;border:2px solid var(--line);border-radius:12px">' + esc(fm.writing) + '</textarea>' +
        '<button class="btn primary big" data-action="fmWriteSubmit">交卷并查看成绩 →</button>');
      return;
    }
    const objTotal = fm.paper.listening.length + fm.paper.vocab.length + fm.paper.reading.length;
    let objRight = 0;
    [[0, fm.paper.listening], [1, fm.paper.vocab], [2, fm.paper.reading]].forEach(pair => {
      pair[1].forEach((q, i) => { if (fm.answers[pair[0] + ':' + i] === q.ans) objRight++; });
    });
    const objPct = Math.round(objRight / objTotal * 100);
    const tr = fm.paper.translation, wr = fm.paper.writing;
    const trScore = clamp(fm.scores.translation || 0, 0, 100);
    const wrScore = clamp(fm.scores.writing || 0, 0, 100);
    const gained = fm.taskId ? awardTaskScore(fm.taskId, objRight + trScore / 100 + wrScore / 100, objTotal + 2) : 0;
    const gainLine = fm.taskId
      ? (gained > 0 ? ' · +' + gained + ' XP（按正确量发放）' : ' · 本次未获得新积分，重做可补差额')
      : ' · 自由模考不计积分';
    state.mockScores.push({ date:dateKey(), score:objPct, detail:{ objective:objRight + '/' + objTotal, translation:trScore, writing:wrScore } });
    saveState();
    openModal(head + '<div class="reward-banner" style="font-size:20px">客观题 ' + objRight + '/' + objTotal + ' · ' + objPct + ' 分' + gainLine + '</div>' +
      '<div class="arch-item"><div class="arch-main">翻译参考分 ' + (fm.scores.translation || 0) + ' 分</div><div class="arch-sub">' + esc(tr.model) + '</div><div class="arch-cn">中文：' + esc(tr.cn) + '</div></div>' +
      '<div class="arch-item"><div class="arch-main">写作参考分 ' + (fm.scores.writing || 0) + ' 分</div><div class="arch-sub">' + esc(wr.model) + '</div><div class="arch-cn">中文：' + esc(wr.modelCn) + '</div>' +
      '<div class="arch-foot"><button class="btn sm" data-action="speak" data-text="' + esc(wr.model) + '">🔊 听范文</button></div></div>' +
      '<p class="muted" style="font-size:12px">翻译/写作参考分由词覆盖率与长度粗略计算，请对照范文自行判断。完整错题可在「四级错题本」复习。</p>' +
      '<div style="margin-top:12px"><button class="btn primary big" data-action="close">完成</button></div>');
    fm = null;
  }

  function onClick(e) {
    const nav = e.target.closest('[data-nav]');
    if (nav) { go(nav.dataset.nav); return; }
    const task = e.target.closest('[data-task]');
    if (task) {
      const t = dailyTasks().find(x => x.id === task.dataset.task);
      startExercise(task.dataset.mod, task.dataset.task, t ? t.cfg : null);
      return;
    }
    const mod = e.target.closest('[data-mod]');
    if (mod) {
      if (mod.dataset.mod === 'archive') goArchive();
      else if (mod.dataset.mod === 'write') openWritePad();
      else if (mod.dataset.mod === 'dictation') openDictation();
      else if (mod.dataset.mod === 'dictationAll') openDictation('all');
      else if (mod.dataset.mod === 'dialogue') openDialogue();
      else if (mod.dataset.mod === 'writing') openWriting();
      else if (mod.dataset.mod === 'translation') openTranslationExercise();
      else if (mod.dataset.mod === 'mockFull') openFullMock();
      else if (mod.dataset.mod === 'wrongBook') openWrongBook();
      else if (mod.dataset.mod === 'translate') openTranslate();
      else startExercise(mod.dataset.mod);
      return;
    }
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const a = el.dataset.action;
    if (a === 'close') {
      if (lessonState) { closeLesson(); return; }
      if (writeState && writeState.mode === 'reviewFix') { toast('先把错词写完，再结束复习哦'); return; }
      closeModal();
    }
    else if (a === 'speak') speak(el.dataset.text);
    else if (a === 'goArchive') goArchive();
    else if (a === 'archBack') go('learn');
    else if (a === 'archTab') { archiveState.cat = el.dataset.cat; archiveState.q = ''; renderArchive(); }
    else if (a === 'archScope') { archiveState.scope = archiveState.scope === 'all' ? 'learned' : 'all'; archiveState.q = ''; renderArchive(); }
    else if (a === 'archExport') openExportDialog();
    else if (a === 'expScope') { exportSelection.scope = el.dataset.scope; openExportDialog(); }
    else if (a === 'expAll') { EXPORT_CATS.forEach(c => exportSelection[c[0]] = true); openExportDialog(); }
    else if (a === 'expNone') { EXPORT_CATS.forEach(c => exportSelection[c[0]] = false); openExportDialog(); }
    else if (a === 'expDo') {
      $$('[data-exp-cat]').forEach(cb => { exportSelection[cb.dataset.expCat] = cb.checked; });
      exportArchiveExcel();
    }
    else if (a === 'wrongReview') wrongReview(el.dataset.id);
    else if (a === 'wrongSpeak') { const w = state.wrongBook[el.dataset.id]; if (w && w.audio) speak(w.audio); else toast('这道题没有朗读音频'); }
    else if (a === 'wrongRemove') { delete state.wrongBook[el.dataset.id]; saveState(); openWrongBook(); }
    else if (a === 'writingSubmit') submitWriting();
    else if (a === 'writingAgain') { if (writingState) openWriting(writingState.item.id); }
    else if (a === 'transExSubmit') submitTranslationExercise();
    else if (a === 'transExAgain') { if (transExState) openTranslationExercise(transExState.item.id); }
    else if (a === 'transDir') { transState.dir = el.dataset.dir; transState.q = ''; renderTranslate(); }
    else if (a === 'transGo') { const i = $('#transInput'); transState.q = i ? i.value : ''; renderTranslate(); }
    else if (a === 'transSpeak') speak(el.dataset.text);
    else if (a === 'transLearn') {
      const w = el.dataset.word;
      if (w) { state.learnedWords[w] = { cnt:1, t:dateKey() }; if (!state.srs['w:'+w]) scheduleItem('w', w, dateKey()); saveState(); toast('已加入已学词，可在学习档案查看'); }
    }
    else if (a === 'fmSpeak') speak(el.dataset.text);
    else if (a === 'fmOpt' && fm) { fm.answers[fm.sec + ':' + fm.idx] = Number(el.dataset.i); renderFullMock(); }
    else if (a === 'fmNext' && fm) { fm.idx++; renderFullMock(); }
    else if (a === 'fmTransSubmit' && fm) { fm.translation = ($('#fmTrans') && $('#fmTrans').value || '').trim(); if (!fm.translation) { toast('先写下你的翻译'); return; } const ref = fm.paper.translation.model.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean); const mine = new Set(fm.translation.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean)); fm.scores.translation = Math.round(ref.filter(x => mine.has(x)).length / Math.max(1, new Set(ref).size) * 100); fm.sec++; renderFullMock(); }
    else if (a === 'fmWriteSubmit' && fm) { fm.writing = ($('#fmWrite') && $('#fmWrite').value || '').trim(); const n = fm.writing ? fm.writing.split(/\s+/).length : 0; const phrases = fm.paper.writing.phrases.filter(p => fm.writing.toLowerCase().indexOf(p.toLowerCase()) !== -1).length; fm.scores.writing = clamp(Math.round(n / 120 * 70 + phrases * 8), 0, 100); fm.sec++; renderFullMock(); }
    else if (a === 'archSpeak') { const it = archiveFind(el.dataset.key); if (it) speak(it.audio || it.main, Math.max(.72, state.rate)); }
    else if (a === 'writeFull') { if (writeState) setWriteFull(!writeState.fs); }
    else if (a === 'dlgSpeak') dialogueSpeak();
    else if (a === 'dlgRec') dialogueStartRec();
    else if (a === 'dlgSubmitText') dialogueSubmitText();
    else if (a === 'dlgHint') dialogueToggleHint();
    else if (a === 'dlgSkip') { if (dialogueState) { dialogueState.results.push({ said: '（跳过）', score: 0, ok: false }); dialogueNext(); } }
    else if (a === 'dlgRetry') openDialogue(true);
    else if (a === 'microLesson') {
      const kind = el.dataset.kind;
      let item = null;
      if (ex && ex.cards) item = ex.cards[ex.step];
      else if (ex && ex.item) item = ex.item;
      else if (ex && ex.questions) item = ex.questions[ex.step];
      openLesson(kind, item);
    }
    else if (a === 'lessonClose' || a === 'lessonBack') closeLesson();
    else if (a === 'lessonPrev') lessonGo(-1);
    else if (a === 'lessonNext') lessonGo(1);
    else if (a === 'lessonToggle') {
      if (lessonState) { lessonState.playing = !lessonState.playing; renderLesson(false); if (!lessonState.playing && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }
    }
    else if (a === 'lessonCaption') { if (lessonState) { lessonState.captions = !lessonState.captions; renderLesson(false); } }
    else if (a === 'lessonReplay') { if (lessonState) { lessonState.step = 0; lessonState.sec = 0; renderLesson(true); } }
    else if (a === 'tryVoice') {
      const sel = $('#voiceSelect');
      state.voiceURI = sel ? sel.value : '';
      saveState();
      speak('Hello! This is my voice. Let us learn English together.', .9, { voiceURI: state.voiceURI });
      toast('🔊 已切换为「' + voiceDisplayName() + '」，正在试听');
    }
    else if (a === 'tryFeedback') {
      const fsel = $('#feedbackVoiceSelect'), tsel = $('#setFeedbackTone'), lsel = $('#setFeedbackLang');
      if (fsel) state.feedbackVoice = fsel.value;
      if (tsel) state.feedbackTone = tsel.value;
      if (lsel) state.feedbackLang = lsel.value;
      saveState();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      const line = voiceFeedback(true, true);
      toast('😄 ' + (line || '试听完成') + '（' + voiceDisplayName(state.feedbackVoice) + '）');
    }
    else if (a === 'refreshVoices') { refreshVoiceSelect(); toast('已刷新语音列表'); }
    else if (a === 'tryNatural') {
      const nv = $('#setNaturalVoice');
      if (nv) state.naturalVoice = nv.value === '1';
      saveState();
      const v = pickNaturalVoice('en-US');
      speak('Good morning. Today we will learn three useful words: benefit, schedule and confidence. Let us begin.', .95, { voiceURI:'', noNatural:false });
      toast('🔊 ' + (v ? '正在用「' + v.name + '」自然语音试听' : '正在用系统语音试听'));
    }
    else if (a === 'recordVoice') toggleRecord();
    else if (a === 'previewVoice') {
      if (!state.voiceProfile) { toast('请先录一段生成语音包'); return; }
      speak(VOICE_SAMPLE, .95, { voiceURI: 'style:mine' });
      toast('🔊 正在用「我的声音」朗读');
    }
    else if (a === 'playMySample') {
      if (state.voiceProfile && state.voiceProfile.sample) playClip(state.voiceProfile.sample);
      else toast('没有找到原声录音');
    }
    else if (a === 'delVoiceProfile') {
      state.voiceProfile = null;
      if (state.voiceURI === 'style:mine') state.voiceURI = '';
      if (state.feedbackVoice === 'style:mine') state.feedbackVoice = '';
      saveState(); renderMe(); toast('已删除你的语音包');
    }
    else if (a === 'flip') { const f = $('#flash'); if (f) { f.classList.toggle('hide-cn'); if (!f.classList.contains('hide-cn')) speak(f.querySelector('.ex') ? f.querySelector('.word').textContent : ''); } }
    else if (a === 'learned') learnedNext();
    else if (a === 'nextPhonetic') nextPhonetic();
    else if (a === 'opt') answer(Number(el.dataset.i));
    else if (a === 'grammarOpt') grammarAnswer(Number(el.dataset.i));
    else if (a === 'readingOpt') readingAnswer(Number(el.dataset.q), Number(el.dataset.i));
    else if (a === 'rec') startRec();
    else if (a === 'gameTile') gameTile(el.dataset.w, el.dataset.side);
    else if (a === 'finish') {
      if (ex && ex.type === 'grammar' && ex.grammarIdx != null) scheduleItem('g', ex.grammarIdx, dateKey());
      // 没有语音识别权限时，点“我读好了”按完成 1 题计分；用了朗读评分则保留识别结果
      if (ex && ex.type === 'speaking' && !ex.correct) ex.correct = 1;
      finishExercise();
    }
    else if (a === 'toggleTrans') { const t = $('#trans'); if (t) t.style.display = t.style.display === 'none' ? 'block' : 'none'; }
    else if (a === 'viewDay') showDayPlan();
    else if (a === 'writeColor') { if (writeState) { writeState.color = el.dataset.color; $$('.color-dot').forEach(d => d.classList.toggle('on', d.dataset.color === writeState.color)); } }
    else if (a === 'writeSize') { if (writeState) { writeState.size = Number(el.dataset.size); $$('.size-btn').forEach(d => d.classList.toggle('on', Number(d.dataset.size) === writeState.size)); } }
    else if (a === 'writePrev') writeStep(-1);
    else if (a === 'writeNext') writeStep(1);
    else if (a === 'writeGuide') { if (writeState) { writeState.guide = !writeState.guide; el.textContent = writeState.guide ? '👻 隐藏描红' : '👻 显示描红'; redrawWrite(); } }
    else if (a === 'writeUndo') { if (writeState) { writeState.strokes.pop(); redrawWrite(); } }
    else if (a === 'writeClear') { if (writeState) { writeState.strokes = []; writeState.cur = null; redrawWrite(); } }
    else if (a === 'writeSave') writeSave();
    else if (a === 'writeDone') writeDone();
    else if (a === 'dictSpeak') { if (writeState) { const it = writeState.items[writeState.idx]; speak(it.audio || it.text, Math.max(.72, state.rate)); } }
    else if (a === 'dictSubmit') dictSubmit();
    else if (a === 'dictGrade') dictGrade(el.dataset.ok === '1');
    else if (a === 'dictAgain') { if (writeState) renderWritePad(); }
    else if (a === 'saveSettings') saveSettings();
    else if (a === 'export') exportData();
    else if (a === 'import') $('#importFile').click();
    else if (a === 'reset') resetData();
    else if (a === 'confirmReset') confirmReset();
  }
  function saveSettings() {
    const s = $('#setStart').value;
    if (s) state.startDate = s;
    const td = $('#setTargetDays');
    if (td) state.targetDays = Number(td.value);
    state.level = 'zero'; // 起点固定，不受任何旧控件影响
    const tg = $('#setTarget'); if (tg) state.target = tg.value;
    const nv = $('#setNaturalVoice'); if (nv) state.naturalVoice = nv.value === '1';
    state.minutes = Number($('#setMinutes').value);
    state.rate = Number($('#setRate').value);
    const vs = $('#voiceSelect');
    if (vs) state.voiceURI = vs.value;
    const fx = $('#setVoiceFx');
    if (fx) state.voiceFx = fx.value === '1';
    const fvs = $('#feedbackVoiceSelect');
    if (fvs) state.feedbackVoice = fvs.value;
    const ft = $('#setFeedbackTone');
    if (ft) state.feedbackTone = ft.value;
    const fl = $('#setFeedbackLang');
    if (fl) state.feedbackLang = fl.value;
    ['word', 'phonetic', 'grammar', 'mock'].forEach(k => {
      const el = $('#video_' + k);
      if (el) state.videos[k] = el.value.trim();
    });
    saveState(); render(); toast('✅ 设置已保存');
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '英语启航-进度备份-' + dateKey() + '.json';
    a.click(); URL.revokeObjectURL(a.href);
    toast('📦 进度已导出');
  }
  function resetData() {
    openModal(modalHead('⚠️ 重置进度') +
      '<p>这会清空所有学习记录、单词、经验值和成就，且无法恢复。确定要继续吗？</p>' +
      '<div style="display:flex;gap:10px;margin-top:16px"><button class="btn" data-action="close">取消</button>' +
      '<button class="btn danger" style="background:#E17055;color:#fff;border:none" data-action="confirmReset">确定重置</button></div>');
  }
  function confirmReset() {
    state = defaults(); saveState(); closeModal();
    $('#onboarding').classList.remove('hidden');
    $('#startDateInput').value = dateKey();
    toast('已重置，重新开始旅程吧');
  }
  function startJourney() {
    const d = $('#startDateInput').value;
    if (!d) { toast('请选择开始日期'); return; }
    state.startDate = d;
    state.minutes = Number($('#minutesInput').value);
    saveState();
    $('#onboarding').classList.add('hidden');
    render(); go('home');
    toast('🚀 旅程开始！第一天，加油！'); confetti();
  }
  function init() {
    refreshDay();
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && writeState && writeState.fs) {
        writeState.fs = false;
        document.body.classList.remove('write-fs');
        const btn = $('[data-action="writeFull"]');
        if (btn) btn.textContent = '⛶ 全屏书写';
        const tip = $('.write-fs-tip');
        if (tip) tip.remove();
        onWriteViewportChange();
      } else if (document.fullscreenElement && writeState) {
        onWriteViewportChange();
      }
    });
    // 横竖屏切换/窗口变化：桌面端 resize，手机端 orientationchange + visualViewport
    window.addEventListener('resize', onWriteViewportChange);
    window.addEventListener('orientationchange', onWriteViewportChange);
    if (window.visualViewport && window.visualViewport.addEventListener) {
      window.visualViewport.addEventListener('resize', onWriteViewportChange);
    }
    document.addEventListener('click', onClick);
    document.addEventListener('change', e => {
      const id = e.target && e.target.id;
      if (id === 'voiceSelect') {
        state.voiceURI = e.target.value;
        saveState();
        speak('Hello, this is my voice.', .9, { voiceURI: state.voiceURI });
        toast('🔊 已切换为「' + voiceDisplayName() + '」');
      } else if (id === 'feedbackVoiceSelect') {
        state.feedbackVoice = e.target.value;
        saveState();
        voiceFeedback(true, true);
        toast('💬 提示音已切换为「' + voiceDisplayName(state.feedbackVoice) + '」');
      } else if (id === 'setFeedbackTone') {
        state.feedbackTone = e.target.value;
        saveState();
        voiceFeedback(true, true);
        toast('😄 提示音风格已切换为「' + toneName() + '」');
      } else if (id === 'setFeedbackLang') {
        state.feedbackLang = e.target.value;
        saveState();
        voiceFeedback(true, true);
        toast('🌐 提示音已切换为「' + ({ zh: '中文', en: 'English', mix: '中英混合' }[state.feedbackLang]) + '」');
      }
    });
    $('#modal').addEventListener('click', e => {
      if (e.target.id !== 'modal') return;
      if (lessonState) { closeLesson(); return; }
      if (writeState && writeState.mode === 'reviewFix') { toast('先把错词写完，再结束复习哦'); return; }
      closeModal();
    });
    const imp = $('#importFile');
    if (imp) imp.addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const obj = JSON.parse(r.result);
          if (!obj.startDate) throw new Error('bad');
          state = migrateState(Object.assign(defaults(), obj)); saveState(); render(); toast('✅ 进度导入成功');
        } catch (err) { toast('❌ 文件格式不正确'); }
      };
      r.readAsText(f);
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || $('#modal').classList.contains('hidden')) return;
      if (lessonState) { closeLesson(); return; }
      if (writeState && writeState.mode === 'reviewFix') { toast('先把错词写完，再结束复习哦'); return; }
      closeModal();
    });
    render();
    if (!state.startDate) {
      $('#onboarding').classList.remove('hidden');
      $('#startDateInput').value = dateKey();
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.getVoices(); } catch (e) { /* 忽略 */ }
      window.speechSynthesis.onvoiceschanged = refreshVoiceSelect;
    }
    if ('serviceWorker' in navigator) {
      const hadController = !!navigator.serviceWorker.controller;
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
          const check = () => { try { reg.update(); } catch (e) {} };
          setInterval(check, 60 * 60 * 1000);
          document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
        }).catch(() => {});
        let refreshing = false;
        const doReload = () => { if (!refreshing) { refreshing = true; try { location.reload(); } catch (e) {} } };
        if (hadController) navigator.serviceWorker.addEventListener('controllerchange', doReload);
        navigator.serviceWorker.addEventListener('message', e => {
          if (e && e.data && e.data.type === 'NEW_VERSION') doReload();
        });
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  return { go, startJourney, confirmReset };
})();
