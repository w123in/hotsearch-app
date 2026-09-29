// 存储模块 - 支持 Vercel KV (Redis) 和本地文件两种模式
const fs = require('fs');
const path = require('path');

const HISTORY_DAYS = 7;

// Vercel KV 客户端（延迟加载）
let kvClient = null;
function getKV() {
  if (kvClient) return kvClient;
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { Kv } = require('@vercel/kv');
    kvClient = new Kv({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN
    });
    console.log('使用 Vercel KV 存储');
  }
  return kvClient;
}

// 判断是否使用 KV
function useKV() {
  return !!getKV();
}

// ========== 本地文件存储（开发用）==========
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'hotsearch.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readLocalData() {
  ensureDir();
  if (!fs.existsSync(DATA_FILE)) {
    return { records: [], customKeywords: {} };
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    return { records: [], customKeywords: {} };
  }
}

function writeLocalData(data) {
  ensureDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ========== 热搜记录 ==========
async function saveRecords(items) {
  const now = Date.now();
  const record = {
    timestamp: now,
    dateStr: new Date(now).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    items
  };
  
  if (useKV()) {
    const kv = getKV();
    // 存单条记录
    await kv.set(`record:${now}`, JSON.stringify(record));
    // 加到列表
    await kv.lpush('records:list', now);
    // 清理超过7天的
    const cutoff = now - HISTORY_DAYS * 24 * 60 * 60 * 1000;
    const all = await kv.lrange('records:list', 0, -1);
    const expired = all.filter(t => Number(t) < cutoff);
    if (expired.length > 0) {
      for (const t of expired) {
        await kv.del(`record:${t}`);
      }
      await kv.ltrim('records:list', 0, all.length - expired.length - 1);
    }
  } else {
    const data = readLocalData();
    data.records.unshift(record);
    const cutoff = now - HISTORY_DAYS * 24 * 60 * 60 * 1000;
    data.records = data.records.filter(r => r.timestamp > cutoff);
    writeLocalData(data);
  }
  
  return record;
}

async function getLatest() {
  if (useKV()) {
    const kv = getKV();
    const list = await kv.lrange('records:list', 0, 0);
    if (!list || list.length === 0) return null;
    const record = await kv.get(`record:${list[0]}`);
    return typeof record === 'string' ? JSON.parse(record) : record;
  } else {
    const data = readLocalData();
    return data.records.length > 0 ? data.records[0] : null;
  }
}

async function getHistoryList() {
  if (useKV()) {
    const kv = getKV();
    const timestamps = await kv.lrange('records:list', 0, 50); // 最多返回50条
    const list = [];
    for (const ts of timestamps) {
      const record = await kv.get(`record:${ts}`);
      if (record) {
        const r = typeof record === 'string' ? JSON.parse(record) : record;
        list.push({
          timestamp: r.timestamp,
          dateStr: r.dateStr,
          count: r.items ? r.items.length : 0
        });
      }
    }
    return list;
  } else {
    const data = readLocalData();
    return data.records.map(r => ({
      timestamp: r.timestamp,
      dateStr: r.dateStr,
      count: r.items.length
    }));
  }
}

async function getByTimestamp(timestamp) {
  const ts = Number(timestamp);
  if (useKV()) {
    const kv = getKV();
    const record = await kv.get(`record:${ts}`);
    return record ? (typeof record === 'string' ? JSON.parse(record) : record) : null;
  } else {
    const data = readLocalData();
    return data.records.find(r => r.timestamp === ts) || null;
  }
}

// ========== 自定义关键词 ==========
async function getCustomKeywords() {
  if (useKV()) {
    const kv = getKV();
    const kw = await kv.get('customKeywords');
    return kw ? (typeof kw === 'string' ? JSON.parse(kw) : kw) : {};
  } else {
    const data = readLocalData();
    return data.customKeywords || {};
  }
}

async function saveCustomKeywords(keywords) {
  if (useKV()) {
    const kv = getKV();
    await kv.set('customKeywords', JSON.stringify(keywords));
  } else {
    const data = readLocalData();
    data.customKeywords = keywords;
    writeLocalData(data);
  }
  return keywords;
}

async function addCustomKeyword(domain, keyword) {
  const keywords = await getCustomKeywords();
  if (!keywords[domain]) keywords[domain] = [];
  if (!keywords[domain].includes(keyword)) {
    keywords[domain].push(keyword);
  }
  await saveCustomKeywords(keywords);
  return keywords;
}

async function removeCustomKeyword(domain, keyword) {
  const keywords = await getCustomKeywords();
  if (keywords[domain]) {
    keywords[domain] = keywords[domain].filter(k => k !== keyword);
  }
  await saveCustomKeywords(keywords);
  return keywords;
}

module.exports = {
  saveRecords,
  getLatest,
  getHistoryList,
  getByTimestamp,
  getCustomKeywords,
  saveCustomKeywords,
  addCustomKeyword,
  removeCustomKeyword,
  useKV
};
