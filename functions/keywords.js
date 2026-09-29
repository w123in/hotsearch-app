// GET /api/keywords - 获取自定义关键词
// POST /api/keywords - 添加关键词 { domain, keyword }
// DELETE /api/keywords - 删除关键词 { domain, keyword }
const { getCustomKeywords, addCustomKeyword, removeCustomKeyword } = require('../_lib/storage');
const { DEFAULT_KEYWORDS } = require('../_lib/fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    const custom = await getCustomKeywords();
    return res.json({ default: DEFAULT_KEYWORDS, custom });
  }
  
  // 解析body
  let body = req.body;
  if (!body && req.on) {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve({}); }
      });
    });
  }
  
  if (req.method === 'POST') {
    const { domain, keyword } = body || {};
    if (!domain || !keyword) {
      return res.status(400).json({ error: '缺少 domain 或 keyword' });
    }
    const keywords = await addCustomKeyword(domain.trim(), keyword.trim());
    return res.json({ success: true, keywords });
  }
  
  if (req.method === 'DELETE') {
    const { domain, keyword } = body || {};
    if (!domain || !keyword) {
      return res.status(400).json({ error: '缺少 domain 或 keyword' });
    }
    const keywords = await removeCustomKeyword(domain.trim(), keyword.trim());
    return res.json({ success: true, keywords });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};
