const TOPHUB_BASE = 'https://tophub.today';

const PLATFORMS = {
  weibo: { name: '微博', nodeId: 'KqndgxeLl9', color: '#E6162D' },
  douyin: { name: '抖音', nodeId: 'DpQvNABoNE', color: '#000000' },
  zhihu: { name: '知乎', nodeId: 'mproPpoq6O', color: '#0066FF' },
  baidu: { name: '百度', nodeId: 'Jb0vmloB1G', color: '#2932E1' },
  bilibili: { name: 'B站', nodeId: '74KvxwokxM', color: '#FB7299' }
};

const CHINESE_KEYWORDS = {
  '教育': ['教育','学校','老师','学生','学习','高考','中考','考研','大学','专业','课程','成绩','补课','教培','双减','作业','考试','留学','申请','名校','录取','志愿','报考','学霸','学区房','课外班'],
  '认知': ['认知','思维','思考','底层逻辑','成长','提升','学习方法','效率','思维方式','认知升级','觉醒','开悟','格局','眼界','圈层','信息差','认知差'],
  '家庭': ['家庭','家长','父母','亲子','育儿','孩子','妈妈','爸爸','婚姻','夫妻','家庭关系','家庭教育','青春期','婆媳','带娃','鸡娃','陪读','全职妈妈','宝妈'],
  '升学': ['升学','志愿','报考','录取','高考志愿','专业选择','留学','出国','名校','985','211','考研','考公','就业','offer','保研','春招','秋招','选调'],
  '艺术': ['艺术','美术','音乐','设计','文化','传统','非遗','博物馆','展览','艺术家','画作','书法','国画','油画','雕塑','摄影','电影','戏剧','艺术展','艺术留学'],
  '美学': ['美学','审美','美','文艺','人文','文学','哲学','人生','生活方式','品味','气质','优雅','艺术感','审美提升','生活美学']
};

const EXCLUDE_KEYWORDS = [
  '搞笑','段子','整活','表情包','梗','爆笑','沙雕','鬼畜','恶搞',
  '游戏','王者荣耀','英雄联盟','原神','吃鸡','主播','网红',
  '明星','八卦','绯闻','吃瓜','恋情',
  '美食','吃播','探店','旅游','穿搭','美妆',
  'cos','cosplay','漫展','二次元',
  '宠物','萌宠',
  '体育','足球','篮球','世界杯','奥运会'
];

const KV_KEY_ITEMS = 'hotsearch:items';
const KV_KEY_HISTORY = 'hotsearch:history';
const HISTORY_DAYS = 7;

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
  } catch(e) {
    console.error('Fetch error ' + platformKey + ':', e.message);
    return [];
  }
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
      if (t.length > 4 && !lm[1].includes('#') && !lm[2].includes('m-n')) {
        title = t; url = lm[1]; break;
      }
    }
    if (!title || title.length < 3) continue;
    let hot = '';
    const wsMatch = tr.match(/class="ws"[^>]*>\s*([^<]+?)\s*<\//);
    if (wsMatch) hot = wsMatch[1].trim();
    else {
      const em = tr.match(/class="item-extra"[^>]*>\s*([^<]+?)\s*<\//);
      if (em) hot = em[1].trim();
    }
    items.push({ rank, title, url, hot, platform: platformName, platformKey, color });
    if (items.length >= 50) break;
  }
  return items;
}

