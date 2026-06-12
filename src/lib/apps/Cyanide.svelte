<script>
    let gameUrl = $state("/games/Balatro/balatro.html");
    let src = $state("about:blank");

    // @ts-ignore
    async function loadGame(url) {
        src = url;
    }

    async function fetchGames() {
        
    }

    $effect(() => {
        loadGame(gameUrl);
    });
</script>

<div class="iframe-container">
    <iframe
        {src}
        title="content"
        frameborder="0"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
    ></iframe>
</div>

<style>
    .iframe-container {
        position: relative;
        width: 100%;
        height: 80vh;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>
