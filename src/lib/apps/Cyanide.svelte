<script>
    let gameUrl = $state(
        "https://cdn.jsdelivr.net/gh/sudonym-sudo/cyanide-assets@main/Balatro/balatro.html",
    );
    let iframeSrc = $state("about:blank");

    async function loadGame(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            let html = await response.text();
            console.log("HTML length:", html.length);
            console.log("HTML starts with:", html.slice(0, 100));

            html = html.replace(/<!DOCTYPE html>/gi, (match, offset) =>
                offset === 0 ? match : "",
            );

            const blob = new Blob([html], { type: "text/html" });
            const blobUrl = URL.createObjectURL(blob);
            console.log("Blob URL:", blobUrl);
            iframeSrc = blobUrl;
        } catch (error) {
            console.error("Failed to load game:", error);
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
    onload={() => console.log("Iframe loaded, src:", iframeSrc)}
></iframe>

<style>
    .game-frame {
        width: 100%;
        height: 100%;
        border: none;
        background: white;
    }
</style>
