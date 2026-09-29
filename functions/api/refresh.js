// Cloudflare Pages Function: /api/refresh
// 手动触发刷新

const TOPHUB_BASE = 'https://tophub.today';

const PLATFORMS = {
  weibo: { name: '\u5fae\u535a', nodeId: 'KqndgxeLl9', color: '#E6162D' },
  douyin: { name: '\u6296\u97f3', nodeId: 'DpQvNABoNE', color: '#000000' },
  zhihu: { name: '\u77e5\u4e4e', nodeId: 'mproPpoq6O', color: '#0066FF' },
  baidu: { name: '\u767e\u5ea6', nodeId: 'Jb0vmloB1G', color: '#2932E1' },
  bilibili: { name: 'B\u7ad9', nodeId: '74KvxwokxM', color: '#FB7299' }
};

const DEFAULT_KEYWORDS = {
  '\u6559\u80b2': ['\u6559\u80b2','\u5b66\u6821','\u8001\u5e08','\u5b66\u751f','\u5b66\u4e60','\u9ad8\u8003','\u4e2d\u8003','\u8003\u7814','\u5927\u5b66','\u4e13\u4e1a','\u8bfe\u7a0b','\u6210\u7ee9','\u8865\u8bfe','\u6559\u57f9','\u53cc\u51cf','\u4f5c\u4e1a','\u8003\u8bd5','\u7559\u5b66','\u7533\u8bf7','\u540d\u6821','\u5f55\u53d6','\u5fd7\u613f','\u62a5\u8003','\u5b66\u9738','\u5b66\u533a\u623f','\u8bfe\u5916\u73ed'],
  '\u8ba4\u77e5': ['\u8ba4\u77e5','\u601d\u7ef4','\u601d\u8003','\u5e95\u5c42\u903b\u8f91','\u6210\u957f','\u63d0\u5347','\u5b66\u4e60\u65b9\u6cd5','\u6548\u7387','\u601d\u7ef4\u65b9\u5f0f','\u8ba4\u77e5\u5347\u7ea7','\u89c9\u9192','\u5f00\u7a8d','\u683c\u5c40','\u773c\u754c','\u5708\u5c42','\u4fe1\u606f\u5dee','\u8ba4\u77e5\u5dee'],
  '\u5bb6\u5ead': ['\u5bb6\u5ead','\u5bb6\u957f','\u7236\u6bcd','\u4eb2\u5b50','\u80b2\u513f','\u5b69\u5b50','\u5988\u5988','\u7238\u7238','\u5a5a\u59fb','\u592b\u59bb','\u5bb6\u5ead\u5173\u7cfb','\u5bb6\u5ead\u6559\u80b2','\u9752\u6625\u671f','\u5a86\u5ab3','\u5e26\u5a03','\u9e21\u5a03','\u966a\u8bfb','\u5168\u804c\u5988\u5988','\u5b9d\u5988'],
  '\u5347\u5b66': ['\u5347\u5b66','\u5fd7\u613f','\u62a5\u8003','\u5f55\u53d6','\u9ad8\u8003\u5fd7\u613f','\u4e13\u4e1a\u9009\u62e9','\u7559\u5b66','\u51fa\u56fd','\u540d\u6821','985','211','\u8003\u7814','\u8003\u516c','\u5c31\u4e1a','offer','\u4fdd\u7814','\u6625\u62db','\u79cb\u62db','\u9009\u8c03'],
  '\u827a\u672f': ['\u827a\u672f','\u7f8e\u672f','\u97f3\u4e50','\u8bbe\u8ba1','\u6587\u5316','\u4f20\u7edf','\u975e\u9057','\u535a\u7269\u9986','\u5c55\u89c8','\u827a\u672f\u5bb6','\u753b\u4f5c','\u4e66\u6cd5','\u56fd\u753b','\u6cb9\u753b','\u96d5\u5851','\u6444\u5f71','\u7535\u5f71','\u620f\u5267','\u827a\u672f\u5c55','\u827a\u672f\u7559\u5b66'],
  '\u7f8e\u5b66': ['\u7f8e\u5b66','\u5ba1\u7f8e','\u7f8e','\u6587\u827a','\u4eba\u6587','\u6587\u5b66','\u54f2\u5b66','\u4eba\u751f','\u751f\u6d3b\u65b9\u5f0f','\u54c1\u5473','\u6c14\u8d28','\u4f18\u96c5','\u827a\u672f\u611f','\u5ba1\u7f8e\u63d0\u5347','\u751f\u6d3b\u7f8e\u5b66']
};

const EXCLUDE_KEYWORDS = [
  '\u641e\u7b11','\u6bb5\u5b50','\u6574\u6d3b','\u8868\u60c5\u5305','\u6897','\u7206\u7b11','\u7802\u96d5','\u9b3c\u7580','\u6076\u641e',
  '\u6e38\u620f','\u738b\u8005\u8363\u8000','\u82f1\u96c4\u8054\u76df','\u539f\u795e','\u5403\u9e21','\u4e3b\u64ad','\u7f51\u7ea2',
  '\u660e\u661f','\u516b\u5366','\u7eef\u95fb','\u5403\u74dc','\u604b\u60c5',
  '\u7f8e\u98df','\u5403\u64ad','\u63a2\u5e97','\u65c5\u6e38','\u7a7f\u642d','\u7f8e\u5986',
  'cos','cosplay','\u6f2b\u5c55','\u4e8c\u6b21\u5143',
  '\u5ba0\u7269','\u840c\u5ba0',
  '\u4f53\u80b2','\u8db3\u7403','\u7bee\u7403','\u4e16\u754c\u676f','\u5965\u8fd0\u4f1a'
];