function analyzeTopic(title) {
  const domains = [], matched = [];
  const excluded = EXCLUDE_KEYWORDS.some(kw => title.includes(kw));
  if (excluded) return { domains, matchedKeywords: matched, relevance: 0, excluded: true };
  for (const [domain, keywords] of Object.entries(CHINESE_KEYWORDS)) {
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
  const allNewItems = [];
  for (const key of Object.keys(PLATFORMS)) {
    const items = await fetchPlatform(key);
    allNewItems.push(...items);
    await new Promise(r => setTimeout(r, 300));
  }
  let oldItems = [];
  try {
    const oldData = await env.HOTSEARCH_KV.get(KV_KEY_ITEMS, 'json');
    if (oldData && Array.isArray(oldData)) oldItems = oldData;
  } catch(e) {}
  const itemMap = new Map();
  oldItems.forEach(item => itemMap.set(item.platform + '_' + item.title, item));
  let newCount = 0;
  for (const item of allNewItems) {
    const analysis = analyzeTopic(item.title);
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
  const freshItems = [...itemMap.values()]
    .filter(item => (item.lastSeen || 0) > cutoff)
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
  try { await env.HOTSEARCH_KV.put(KV_KEY_ITEMS, JSON.stringify(freshItems), { expirationTtl: HISTORY_DAYS * 24 * 60 * 60 }); } catch(e) {}
  let history = [];
  try {
    const h = await env.HOTSEARCH_KV.get(KV_KEY_HISTORY, 'json');
    if (h && Array.isArray(h)) history = h;
  } catch(e) {}
  const snapshot = { timestamp: now, dateStr: new Date(now).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }), count: freshItems.length, newCount: newCount, relevantCount: freshItems.filter(i => i.relevance > 0).length };
  history.unshift(snapshot);
  if (history.length > 50) history.length = 50;
  try { await env.HOTSEARCH_KV.put(KV_KEY_HISTORY, JSON.stringify(history)); } catch(e) {}
  return { total: freshItems.length, newCount, relevant: freshItems.filter(i => i.relevance > 0).length, timestamp: now, dateStr: snapshot.dateStr };
}

async function getLatestData(env) {
  try {
    const items = await env.HOTSEARCH_KV.get(KV_KEY_ITEMS, 'json');
    const history = await env.HOTSEARCH_KV.get(KV_KEY_HISTORY, 'json');
    return { items: items || [], history: history || [] };
  } catch(e) { return { items: [], history: [] }; }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' }
  });
}

