// GET /api/hotsearch?domain=教育&platform=抖音&t=timestamp
const { getLatest, getByTimestamp, getCustomKeywords } = require('../_lib/storage');
const { classifyTopic } = require('../_lib/fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  const { domain, platform, t } = req.query;
  
  let record;
  if (t) {
    record = await getByTimestamp(t);
  } else {
    record = await getLatest();
  }
  
  if (!record) {
    return res.json({ timestamp: null, dateStr: null, items: [] });
  }
  
  const customKeywords = await getCustomKeywords();
  
  let items = record.items;
  
  // 如果没有预先标记domains，分类
  if (items.length > 0 && (!items[0].domains || items[0].domains.length === 0)) {
    items = items.map(item => ({
      ...item,
      domains: classifyTopic(item.title, customKeywords)
    }));
  }
  
  // 按赛道筛选
  if (domain && domain !== 'all') {
    items = items.filter(item => item.domains && item.domains.includes(domain));
  }
  
  // 按平台筛选
  if (platform && platform !== 'all') {
    items = items.filter(item => item.platform === platform);
  }
  
  res.json({
    timestamp: record.timestamp,
    dateStr: record.dateStr,
    total: items.length,
    items
  });
};
