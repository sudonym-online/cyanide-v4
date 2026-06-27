const SWF_URL = 'https://rawcdn.githack.com/sudonym-sudo/cyan-assets/6f1f87cfa85c5aae7227c2f34e93048e49e43ec9/HTML/Binding%20of%20Issac_%20Wrath%20of%20the%20Lamb/The%20Binding%20of%20Isaac.swf';
const RUFFLE_URL = 'https://unpkg.com/@ruffle-rs/ruffle';

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

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = url;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function main() {
  try {
    log('[LOADER] Loading Ruffle...', '#ff0');
    await loadScript(RUFFLE_URL);
    log('[LOADER] Ruffle loaded', '#0f0');

    log('[FETCH] The Binding of Isaac.swf (36 MB)...', '#ff0');
    const res = await fetch(SWF_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const total = parseInt(res.headers.get('Content-Length') || '37748736');
    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      setProgress((received / total) * 100);
      if (received % (1024 * 1024) < value.length) {
        log(`[DOWNLOAD] ${(received / 1024 / 1024).toFixed(1)} MB / ${(total / 1024 / 1024).toFixed(1)} MB`, '#0ff');
      }
    }

    const swfData = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) { swfData.set(chunk, offset); offset += chunk.length; }

    setProgress(100);
    log('[ASSEMBLE] Creating blob URL...', '#ff0');
    const blob = new Blob([swfData], { type: 'application/x-shockwave-flash' });
    const blobUrl = URL.createObjectURL(blob);
    log('[LAUNCH] Starting game via Ruffle...', '#0f0');

    document.getElementById('loader-ui').style.display = 'none';

    const container = document.getElementById('gameContainer');
    container.style.display = 'block';

    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();
    player.style.width = '100%';
    player.style.height = '100%';
    container.appendChild(player);
    player.load(blobUrl);
  } catch (e) {
    log(`[ERROR] ${e.message}`, '#f00');
    console.error(e);
  }
}

main();
