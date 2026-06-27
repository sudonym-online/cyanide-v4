const PARTS_URL = 'https://cdn.jsdelivr.net/gh/sudonym-online/cyanide-assets@main/Balatro/parts.json';
const BASE_HREF = 'https://cdn.jsdelivr.net/gh/sudonym-online/cyanide-assets@main/Balatro/';

const logEl = document.getElementById('log');
const progressEl = document.getElementById('progress-text');
const barEl = document.getElementById('bar');

function log(msg, color = '#0ff') {
  const line = document.createElement('div');
  line.style.color = color;
  line.textContent = msg;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

function setProgress(pct) {
  progressEl.textContent = `${Math.round(pct)}%`;
  barEl.style.width = `${pct}%`;
}

async function fetchWithProgress(url, label) {
  log(`[FETCH] ${label}...`, '#ff0');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);

  const total = parseInt(res.headers.get('Content-Length') || '0');
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total) setProgress((received / total) * 100);
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(merged);
}

async function main() {
  try {
    const text = await fetchWithProgress(PARTS_URL, 'Balatro (parts.json)');
    setProgress(100);
    log('[PARSE] Assembling game...', '#0f0');

    const parts = JSON.parse(text);
    const html = [
      `<!DOCTYPE html><html><head>\n  <base href="${BASE_HREF}">`,
      parts.first_script,
      `<script>\n${parts.love_engine}\n</script>`,
      `<script>\n${parts.jszip_lib}\n</script>`,
      parts.style_html,
      parts.body_start,
      '</body></html>',
    ].join('\n');

    log('[LAUNCH] Starting game...', '#0f0');
    document.open();
    document.write(html);
    document.close();
  } catch (e) {
    log(`[ERROR] ${e.message}`, '#f00');
    console.error(e);
  }
}

main();
