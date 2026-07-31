# 📊 Task Dashboard

```dataviewjs
const folder = '"2026"';
const today = new Date();
today.setHours(0, 0, 0, 0);

// ---------- HELPERS ----------
function getISOWeek(d) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  dt.setUTCDate(dt.getUTCDate() + 4 - (dt.getUTCDay() || 7));
  const y = dt.getUTCFullYear();
  const s = new Date(Date.UTC(y, 0, 1));
  return Math.ceil((((dt - s) / 86400000) + 1) / 7);
}

function fmt(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

function short(d) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function bar(pct, w = 20) {
  const filled = Math.round((pct / 100) * w);
  const empty = w - filled;
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${pct.toFixed(0)}%`;
}

// ---------- GATHER DATA ----------
const pages = dv.pages(folder);
let data = [];
const dayMap = {};
const weekMap = {};
const monthMap = {};

for (let page of pages) {
  if (!page.file.tasks || page.file.tasks.length === 0) continue;
  const fn = page.file.name;
  const y = parseInt(fn.slice(0, 4));
  const m = parseInt(fn.slice(4, 6));
  const d = parseInt(fn.slice(6, 8));
  const dt = new Date(y, m - 1, d);
  const wk = getISOWeek(dt);
  const mk = `${y}-${String(m).padStart(2, '0')}`;

  for (let t of page.file.tasks) {
    const task = {
      text: t.text,
      completed: t.completed,
      date: dt,
      year: y, month: m, day: d, week: wk, monthKey: mk,
      file: fn
    };
    data.push(task);

    // daily
    const dk = fmt(dt);
    if (!dayMap[dk]) dayMap[dk] = { date: dt, total: 0, done: 0, label: short(dt) };
    dayMap[dk].total++;
    if (t.completed) dayMap[dk].done++;

    // weekly
    const wkey = `${y}-W${String(wk).padStart(2, '0')}`;
    if (!weekMap[wkey]) weekMap[wkey] = { week: wk, year: y, total: 0, done: 0, label: `W${wk}` };
    weekMap[wkey].total++;
    if (t.completed) weekMap[wkey].done++;

    // monthly
    if (!monthMap[mk]) monthMap[mk] = { month: m, year: y, total: 0, done: 0, label: `${y}-${String(m).padStart(2, '0')}` };
    monthMap[mk].total++;
    if (t.completed) monthMap[mk].done++;
  }
}

data.sort((a, b) => a.date - b.date);

const totalAll = data.length;
const doneAll = data.filter(t => t.completed).length;
const pendingAll = totalAll - doneAll;
const pctAll = totalAll ? (doneAll / totalAll) * 100 : 0;

const todayKey = fmt(today);
const todayTasks = data.filter(t => fmt(t.date) === todayKey);
const todayDone = todayTasks.filter(t => t.completed).length;
const todayTotal = todayTasks.length;

// ---------- RENDER ----------
dv.paragraph(`> **${totalAll}** total tasks · **${doneAll}** done · **${pendingAll}** pending · ${bar(pctAll, 25)}`);

// --- TODAY ---
if (todayTotal > 0) {
  dv.header(3, `📅 Today — ${short(today)}`);
  dv.paragraph(`**${todayDone}/${todayTotal}** tasks completed · ${bar((todayDone / todayTotal) * 100, 20)}`);
  if (todayTasks.length > 0) {
    const tbl = todayTasks.map(t => [t.text, t.completed ? '✅ Done' : '⬜ Pending', t.file]);
    dv.table(['Task', 'Status', 'Source'], tbl);
  }
  dv.paragraph('---');
}

// --- DAILY ---
dv.header(3, '📆 Daily Completion');
const dayEntries = Object.values(dayMap).sort((a, b) => a.date - b.date);
const dayRows = dayEntries.map(d => [
  d.label,
  `${d.done}/${d.total}`,
  bar((d.done / d.total) * 100, 15),
  d.done === d.total ? '✅' : d.done === 0 ? '⬜' : '🔄'
]);
dv.table(['Day', 'Done', 'Progress', ''], dayRows);

dv.paragraph('---');

// --- WEEKLY ---
dv.header(3, '📈 Weekly Summary');
const weekEntries = Object.values(weekMap).sort((a, b) => a.year - b.year || a.week - b.week);
const weekRows = weekEntries.map(w => [
  `${w.year} ${w.label}`,
  `${w.done}/${w.total}`,
  bar((w.done / w.total) * 100, 20)
]);
dv.table(['Week', 'Done', 'Progress'], weekRows);

dv.paragraph('---');

// --- MONTHLY ---
dv.header(3, '📊 Monthly Summary');
const monthEntries = Object.values(monthMap).sort((a, b) => a.year - b.year || a.month - b.month);
const monthRows = monthEntries.map(m => [
  m.label,
  `${m.done}/${m.total}`,
  `${((m.done / m.total) * 100).toFixed(0)}%`,
  bar((m.done / m.total) * 100, 25)
]);
dv.table(['Month', 'Done', '%', 'Progress'], monthRows);

dv.paragraph('---');

// --- ALL TASKS ---
dv.header(3, '📋 All Tasks');
const allRows = data.map(t => [
  t.completed ? '✅' : '⬜',
  short(t.date),
  t.text,
  t.file
]).reverse();
dv.table(['', 'Date', 'Task', 'Source'], allRows);
```