function htmlResponse() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#6C5CE7">
<title>热搜追踪</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
body { font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif; background:#0F0E17; color:#F5F5F7; min-height:100vh; font-size:14px; padding-bottom:70px; }
.header { background:linear-gradient(135deg,#6C5CE7 0%,#A29BFE 100%); padding:20px 16px 14px; position:sticky; top:0; z-index:100; }
.header h1 { font-size:18px; font-weight:700; color:#fff; }
.header .sub { font-size:12px; color:rgba(255,255,255,0.8); margin-top:4px; }
.refresh-btn { position:absolute; right:16px; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.2); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:16px; cursor:pointer; }
.tabs { display:flex; gap:0; padding:0; background:#1A1B2E; overflow-x:auto; }
.tabs button { flex:1; min-width:60px; padding:10px 4px; border:none; background:none; color:#8899A6; font-size:13px; cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; }
.tabs button.active { color:#6C5CE7; border-bottom-color:#6C5CE7; font-weight:600; }
.filters { padding:10px 12px; display:flex; flex-wrap:wrap; gap:6px; }
.filter-select { background:#1A1B2E; color:#F5F5F7; border:1px solid #2D2E44; padding:6px 10px; border-radius:8px; font-size:12px; cursor:pointer; }
.list { padding:8px 12px; }
.item { background:#1A1B2E; border-radius:12px; padding:12px; margin-bottom:8px; display:flex; gap:10px; align-items:flex-start; }
.rank { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; flex-shrink:0; }
.rank-1 { background:#FF4757; color:#fff; }
.rank-2 { background:#FF6B81; color:#fff; }
.rank-3 { background:#FFA502; color:#fff; }
.rank-other { background:#2D2E44; color:#8899A6; }
.item-content { flex:1; min-width:0; }
.item-title { font-size:14px; font-weight:500; line-height:1.4; color:#F5F5F7; }
.item-meta { display:flex; flex-wrap:wrap; gap:4px; margin-top:4px; }
.tag { font-size:11px; padding:2px 8px; border-radius:6px; background:#2D2E44; color:#8899A6; }
.tag-domain { background:#6C5CE7; color:#fff; }
.tag-hot { background:#FF4757; color:#fff; }
.item-link { font-size:12px; color:#6C5CE7; text-decoration:none; margin-top:4px; display:inline-block; }
.empty { text-align:center; padding:40px 20px; color:#555; font-size:14px; }
.loading { text-align:center; padding:40px 20px; color:#888; }
.spinner { width:32px; height:32px; border:3px solid #2D2E44; border-top-color:#6C5CE7; border-radius:50%; margin:0 auto 12px; animation:spin 0.8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.bottom-nav { position:fixed; bottom:0; left:0; right:0; background:#1A1B2E; display:flex; border-top:1px solid #2D2E44; z-index:100; }
.bottom-nav button { flex:1; padding:10px 0; border:none; background:none; color:#555; font-size:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:2px; }
.bottom-nav button.active { color:#6C5CE7; }
.bottom-nav .icon { font-size:18px; }
</style>
</head>
<body>
<div class="header">
  <h1>热搜追踪</h1>
  <div class="sub" id="lastUpdate">加载中...</div>
  <button class="refresh-btn" id="refreshBtn">\\u21bb</button>
</div>
<div class="tabs" id="domainTabs"></div>
<div class="filters" id="filters">
  <select class="filter-select" id="platformFilter"><option value="">全部平台</option></select>
  <select class="filter-select" id="sortFilter"><option value="relevance">关联度</option><option value="hot">热度</option><option value="time">最新</option></select>
  <select class="filter-select" id="timeFilter"><option value="0">全部</option><option value="1">今天</option><option value="3">近3天</option><option value="7">近7天</option></select>
</div>
<div class="list" id="hotList"><div class="loading"><div class="spinner"></div>正在加载...</div></div>
<div class="bottom-nav">
  <button id="navHot" class="active"><span class="icon">\\ud83d\\udd25</span><span>热搜</span></button>
  <button id="navHistory"><span class="icon">\\ud83d\\udcc5</span><span>历史</span></button>
</div>
<script>
let allItems=[],currentDomain='',currentPlatform='',currentSort='relevance',currentTime=0,currentNav='hot';
const API_BASE='';
const PLATFORMS={weibo:{name:'微博',color:'#E6162D'},douyin:{name:'抖音',color:'#000'},zhihu:{name:'知乎',color:'#0066FF'},baidu:{name:'百度',color:'#2932E1'},bilibili:{name:'B站',color:'#FB7299'}};
const DOMAINS=['教育','认知','家庭','升学','艺术','美学'];

async function loadData(){
  try{
    const r=await fetch('/api/latest?t='+Date.now());
    const d=await r.json();
    if(d&&d.items){allItems=d.items;return d;}
  }catch(e){}
  return{items:[],history:[]};
}

async function doRefresh(){
  const btn=document.getElementById('refreshBtn');
  btn.style.animation='spin 0.8s linear infinite';
  const list=document.getElementById('hotList');
  list.innerHTML='<div class="loading"><div class="spinner"></div>正在抓取5个平台热搜，约15秒...</div>';
  try{
    const r=await fetch('/api/refresh?t='+Date.now());
    const d=await r.json();
    if(d.success){
      const data=await loadData();
      document.getElementById('lastUpdate').textContent='更新于 '+new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})+' | 共'+data.items.length+'条';
      renderList();
    }else{
      list.innerHTML='<div class="empty">刷新失败：'+(d.error||'未知错误')+'</div>';
    }
  }catch(e){
    list.innerHTML='<div class="empty">刷新失败：'+e.message+'</div>';
  }finally{btn.style.animation='';}
}

function parseHot(h){if(!h)return 0;const n=parseFloat(h.replace(/[^\\d.]/g,''));if(isNaN(n))return 0;if(h.includes('万'))return n*10000;if(h.includes('亿'))return n*100000000;return n;}

function renderDomainTabs(){
  const t=document.getElementById('domainTabs');
  let h='<button class="'+(currentDomain===''?'active':'')+'" data-domain="">全部</button>';
  for(const d of DOMAINS){h+='<button class="'+(currentDomain===d?'active':'')+'" data-domain="'+d+'">'+d+'</button>';}
  t.innerHTML=h;
  t.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{currentDomain=b.dataset.domain;renderDomainTabs();renderList();}));
}

function renderPlatformFilter(){
  const s=document.getElementById('platformFilter');
  let h='<option value="">全部平台</option>';
  for(const k of Object.keys(PLATFORMS)){h+='<option value="'+k+'">'+PLATFORMS[k].name+'</option>';}
  s.innerHTML=h;
}

function renderList(){
  let items=[...allItems];
  if(currentDomain)items=items.filter(i=>i.domains&&i.domains.includes(currentDomain));
  if(currentPlatform)items=items.filter(i=>i.platformKey===currentPlatform);
  if(currentTime>0){const c=Date.now()-currentTime*86400000;items=items.filter(i=>(i.firstSeen||0)>c);}
  if(currentSort==='relevance')items.sort((a,b)=>(b.relevance||0)-(a.relevance||0));
  else if(currentSort==='hot')items.sort((a,b)=>parseHot(b.hot)-parseHot(a.hot));
  else items.sort((a,b)=>(b.firstSeen||0)-(a.firstSeen||0));

  const list=document.getElementById('hotList');
  if(!items.length){list.innerHTML='<div class="empty">暂无数据，点右上角刷新按钮抓取</div>';return;}
  let h='';
  for(const item of items){
    const rc=item.rank<=3?'rank-'+item.rank:'rank-other';
    let m='<span class="tag" style="background:'+(item.color||'#333')+'">'+item.platform+'</span>';
    if(item.hot)m+='<span class="tag tag-hot">'+item.hot+'</span>';
    if(item.domains)for(const d of item.domains)m+='<span class="tag tag-domain">'+d+'</span>';
    if(item.matchedKeywords)for(const kw of item.matchedKeywords.slice(0,3))m+='<span class="tag">'+kw+'</span>';
    let ts='';
    if(item.firstSeen){const d=new Date(item.firstSeen);ts=(d.getMonth()+1)+'/'+d.getDate();}
    h+='<div class="item"><div class="rank '+rc+'">'+item.rank+'</div><div class="item-content"><div class="item-title">'+item.title+'</div><div class="item-meta">'+m+'</div>';
    if(item.url&&item.url!=='#')h+='<a class="item-link" href="'+item.url+'" target="_blank">查看原文</a>';
    if(ts)h+=' <span class="tag">'+ts+'收录</span>';
    h+='</div></div>';
  }
  list.innerHTML=h;
}

function renderHistory(history){
  const c=document.getElementById('pageContent')||document.getElementById('hotList');
  if(!history||!history.length){c.innerHTML='<div class="empty">暂无历史记录</div>';return;}
  let h='';
  for(const item of history){
    h+='<div style="background:#1A1B2E;padding:10px 12px;border-radius:8px;margin-bottom:6px;font-size:12px;color:#8899A6"><span>'+item.dateStr+'</span> <span style="color:#6C5CE7;font-weight:600">共'+item.count+'条</span> '+(item.newCount?'<span style="color:#FF4757">新增'+item.newCount+'</span> ':'')+'<span>相关'+item.relevantCount+'条</span></div>';
  }
  c.innerHTML=h;
}

let historyData=[];

function switchNav(nav){
  currentNav=nav;
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.remove('active'));
  const map={hot:'navHot',history:'navHistory'};
  document.getElementById(map[nav]).classList.add('active');
  const tabs=document.getElementById('domainTabs');
  const filters=document.getElementById('filters');
  if(nav==='hot'){tabs.style.display='flex';filters.style.display='flex';renderList();}
  else if(nav==='history'){tabs.style.display='none';filters.style.display='none';renderHistory(historyData);}
}

async function init(){
  renderPlatformFilter();
  renderDomainTabs();
  const data=await loadData();
  allItems=data.items||[];
  historyData=data.history||[];
  if(allItems.length>0){
    document.getElementById('lastUpdate').textContent='共'+allItems.length+'条数据';
    renderList();
  }else{
    doRefresh();
  }
}

document.getElementById('refreshBtn').addEventListener('click',doRefresh);
document.getElementById('platformFilter').addEventListener('change',e=>{currentPlatform=e.target.value;renderList();});
document.getElementById('sortFilter').addEventListener('change',e=>{currentSort=e.target.value;renderList();});
document.getElementById('timeFilter').addEventListener('change',e=>{currentTime=parseInt(e.target.value);renderList();});
document.getElementById('navHot').addEventListener('click',()=>switchNav('hot'));
document.getElementById('navHistory').addEventListener('click',()=>switchNav('history'));
init();
</script>
</body>
</html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === '/api/latest' || path === '/api/data') {
      const data = await getLatestData(env);
      return jsonResponse({ success: true, ...data });
    }
    if (path === '/api/refresh') {
      try {
        const result = await fetchAndStore(env);
        return jsonResponse({ success: true, ...result });
      } catch(e) {
        return jsonResponse({ success: false, error: e.message });
      }
    }
    return htmlResponse();
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(fetchAndStore(env));
  }
};
