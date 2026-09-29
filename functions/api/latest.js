// Cloudflare Pages Function: /api/latest
// 获取最新热搜数据
export async function onRequestGet(context) {
  try {
    const items = await context.env.HOTSEARCH_KV.get('hotsearch:items', 'json');
    const history = await context.env.HOTSEARCH_KV.get('hotsearch:history', 'json');
    return jsonResponse({
      success: true,
      items: items || [],
      history: history || []
    });
  } catch(e) {
    return jsonResponse({ success: false, error: e.message }, 500);
  }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  });
}
