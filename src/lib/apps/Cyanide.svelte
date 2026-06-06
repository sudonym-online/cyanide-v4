<script>
    let gameUrl = $state("https://cdn.jsdelivr.net/gh/sudonym-sudo/cyanide-assets@main/Balatro/balatro.html");
    let iframeSrc = $state("about:blank");

    async function loadGame(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();
            
            const blob = new Blob([html], { type: 'text/html' });
            iframeSrc = URL.createObjectURL(blob);
        } catch (error) {
            console.error('Failed to load game:', error);
            iframeSrc = "about:blank";
        }
    }

    $effect(() => {
        loadGame(gameUrl);
        return () => {
            if (iframeSrc !== "about:blank") {
                URL.revokeObjectURL(iframeSrc);
            }
        };
    });
</script>

<iframe 
    src={iframeSrc} 
    class="game-frame"
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
></iframe>

<style>
    .game-frame {
        width: 100%;
        height: 100%;
        border: none;
        background: white;
    }
</style>