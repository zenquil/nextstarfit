// Vercel Serverless Function - ora de referință pentru bannerul „REDUCERE LA ABONAMENTE”
// Răspuns: { now, deadline, remaining, cycleMs }
// Toți vizitatorii primesc același „deadline”, calculat din ceasul serverului,
// deci numărătoarea e identică pe orice dispozitiv și nu poate fi păcălită din ceasul local.

const CYCLE_MS = (1 * 24 + 12) * 60 * 60 * 1000;        // 36 h = valoarea inițială a ciclului
const EPOCH_MS = 1794086331817       // ancoră fixă (1 ian. 2025, 00:00 UTC)

module.exports = function handler(req, res) {
  const now = Date.now();

  // ciclul curent: ultimul multiplu de 36 h după ancoră
  const cycles = Math.floor((now - EPOCH_MS) / CYCLE_MS);
  const deadline = EPOCH_MS + (cycles + 1) * CYCLE_MS;

  // niciodată cache-uit: fiecare request trebuie să vadă ora reală
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  res.status(200).send(JSON.stringify({
    now: now,
    deadline: deadline,
    remaining: deadline - now,
    cycleMs: CYCLE_MS,
    serverTimeUTC: new Date(now).toISOString()
  }));
};
