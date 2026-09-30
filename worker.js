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
  '\u8ba4\u77e5': ['\u8ba4\u77e5','\u601d\u7ef4','\u601d\u8003','\u5e95\u5c42\u903b\u8f91','\u6210\u957f','\u63d0\u5347','\u5b66\u4e60\u65b9\u6cd5','\u6548\u7387','\u601d\u7ef4\u65b9\u5f0f','\u8ba4\u77e5\u5347\u7ea7','\u89c9\u9192','\u5f00\u609f','\u683c\u5c40','\u773c\u754c','\u5708\u5c42','\u4fe1\u606f\u5dee','\u8ba4\u77e5\u5dee'],
  '\u5bb6\u5ead': ['\u5bb6\u5ead','\u5bb6\u957f','\u7236\u6bcd','\u4eb2\u5b50','\u80b2\u513f','\u5b69\u5b50','\u5988\u5988','\u7238\u7238','\u5a5a\u59fb','\u592b\u59bb','\u5bb6\u5ead\u5173\u7cfb','\u5bb6\u5ead\u6559\u80b2','\u9752\u6625\u671f','\u5a86\u5ab3','\u5e26\u5a03','\u9e21\u5a03','\u966a\u8bfb','\u5168\u804c\u5988\u5988','\u5b9d\u5988'],
  '\u5347\u5b66': ['\u5347\u5b66','\u5fd7\u613f','\u62a5\u8003','\u5f55\u53d6','\u9ad8\u8003\u5fd7\u613f','\u4e13\u4e1a\u9009\u62e9','\u7559\u5b66','\u51fa\u56fd','\u540d\u6821','985','211','\u8003\u7814','\u8003\u516c','\u5c31\u4e1a','offer','\u4fdd\u7814','\u6625\u62db','\u79cb\u62db','\u9009\u8c03'],
  '\u827a\u672f': ['\u827a\u672f','\u7f8e\u672f','\u97f3\u4e50','\u8bbe\u8ba1','\u6587\u5316','\u4f20\u7edf','\u975e\u9057','\u535a\u7269\u9986','\u5c55\u89c8','\u827a\u672f\u5bb6','\u753b\u4f5c','\u4e66\u6cd5','\u56fd\u753b','\u6cb9\u753b','\u96d5\u5851','\u6444\u5f71','\u7535\u5f71','\u620f\u5267','\u827a\u672f\u5c55','\u827a\u672f\u7559\u5b66'],
  '\u7f8e\u5b66': ['\u7f8e\u5b66','\u5ba1\u7f8e','\u7f8e','\u6587\u827a','\u4eba\u6587','\u6587\u5b66','\u54f2\u5b66','\u4eba\u751f','\u751f\u6d3b\u65b9\u5f0f','\u54c1\u5473','\u6c14\u8d28','\u4f18\u96c5','\u827a\u672f\u611f','\u5ba1\u7f8e\u63d0\u5347','\u751f\u6d3b\u7f8e\u5b66']
};

const DEFAULT_EXCLUDE = [
  '\u641e\u7b11','\u6bb5\u5b50','\u6574\u6d3b','\u8868\u60c5\u5305','\u6897','\u7206\u7b11','\u6c99\u96d5','\u9b3c\u7580','\u6076\u641e',
  '\u6e38\u620f','\u738b\u8005\u8363\u8000','\u82f1\u96c4\u8054\u76df','\u539f\u795e','\u5403\u9e21','\u4e3b\u64ad','\u7f51\u7ea2',
  '\u660e\u661f','\u516b\u5366','\u7eef\u95fb','\u5403\u74dc','\u604b\u60c5',
  '\u7f8e\u98df','\u5403\u64ad','\u63a2\u5e97','\u65c5\u6e38','\u7a7f\u642d','\u7f8e\u5986',
  'cos','cosplay','\u6f2b\u5c55','\u4e8c\u6b21\u5143',
  '\u5ba0\u7269','\u840c\u5ba0',
  '\u4f53\u80b2','\u8db3\u7403','\u7bee\u7403','\u4e16\u754c\u676f','\u5965\u8fd0\u4f1a'
];

const KV_KEY_ITEMS = 'hotsearch:items';
const KV_KEY_HISTORY = 'hotsearch:history';
const KV_KEY_KEYWORDS = 'hotsearch:keywords';
const HISTORY_DAYS = 7;

