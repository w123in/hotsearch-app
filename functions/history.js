// GET /api/history
const { getHistoryList } = require('../_lib/storage');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  const list = await getHistoryList();
  res.json({ list });
};
