const http = require('http');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = 3000;

if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is not set. Add it to your .env file.');
  process.exit(1);
}

function extractText(html) {
  return html
    .replace(/<head[\s\S]*?<\/head>/i, '')
    .replace(/<(script|style|nav|header|footer|noscript)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 15000);
}

function cleanJobText(text) {
  const noisePattern = /\b(cookies?|privacy policy|accept all|reject all|consent|gdpr|necessary cookies?|third[- ]party cookies?|opt[- ]out|opt[- ]in|we use cookies|this site uses cookies?|your privacy|privacy settings|cookie settings|cookie preferences|personalized ads|legitimate interest|manage preferences|advertising partners|data protection)\b/i;

  return text
    .split(/\.\s+/)
    .filter(s => !(noisePattern.test(s) && s.trim().length < 350))
    .join('. ')
    .replace(/\s+/g, ' ')
    .trim();
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && (req.url === '/' || req.url.endsWith('.html'))) {
    const filePath = path.join(__dirname, req.url === '/' ? 'agent-fr.html' : req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch(e) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/search-jobs')) {
    const searchParams = new URL(req.url, 'http://localhost').searchParams;
    const q = searchParams.get('q');
    const location = searchParams.get('location') || '';
    if (!q) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing q parameter' }));
      return;
    }
    try {
      let apiUrl = 'https://www.arbeitnow.com/api/job-board-api?search=' + encodeURIComponent(q);
      if (location) apiUrl += '&location=' + encodeURIComponent(location);
      const response = await fetch(apiUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      const keywords = q.toLowerCase().split(' ');
      const filtered = data.data.filter(job =>
  keywords.some(keyword =>
    job.title.toLowerCase().includes(keyword)
  )
      );
      const jobs = (filtered || []).slice(0, 8).map(j => ({
        title: j.title,
        company_name: j.company_name,
        url: j.url,
        location: j.location || '',
        remote: !!j.remote,
        description: (j.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jobs }));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/fetch-job')) {
    const targetUrl = new URL(req.url, 'http://localhost').searchParams.get('url');
    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing url parameter' }));
      return;
    }
    try {
      const response = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const html = await response.text();
      const text = cleanJobText(extractText(html));
      if (text.length < 50) throw new Error('Could not extract readable content from this page');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ text }));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});