async function getKeywords(env) {
  try {
    const raw = await env.HOTSEARCH_KV.get(KV_KEY_KEYWORDS, 'json');
    if (raw && raw.keywords) return raw;
  } catch(e) {}
  return { keywords: JSON.parse(JSON.stringify(DEFAULT_KEYWORDS)), exclude: [...DEFAULT_EXCLUDE] };
}

async function saveKeywords(env, data) {
  try { await env.HOTSEARCH_KV.put(KV_KEY_KEYWORDS, JSON.stringify(data)); return true; }
  catch(e) { return false; }
}

async function fetchPlatform(platformKey) {
  const platform = PLATFORMS[platformKey];
  if (!platform) return [];
  try {
    const resp = await fetch(TOPHUB_BASE + '/n/' + platform.nodeId, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Accept': 'text/html' }
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
  const tbody = m[1];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let match;
  while ((match = trRegex.exec(tbody)) !== null) {
    const tr = match[1];
    const rankMatch = tr.match(/<td[^>]*>\s*(\d+)\.\s*<\/td>/);
    if (!rankMatch) continue;
    const rank = parseInt(rankMatch[1]);
    const linkRegex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let title = '', url = '', lm;
    while ((lm = linkRegex.exec(tr)) !== null) {
      const t = lm[2].replace(/<[^>]*>/g, '').trim();
      if (t.length > 4 && !lm[1].includes('#') && !lm[2].includes('m-n')) { title = t; url = lm[1]; break; }
    }
    if (!title || title.length < 3) continue;
    let hot = '';
    const wsMatch = tr.match(/class="ws"[^>]*>\s*([^<]+?)\s*<\//);
    if (wsMatch) hot = wsMatch[1].trim();
    else { const em = tr.match(/class="item-extra"[^>]*>\s*([^<]+?)\s*<\//); if (em) hot = em[1].trim(); }
    items.push({ rank, title, url, hot, platform: platformName, platformKey, color });
    if (items.length >= 50) break;
  }
  return items;
}

function analyzeTopic(title, keywords, exclude) {
  const domains = [], matched = [];
  const excluded = exclude.some(kw => title.includes(kw));
  if (excluded) return { domains, matchedKeywords: matched, relevance: 0, excluded: true };
  for (const [domain, kws] of Object.entries(keywords)) {
    for (const kw of kws) {
      if (title.includes(kw)) { if (!domains.includes(domain)) domains.push(domain); matched.push(kw); }
    }
  }
  return { domains, matchedKeywords: matched, relevance: matched.length, excluded: false };
}

async function fetchAndStore(env) {
  const now = Date.now();
  const kwData = await getKeywords(env);
  const allNewItems = [];
  for (const key of Object.keys(PLATFORMS)) {
    const items = await fetchPlatform(key);
    allNewItems.push(...items);
    await new Promise(r => setTimeout(r, 300));
  }
  let oldItems = [];
  try { const oldData = await env.HOTSEARCH_KV.get(KV_KEY_ITEMS, 'json'); if (oldData && Array.isArray(oldData)) oldItems = oldData; } catch(e) {}
  const itemMap = new Map();
  oldItems.forEach(item => itemMap.set(item.platform + '_' + item.title, item));
  let newCount = 0;
  for (const item of allNewItems) {
    const analysis = analyzeTopic(item.title, kwData.keywords, kwData.exclude);
    if (analysis.excluded) continue;
    const id = item.platform + '_' + item.title;
    if (!itemMap.has(id)) {
      itemMap.set(id, { ...item, domains: analysis.domains, matchedKeywords: analysis.matchedKeywords, relevance: analysis.relevance, firstSeen: now, lastSeen: now });
      newCount++;
    } else {
      const old = itemMap.get(id);
      old.rank = item.rank; old.hot = item.hot; old.lastSeen = now;
    }
  }
  const cutoff = now - HISTORY_DAYS * 24 * 60 * 60 * 1000;
  const freshItems = [...itemMap.values()].filter(item => (item.lastSeen || 0) > cutoff).sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

  let putError = null;
  try {
    const dataStr = JSON.stringify(freshItems);
    await env.HOTSEARCH_KV.put(KV_KEY_ITEMS, dataStr);
  } catch(e) { putError = e.message; }

  let history = [];
  try { const h = await env.HOTSEARCH_KV.get(KV_KEY_HISTORY, 'json'); if (h && Array.isArray(h)) history = h; } catch(e) {}
  const snapshot = { timestamp: now, dateStr: new Date(now).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }), count: freshItems.length, newCount, relevantCount: freshItems.filter(i => i.relevance > 0).length };
  history.unshift(snapshot);
  if (history.length > 50) history.length = 50;
  try { await env.HOTSEARCH_KV.put(KV_KEY_HISTORY, JSON.stringify(history)); } catch(e) {}

  return { total: freshItems.length, newCount, relevant: freshItems.filter(i => i.relevance > 0).length, timestamp: now, dateStr: snapshot.dateStr, putError, dataLen: JSON.stringify(freshItems).length };
}

async function getLatestData(env) {
  let items = [], history = [], itemsError = null;
  try {
    items = await env.HOTSEARCH_KV.get(KV_KEY_ITEMS, 'json');
    if (!items) items = [];
  } catch(e) { itemsError = e.message; }
  try {
    history = await env.HOTSEARCH_KV.get(KV_KEY_HISTORY, 'json');
    if (!history) history = [];
  } catch(e) {}
  return { items, history, itemsError };
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Cache-Control': 'no-cache' }
  });
}

function htmlResponse() {
  const html = '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="theme-color" content="#6C5CE7">\n<title>\u70ed\u641c\u8ffd\u8e2a</title>\n<style>\n* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }\nbody { font-family:-apple-system,BlinkMacSystemFont,\'PingFang SC\',\'Microsoft YaHei\',sans-serif; background:#0F0E17; color:#F5F5F7; min-height:100vh; font-size:14px; padding-bottom:70px; }\n.header { background:linear-gradient(135deg,#6C5CE7 0%,#A29BFE 100%); padding:20px 16px 14px; position:sticky; top:0; z-index:100; }\n.header h1 { font-size:18px; font-weight:700; color:#fff; }\n.header .sub { font-size:12px; color:rgba(255,255,255,0.8); margin-top:4px; }\n.refresh-btn { position:absolute; right:16px; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.2); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:16px; cursor:pointer; }\n.tabs { display:flex; gap:0; padding:0; background:#1A1B2E; overflow-x:auto; }\n.tabs button { flex:1; min-width:60px; padding:10px 4px; border:none; background:none; color:#8899A6; font-size:13px; cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; }\n.tabs button.active { color:#6C5CE7; border-bottom-color:#6C5CE7; font-weight:600; }\n.filters { padding:10px 12px; display:flex; flex-wrap:wrap; gap:6px; }\n.filter-select { background:#1A1B2E; color:#F5F5F7; border:1px solid #2D2E44; padding:6px 10px; border-radius:8px; font-size:12px; cursor:pointer; }\n.list { padding:8px 12px; }\n.item { background:#1A1B2E; border-radius:12px; padding:12px; margin-bottom:8px; display:flex; gap:10px; align-items:flex-start; }\n.rank { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; flex-shrink:0; }\n.rank-1 { background:#FF4757; color:#fff; }\n.rank-2 { background:#FF6B81; color:#fff; }\n.rank-3 { background:#FFA502; color:#fff; }\n.rank-other { background:#2D2E44; color:#8899A6; }\n.item-content { flex:1; min-width:0; }\n.item-title { font-size:14px; font-weight:500; line-height:1.4; color:#F5F5F7; }\n.item-meta { display:flex; flex-wrap:wrap; gap:4px; margin-top:4px; }\n.tag { font-size:11px; padding:2px 8px; border-radius:6px; background:#2D2E44; color:#8899A6; }\n.tag-domain { background:#6C5CE7; color:#fff; }\n.tag-hot { background:#FF4757; color:#fff; }\n.item-link { font-size:12px; color:#6C5CE7; text-decoration:none; margin-top:4px; display:inline-block; }\n.empty { text-align:center; padding:40px 20px; color:#555; font-size:14px; }\n.loading { text-align:center; padding:40px 20px; color:#888; }\n.spinner { width:32px; height:32px; border:3px solid #2D2E44; border-top-color:#6C5CE7; border-radius:50%; margin:0 auto 12px; animation:spin 0.8s linear infinite; }\n@keyframes spin { to { transform:rotate(360deg); } }\n.bottom-nav { position:fixed; bottom:0; left:0; right:0; background:#1A1B2E; display:flex; border-top:1px solid #2D2E44; z-index:100; }\n.bottom-nav button { flex:1; padding:10px 0; border:none; background:none; color:#555; font-size:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:2px; }\n.bottom-nav button.active { color:#6C5CE7; }\n.bottom-nav .icon { font-size:18px; }\n.kw-section { padding:12px; }\n.kw-section h3 { font-size:14px; color:#8899A6; margin-bottom:8px; margin-top:16px; }\n.kw-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px; }\n.kw-tag { background:#2D2E44; color:#F5F5F7; padding:4px 10px; border-radius:8px; font-size:12px; display:flex; align-items:center; gap:4px; }\n.kw-tag .del { color:#FF4757; cursor:pointer; font-size:14px; line-height:1; }\n.kw-add { display:flex; gap:6px; margin-bottom:16px; }\n.kw-add input { flex:1; background:#1A1B2E; border:1px solid #2D2E44; color:#F5F5F7; padding:6px 10px; border-radius:8px; font-size:12px; }\n.kw-add button { background:#6C5CE7; color:#fff; border:none; padding:6px 14px; border-radius:8px; font-size:12px; cursor:pointer; }\n.domain-tabs2 { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:12px; }\n.domain-tab2 { padding:6px 12px; border-radius:8px; font-size:12px; cursor:pointer; background:#1A1B2E; color:#8899A6; border:1px solid #2D2E44; }\n.domain-tab2.active { background:#6C5CE7; color:#fff; }\n.domain-tab2 .del { color:rgba(255,255,255,0.6); margin-left:4px; }\n.history-item { background:#1A1B2E; padding:10px 12px; border-radius:8px; margin-bottom:6px; font-size:12px; color:#8899A6; }\n.history-item .count { color:#6C5CE7; font-weight:600; }\n</style>\n</head>\n<body>\n<div class="header">\n  <h1>\u70ed\u641c\u8ffd\u8e2a</h1>\n  <div class="sub" id="lastUpdate">\u52a0\u8f7d\u4e2d...</div>\n  <button class="refresh-btn" id="refreshBtn">\u21bb</button>\n</div>\n<div class="tabs" id="domainTabs"></div>\n<div class="filters" id="filters">\n  <select class="filter-select" id="platformFilter"><option value="">\u5168\u90e8\u5e73\u53f0</option></select>\n  <select class="filter-select" id="sortFilter"><option value="relevance">\u5173\u8054\u5ea6</option><option value="hot">\u70ed\u5ea6</option><option value="time">\u6700\u65b0</option></select>\n  <select class="filter-select" id="timeFilter"><option value="0">\u5168\u90e8</option><option value="1">\u4eca\u5929</option><option value="3">\u8fd13\u5929</option><option value="7">\u8fd17\u5929</option></select>\n</div>\n<div class="list" id="hotList"><div class="loading"><div class="spinner"></div>\u6b63\u5728\u52a0\u8f7d...</div></div>\n<div class="bottom-nav">\n  <button id="navHot" class="active"><span class="icon">\ud83d\udd25</span><span>\u70ed\u641c</span></button>\n  <button id="navHistory"><span class="icon">\ud83d\udcc5</span><span>\u5386\u53f2</span></button>\n  <button id="navKeywords"><span class="icon">\ud83c\udff7\ufe0f</span><span>\u5173\u952e\u8bcd</span></button>\n</div>\n<script>\nlet allItems=[],currentDomain="",currentPlatform="",currentSort="relevance",currentTime=0,currentNav="hot",historyData=[],kwData={keywords:{},exclude:[]};\nconst PLATFORMS={weibo:{name:"\\u5fae\\u535a",color:"#E6162D"},douyin:{name:"\\u6296\\u97f3",color:"#000"},zhihu:{name:"\\u77e5\\u4e4e",color:"#0066FF"},baidu:{name:"\\u767e\\u5ea6",color:"#2932E1"},bilibili:{name:"B\\u7ad9",color:"#FB7299"}};\n\nasync function loadData(){\n  try{const r=await fetch("/api/latest?t="+Date.now());const d=await r.json();if(d){allItems=d.items||[];historyData=d.history||[];if(d.itemsError)console.error("KV error:",d.itemsError);return d;}}catch(e){}\n  return{items:[],history:[]};\n}\n\nasync function loadKeywords(){\n  try{const r=await fetch("/api/keywords?t="+Date.now());const d=await r.json();if(d&&d.keywords){kwData=d;return d;}}catch(e){}\n  return{keywords:{},exclude:[]};\n}\n\nasync function saveKeywords(){\n  try{await fetch("/api/keywords",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(kwData)});}catch(e){}\n}\n\nasync function doRefresh(){\n  const btn=document.getElementById("refreshBtn");btn.style.animation="spin 0.8s linear infinite";\n  const list=document.getElementById("hotList");\n  list.innerHTML=\'<div class="loading"><div class="spinner"></div>\\u6b63\\u5728\\u6293\\u53d65\\u4e2a\\u5e73\\u53f0\\u70ed\\u641c\\uff0c\\u7ea615\\u79d2...</div>\';\n  try{const r=await fetch("/api/refresh?t="+Date.now());const d=await r.json();\n    if(d.success){const data=await loadData();document.getElementById("lastUpdate").textContent="\\u66f4\\u65b0\\u4e8e "+new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})+" | \\u5171"+data.items.length+"\\u6761";renderList();}\n    else{list.innerHTML=\'<div class="empty">\\u5217\\u65b0\\u5931\\u8d25\\uff1a\'+(d.error||d.putError||"\\u672a\\u77e5\\u9519\\u8bef")+\'</div>\';}\n  }catch(e){list.innerHTML=\'<div class="empty">\\u5217\\u65b0\\u5931\\u8d25\\uff1a\'+e.message+\'</div>\';}\n  finally{btn.style.animation="";}\n}\n\nfunction parseHot(h){if(!h)return 0;const n=parseFloat(h.replace(/[^\\d.]/g,""));if(isNaN(n))return 0;if(h.includes("\\u4e07"))return n*10000;if(h.includes("\\u4ebf"))return n*100000000;return n;}\n\nfunction renderDomainTabs(){const t=document.getElementById("domainTabs");let h=\'<button class="\'+(currentDomain===""?"active":"")+\'" data-domain="">\\u5168\\u90e8</button>\';for(const d of Object.keys(kwData.keywords||{})){h+=\'<button class="\'+(currentDomain===d?"active":"")+\'" data-domain="\'+d+\'">\'+d+\'</button>\';}t.innerHTML=h;t.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{currentDomain=b.dataset.domain;renderDomainTabs();renderList();}));}\n\nfunction renderPlatformFilter(){const s=document.getElementById("platformFilter");let h=\'<option value="">\\u5168\\u90e8\\u5e73\\u53f0</option>\';for(const k of Object.keys(PLATFORMS)){h+=\'<option value="\'+k+\'">\'+PLATFORMS[k].name+\'</option>\';}s.innerHTML=h;}\n\nfunction renderList(){let items=[...allItems];if(currentDomain)items=items.filter(i=>i.domains&&i.domains.includes(currentDomain));if(currentPlatform)items=items.filter(i=>i.platformKey===currentPlatform);if(currentTime>0){const c=Date.now()-currentTime*86400000;items=items.filter(i=>(i.firstSeen||0)>c);}if(currentSort==="relevance")items.sort((a,b)=>(b.relevance||0)-(a.relevance||0));else if(currentSort==="hot")items.sort((a,b)=>parseHot(b.hot)-parseHot(a.hot));else items.sort((a,b)=>(b.firstSeen||0)-(a.firstSeen||0));const list=document.getElementById("hotList");if(!items.length){list.innerHTML=\'<div class="empty">\\u6682\\u65e0\\u6570\\u636e\\uff0c\\u70b9\\u53f3\\u4e0a\\u89d2\\u5237\\u65b0\\u6309\\u94ae\\u6293\\u53d6</div>\';return;}let h="";for(const item of items){const rc=item.rank<=3?"rank-"+item.rank:"rank-other";let m=\'<span class="tag" style="background:\'+(item.color||"#333")+\'">\'+item.platform+\'</span>\';if(item.hot)m+=\'<span class="tag tag-hot">\'+item.hot+\'</span>\';if(item.domains)for(const d of item.domains)m+=\'<span class="tag tag-domain">\'+d+\'</span>\';if(item.matchedKeywords)for(const kw of item.matchedKeywords.slice(0,3))m+=\'<span class="tag">\'+kw+\'</span>\';let ts="";if(item.firstSeen){const d=new Date(item.firstSeen);ts=(d.getMonth()+1)+"/"+d.getDate();}h+=\'<div class="item"><div class="rank \'+rc+\'">\'+item.rank+\'</div><div class="item-content"><div class="item-title">\'+item.title+\'</div><div class="item-meta">\'+m+\'</div>\';if(item.url&&item.url!=="#")h+=\'<a class="item-link" href="\'+item.url+\'" target="_blank">\\u67e5\\u770b\\u539f\\u6587</a>\';if(ts)h+=\' <span class="tag">\'+ts+\'\\u6536\\u5f55</span>\';h+="</div></div>";}list.innerHTML=h;}\n\nfunction renderHistory(){const c=document.getElementById("hotList");if(!historyData||!historyData.length){c.innerHTML=\'<div class="empty">\\u6682\\u65e0\\u5386\\u53f2\\u8bb0\\u5f55</div>\';return;}let h="";for(const item of historyData){h+=\'<div class="history-item"><span>\'+item.dateStr+\'</span> <span class="count">\\u5171\'+item.count+\'\\u6761</span> \'+(item.newCount?\'<span class="count">\\u65b0\\u589e\'+item.newCount+\'</span> \':"")+\'<span>\\u76f8\\u5173\'+item.relevantCount+\'\\u6761</span></div>\';}c.innerHTML=h;}\n\nfunction renderKeywords(){const c=document.getElementById("hotList");c.className="list";let h=\'<div class="kw-section"><h3>\\u8d5b\\u9053\\u7ba1\\u7406</h3><div class="domain-tabs2" id="dt2">\';for(const d of Object.keys(kwData.keywords||{})){h+=\'<span class="domain-tab2" data-domain="\'+d+\'">\'+d+\'<span class="del" data-del-domain="\'+d+\'">\\u00d7</span></span>\';}h+=\'</div><div class="kw-add"><input type="text" id="newDomain" placeholder="\\u65b0\\u8d5b\\u9053\\u540d\\u79f0"><button id="addDomain">\\u6dfb\\u52a0\\u8d5b\\u9053</button></div><div id="dkwSection"></div>\';h+=\'<h3>\\u6392\\u9664\\u8bcd</h3><div class="kw-tags" id="exTags">\';for(const ex of(kwData.exclude||[])){h+=\'<span class="kw-tag">\'+ex+\'<span class="del" data-del-ex="\'+ex+\'">\\u00d7</span></span>\';}h+=\'</div><div class="kw-add"><input type="text" id="newEx" placeholder="\\u6dfb\\u52a0\\u6392\\u9664\\u8bcd"><button id="addEx">\\u6dfb\\u52a0</button></div></div>\';c.innerHTML=h;\nconst first=Object.keys(kwData.keywords||{})[0]||"";\nif(first)renderDomainKeywords(first);\nbindKwEvents();}\n\nfunction renderDomainKeywords(domain){const sec=document.getElementById("dkwSection");if(!sec)return;let h=\'<h3>\\u300c\'+domain+\'\\u300d\\u5173\\u952e\\u8bcd</h3><div class="kw-tags">\';for(const kw of(kwData.keywords[domain]||[])){h+=\'<span class="kw-tag">\'+kw+\'<span class="del" data-del-kw="\'+kw+\'" data-domain="\'+domain+\'">\\u00d7</span></span>\';}h+=\'</div><div class="kw-add"><input type="text" id="newKw" placeholder="\\u6dfb\\u52a0\\u5173\\u952e\\u8bcd" data-domain="\'+domain+\'"><button id="addKw" data-domain="\'+domain+\'">\\u6dfb\\u52a0</button></div>\';sec.innerHTML=h;bindKwEvents();}\n\nfunction bindKwEvents(){const addD=document.getElementById("addDomain");if(addD)addD.addEventListener("click",async()=>{const i=document.getElementById("newDomain");const v=i.value.trim();if(v&&!kwData.keywords[v]){kwData.keywords[v]=[];await saveKeywords();renderKeywords();renderDomainTabs();}});\ndocument.querySelectorAll("[data-del-domain]").forEach(e=>e.addEventListener("click",async()=>{const d=e.dataset.delDomain;delete kwData.keywords[d];await saveKeywords();renderKeywords();renderDomainTabs();}));\ndocument.querySelectorAll(".domain-tab2:not([data-del-domain])").forEach(e=>{if(!e.hasAttribute("data-bound")){e.setAttribute("data-bound","1");e.addEventListener("click",()=>{const d=e.dataset.domain;renderDomainKeywords(d);});}});\nconst addK=document.getElementById("addKw");if(addK)addK.addEventListener("click",async()=>{const i=document.getElementById("newKw");const d=addK.dataset.domain;const v=i.value.trim();if(v&&kwData.keywords[d]&&!kwData.keywords[d].includes(v)){kwData.keywords[d].push(v);await saveKeywords();renderDomainKeywords(d);}});\ndocument.querySelectorAll("[data-del-kw]").forEach(e=>e.addEventListener("click",async()=>{const d=e.dataset.domain;const k=e.dataset.delKw;kwData.keywords[d]=kwData.keywords[d].filter(x=>x!==k);await saveKeywords();renderDomainKeywords(d);}));\nconst addE=document.getElementById("addEx");if(addE)addE.addEventListener("click",async()=>{const i=document.getElementById("newEx");const v=i.value.trim();if(v&&!kwData.exclude.includes(v)){kwData.exclude.push(v);await saveKeywords();renderKeywords();}});\ndocument.querySelectorAll("[data-del-ex]").forEach(e=>e.addEventListener("click",async()=>{const x=e.dataset.delEx;kwData.exclude=kwData.exclude.filter(v=>v!==x);await saveKeywords();renderKeywords();}));}\n\nfunction switchNav(nav){currentNav=nav;document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.remove("active"));document.getElementById("nav"+nav.charAt(0).toUpperCase()+nav.slice(1)).classList.add("active");const tabs=document.getElementById("domainTabs");const filters=document.getElementById("filters");if(nav==="hot"){tabs.style.display="flex";filters.style.display="flex";renderList();}else if(nav==="history"){tabs.style.display="none";filters.style.display="none";renderHistory();}else if(nav==="keywords"){tabs.style.display="none";filters.style.display="none";renderKeywords();}}\n\nasync function init(){renderPlatformFilter();await loadKeywords();renderDomainTabs();const data=await loadData();allItems=data.items||[];historyData=data.history||[];if(allItems.length>0){document.getElementById("lastUpdate").textContent="\\u5171"+allItems.length+"\\u6761\\u6570\\u636e";renderList();}else{doRefresh();}}\n\ndocument.getElementById("refreshBtn").addEventListener("click",doRefresh);\ndocument.getElementById("platformFilter").addEventListener("change",e=>{currentPlatform=e.target.value;renderList();});\ndocument.getElementById("sortFilter").addEventListener("change",e=>{currentSort=e.target.value;renderList();});\ndocument.getElementById("timeFilter").addEventListener("change",e=>{currentTime=parseInt(e.target.value);renderList();});\ndocument.getElementById("navHot").addEventListener("click",()=>switchNav("hot"));\ndocument.getElementById("navHistory").addEventListener("click",()=>switchNav("history"));\ndocument.getElementById("navKeywords").addEventListener("click",()=>switchNav("keywords"));\ninit();\n</script>\n</body>\n</html>';
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === 'OPTIONS') return jsonResponse({});
    if (path === '/api/latest' || path === '/api/data') {
      const data = await getLatestData(env);
      return jsonResponse({ success: true, ...data });
    }
    if (path === '/api/refresh') {
      try { const result = await fetchAndStore(env); return jsonResponse({ success: true, ...result }); }
      catch(e) { return jsonResponse({ success: false, error: e.message }); }
    }
    if (path === '/api/keywords') {
      if (request.method === 'POST') {
        try { const body = await request.json(); await saveKeywords(env, body); return jsonResponse({ success: true }); }
        catch(e) { return jsonResponse({ success: false, error: e.message }); }
      } else {
        const kw = await getKeywords(env);
        return jsonResponse({ success: true, ...kw });
      }
    }
    return htmlResponse();
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(fetchAndStore(env));
  }
};
