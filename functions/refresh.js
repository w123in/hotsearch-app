// POST /api/refresh
const { fetchAllPlatforms, classifyTopic, PLATFORMS } = require('../_lib/fetch');
const { saveRecords, getCustomKeywords } = require('../_lib/storage');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  // 简单鉴权
  const secret = req.headers['x-secret'] || (req.query && req.query.secret);
  if (process.env.REFRESH_SECRET && secret !== process.env.REFRESH_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  try {
    console.log('[刷新] 开始抓取热搜...');
    const items = await fetchAllPlatforms();
    console.log(`[刷新] 抓取完成，共 ${items.length} 条`);
    
    // 分类
    const customKeywords = await getCustomKeywords();
    const classified = items.map(item => ({
      ...item,
      domains: classifyTopic(item.title, customKeywords)
    }));
    
    // 保存
    const record = await saveRecords(classified);
    
    const domainCounts = {};
    for (const item of classified) {
      for (const d of item.domains) {
        domainCounts[d] = (domainCounts[d] || 0) + 1;
      }
    }
    
    res.json({
      success: true,
      timestamp: record.timestamp,
      dateStr: record.dateStr,
      total: classified.length,
      relatedCount: classified.filter(i => i.domains.length > 0).length,
      domainCounts,
      platforms: Object.keys(PLATFORMS).length
    });
  } catch (e) {
    console.error('[刷新] 失败:', e);
    res.status(500).json({ success: false, error: e.message });
  }
};