const KV_KEY_ITEMS = 'hotsearch:items';
const KV_KEY_HISTORY = 'hotsearch:history';
const HISTORY_DAYS = 7;

async function fetchPlatform(platformKey) {
  const platform = PLATFORMS[platformKey];
  if (!platform) return [];
  try {
    const resp = await fetch(TOPHUB_BASE + '/n/' + platform.nodeId, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' },
      cf: { cacheTtl: 60 }
    });
    if (!resp.ok) return [];
    const html = await resp.text();
    return parseHotList(html, platform.name, platform.color, platformKey);
  } catch(e) { return []; }
}

function parseHotList(html, platformName, color, platformKey) {
  const items = [];
  const m = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/);
  if (!m) return items;
  const re = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let match;
  while ((match = re.exec(m[1])) !== null) {
    const tr = match[1];
    const rm = tr.match(/<td[^>]*>\s*(\d+)\.\s*<\/td>/);
    if (!rm) continue;
    const rank = rm[1];
    const lr = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let title = '', url = '', lm;
    while ((lm = lr.exec(tr)) !== null) {
      const t = lm[2].replace(/<[^>]*>/g, '').trim();
      if (t.length > 5 && !lm[1].includes('#') && !lm[2].includes('m-n')) {
        title = t; url = lm[1]; break;
      }
    }
    if (!title || title.length < 3) continue;
    let hot = '';
    const wm = tr.match(/class="ws"[^>]*>\s*([^<]+?)\s*<\//);
    if (wm) hot = wm[1].trim();
    else {
      const em = tr.match(/class="item-extra"[^>]*>\s*([^<]+?)\s*<\//);
      if (em) hot = em[1].trim();
    }
    items.push({ rank, title, url, hot, platform: platformName, platformKey, color });
    if (items.length >= 60) break;
  }
  return items;
}

function analyzeTopic(title) {
  const domains = [], matched = [];
  const excluded = EXCLUDE_KEYWORDS.some(kw => title.includes(kw));
  if (excluded) return { domains, matchedKeywords: matched, relevance: 0, excluded: true };
  for (const [domain, keywords] of Object.entries(DEFAULT_KEYWORDS)) {
    for (const kw of keywords) {
      if (title.includes(kw)) {
        if (!domains.includes(domain)) domains.push(domain);
        matched.push(kw);
      }
    }
  }
  return { domains, matchedKeywords: matched, relevance: matched.length, excluded: false };
}

async function fetchAndStore(env) {
  const now = Date.now();
  const allNew = [];
  for (const key of Object.keys(PLATFORMS)) {
    allNew.push(...await fetchPlatform(key));
    await new Promise(r => setTimeout(r, 200));
  }
  let oldItems = [];
  try {
    const d = await env.HOTSEARCH_KV.get(KV_KEY_ITEMS, 'json');
    if (d && Array.isArray(d)) oldItems = d;
  } catch(e) {}
  const map = new Map();
  oldItems.forEach(i => map.set(i.platform + '_' + i.title, i));
  let newCount = 0;
  for (const item of allNew) {
    const a = analyzeTopic(item.title);
    if (a.excluded) continue;
    const id = item.platform + '_' + item.title;
    if (!map.has(id)) {
      map.set(id, { ...item, domains: a.domains, matchedKeywords: a.matchedKeywords, relevance: a.relevance, firstSeen: now, lastSeen: now });
      newCount++;
    } else {
      const o = map.get(id);
      o.rank = item.rank; o.hot = item.hot; o.lastSeen = now;
    }
  }
  const cutoff = now - HISTORY_DAYS * 86400000;
  const fresh = [...map.values()]
    .filter(i => (i.lastSeen || 0) > cutoff)
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
  await env.HOTSEARCH_KV.put(KV_KEY_ITEMS, JSON.stringify(fresh), {
    expirationTtl: HISTORY_DAYS * 86400
  });
  let history = [];
  try {
    const h = await env.HOTSEARCH_KV.get(KV_KEY_HISTORY, 'json');
    if (h && Array.isArray(h)) history = h;
  } catch(e) {}
  history.unshift({
    timestamp: now,
    dateStr: new Date(now).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    count: fresh.length,
    relevantCount: fresh.filter(i => i.relevance > 0).length
  });
  if (history.length > 50) history.length = 50;
  await env.HOTSEARCH_KV.put(KV_KEY_HISTORY, JSON.stringify(history));
  return {
    total: fresh.length, newCount,
    relevant: fresh.filter(i => i.relevance > 0).length,
    timestamp: now,
    dateStr: new Date(now).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  };
}

export async function onRequestGet(context) {
  try {
    const result = await fetchAndStore(context.env);
    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    });
  } catch(e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
