const GAME_URL = 'https://cdn.jsdelivr.net/gh/sudonym-online/cyanide-assets@main/Bitlife/index.html';

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

async function main() {
  try {
    log('[FETCH] Bitlife...', '#ff0');
    const res = await fetch(GAME_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

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
    for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.length; }

    const html = new TextDecoder().decode(merged);
    setProgress(100);
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
