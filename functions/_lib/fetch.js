// 热搜抓取模块
const https = require('https');

const TOPHUB_BASE = 'https://tophub.today';

// 各平台在tophub.today上的节点ID
const PLATFORMS = {
  weibo: { name: '微博', nodeId: 'KqndgxeLl9', color: '#E6162D' },
  douyin: { name: '抖音', nodeId: 'DpQvNABoNE', color: '#000000' },
  zhihu: { name: '知乎', nodeId: 'mproPpoq6O', color: '#0066FF' },
  baidu: { name: '百度', nodeId: 'Jb0vmloB1G', color: '#2932E1' },
  bilibili: { name: 'B站', nodeId: '74KvxwokxM', color: '#FB7299' }
};

// 默认筛选关键词（按赛道分类）
const DEFAULT_KEYWORDS = {
  '教育': ['教育', '学校', '老师', '学生', '学习', '高考', '中考', '考研', '大学', '专业', '课程', '成绩', '补课', '教培', '双减', '作业', '考试', '留学', '申请', '名校', '录取', '志愿', '报考'],
  '认知': ['认知', '思维', '思考', '底层逻辑', '成长', '提升', '学习方法', '效率', '思维方式', '认知升级', '觉醒', '开窍', '格局'],
  '家庭': ['家庭', '家长', '父母', '亲子', '育儿', '孩子', '妈妈', '爸爸', '婚姻', '夫妻', '家庭关系', '家庭教育', '青春期', '婆媳', '带娃'],
  '升学': ['升学', '志愿', '报考', '录取', '高考志愿', '专业选择', '留学', '出国', '名校', '985', '211', '考研', '考公', '就业', 'offer'],
  '艺术': ['艺术', '美术', '音乐', '设计', '文化', '传统', '非遗', '博物馆', '展览', '艺术家', '画作', '书法', '国画', '油画', '雕塑', '摄影', '电影', '戏剧'],
  '美学': ['美学', '审美', '美', '文艺', '人文', '文学', '哲学', '人生', '生活方式', '品味', '气质', '优雅', '艺术感']
};

// HTTP GET请求
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      timeout: 15000,
      // 开发环境跳过SSL验证（Vercel上不需要）
      rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0'
    };
    
    const req = https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // 处理重定向
        httpGet(new URL(res.headers.location, url).href)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// 从HTML中提取热搜列表（兼容tophub.today不同平台的表格格式）
function parseHotList(html, platformName) {
  const items = [];
  const tbodyMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/);
  if (!tbodyMatch) return items;
  
  const tbody = tbodyMatch[1];
  // 提取每个tr
  const trMatches = [...tbody.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
  
  for (const trMatch of trMatches) {
    const tr = trMatch[1];
    
    // 提取排名
    const rankMatch = tr.match(/<td[^>]*>\s*(\d+)\.\s*<\/td>/);
    if (!rankMatch) continue;
    const rank = rankMatch[1];
    
    // 提取标题和链接（找第一个有实际内容的a标签，排除图标链接）
    const linkMatches = [...tr.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    let title = '';
    let url = '';
    for (const lm of linkMatches) {
      const t = lm[2].replace(/<[^>]*>/g, '').trim();
      if (t.length > 5 && !lm[1].includes('#') && !lm[2].includes('m-n')) {
        title = t;
        url = lm[1];
        break;
      }
    }
    
    if (!title || title.length < 3) continue;
    
    // 提取热度（ws类或item-extra类）
    let hot = '';
    const wsMatch = tr.match(/class="ws"[^>]*>\s*([^<]+?)\s*<\//);
    if (wsMatch) {
      hot = wsMatch[1].trim();
    } else {
      const extraMatch = tr.match(/class="item-extra"[^>]*>\s*([^<]+?)\s*<\//);
      if (extraMatch) {
        hot = extraMatch[1].trim();
      }
    }
    
    items.push({ rank, title, url, hot, platform: platformName });
    if (items.length >= 60) break;
  }
  
  return items;
}

// 判断热搜属于哪些赛道
function classifyTopic(title, customKeywords = {}) {
  const domains = [];
  const allKeywords = { ...DEFAULT_KEYWORDS };
  // 合并用户自定义关键词
  for (const [domain, kws] of Object.entries(customKeywords)) {
    if (allKeywords[domain]) {
      allKeywords[domain] = [...new Set([...allKeywords[domain], ...kws])];
    } else {
      allKeywords[domain] = kws;
    }
  }
  for (const [domain, keywords] of Object.entries(allKeywords)) {
    if (keywords.some(kw => title.includes(kw))) {
      domains.push(domain);
    }
  }
  return domains;
}

// 抓取单个平台
async function fetchPlatform(platformKey) {
  const platform = PLATFORMS[platformKey];
  if (!platform) return [];
  
  try {
    const url = `${TOPHUB_BASE}/n/${platform.nodeId}`;
    const { status, body } = await httpGet(url);
    if (status !== 200) {
      console.error(`抓取 ${platform.name} 失败: HTTP ${status}`);
      return [];
    }
    const items = parseHotList(body, platform.name);
    return items.map(item => ({
      ...item,
      platformKey,
      color: platform.color,
      domains: []
    }));
  } catch (e) {
    console.error(`抓取 ${platform.name} 失败:`, e.message);
    return [];
  }
}

// 抓取所有平台
async function fetchAllPlatforms() {
  const results = [];
  const keys = Object.keys(PLATFORMS);
  for (const key of keys) {
    const items = await fetchPlatform(key);
    results.push(...items);
    // 稍微延迟避免请求过快
    await new Promise(r => setTimeout(r, 200));
  }
  return results;
}

module.exports = {
  PLATFORMS,
  DEFAULT_KEYWORDS,
  fetchPlatform,
  fetchAllPlatforms,
  classifyTopic
};
