<script>
    import Window from "./lib/components/Window.svelte";
    import Cyanide from "./lib/apps/Cyanide.svelte";
    let windows = $state([]);
    let context = $state("Nothing is happening...");
    let focusedWindow = $state(null);

    let now = $state(new Date());
    $effect(() => {
        const interval = setInterval(() => (now = new Date()), 1000);
        return () => clearInterval(interval);
    });

    function formatTime(date) {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    function formatDate(date) {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    }
</script>

<div class="desktop-container">
    <section class="apps inset-gradient-border">
        <button
            class="apps-button"
            id="cyanide"
            onpointerenter={() => (context = "Launch cyanide")}
            onpointerleave={() => (context = "Nothing is happening...")}
            onclick={() =>
                windows.push({
                    id: crypto.randomUUID(),
                    type: "cyanide",
                })}
        >
            cyanide
        </button>
        <button
            class="apps-button"
            id="sulfur"
            onpointerenter={() => (context = "Launch sulfur")}
            onpointerleave={() => (context = "Nothing is happening...")}
            onclick={() =>
                windows.push({
                    id: crypto.randomUUID(),
                    type: "sulfur",
                })}
        >
            sulfur
        </button>
        <button
            class="apps-button"
            id="fluoride"
            onpointerenter={() => (context = "Launch fluoride")}
            onpointerleave={() => (context = "Nothing is happening...")}
            onclick={() =>
                windows.push({
                    id: crypto.randomUUID(),
                    type: "fluoride",
                })}
        >
            fluoride
        </button>
    </section>

    {#each windows as win (win.id)}
        <Window
            name={win.type === "cyanide"
                ? "Cyanide"
                : win.type === "sulfur"
                  ? "Sulfur"
                  : win.type === "fluoride"
                    ? "Fluoride"
                    : ""}
            theme={win.type}
            onClose={() => {
                windows = windows.filter((w) => w.id !== win.id);
                context = "Nothing is happening...";
                if (focusedWindow === win.id) focusedWindow = null;
            }}
            onMinimize={() => {
                windows = windows.filter((w) => w.id !== win.id);
                context = "Nothing is happening...";
                if (focusedWindow === win.id) focusedWindow = null;
            }}
            onContext={(msg) => (context = msg)}
            onFocus={() => (focusedWindow = win.id)}
        >
            {#if win.type === "cyanide"}
                <Cyanide />
            {:else if win.type === "sulfur"}

            {:else if win.type === "fluoride"}

            {/if}
        </Window>
    {/each}

    {#key context}
        <section class="context inset-gradient-border">
            {context}
        </section>
    {/key}
</div>

<div class="menu-bar">
    <span class="menu-bar-left">
        {#if focusedWindow}
            {windows.find((w) => w.id === focusedWindow)?.type === "cyanide"
                ? "Cyanide"
                : windows.find((w) => w.id === focusedWindow)?.type === "sulfur"
                  ? "Sulfur"
                  : windows.find((w) => w.id === focusedWindow)?.type ===
                      "fluoride"
                    ? "Fluoride"
                    : ""}
        {:else}
            cyanide
        {/if}
    </span>
    <span class="menu-bar-right">
        {formatDate(now)}&nbsp;&nbsp;{formatTime(now)}
    </span>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background-color: #000;
        color: #ffffff;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif;
        overflow: hidden;
    }

    :global(.inset-gradient-border) {
        position: relative;
    }

    :global(.inset-gradient-border::before) {
        content: "";
        position: absolute;
        inset: 1px;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(
            190deg,
            rgba(255, 255, 255, 0.21) 0%,
            rgba(255, 255, 255, 0.075) 35%,
            rgba(255, 255, 255, 0.1875) 100%
        );
        -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        mask-composite: exclude;
        pointer-events: none;
    }

    .desktop-container {
        position: relative;
        width: calc(100vw - 40px);
        height: calc(100vh - 52px);
        margin: 20px auto 0;
        border-radius: 12px;
        overflow: hidden;
        background-color: #18181c;
        background-image: url("/generic-bg.jpg");
        background-size: cover;
        background-position: center center;
        background-attachment: fixed;
        background-repeat: no-repeat;
    }

    .menu-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 32px;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        font-size: 0.8rem;
        color: #888;
        z-index: 10000;
        -webkit-user-select: none;
        user-select: none;
    }

    .menu-bar-left,
    .menu-bar-right {
        -webkit-user-select: none;
        user-select: none;
        line-height: 32px;
    }

    .menu-bar-left {
        font-weight: 600;
        color: #ccc;
    }

    .menu-bar-right {
        font-variant-numeric: tabular-nums;
    }

    .apps {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: rgba(20, 20, 24, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: none;
        border-radius: 32px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        z-index: 10000;
    }

    .apps-button {
        border-radius: 20px;
        width: 5rem;
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-color: #202024;
        border: 2px solid currentColor;
        font-weight: 700;
        font-family: inherit;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .apps-button:hover {
        transform: translateY(-12px) scale(1.05);
        box-shadow: 0 10px 20px currentColor;
    }

    .apps-button:active {
        transform: translateY(-5px) scale(0.95);
    }

    #cyanide {
        color: #00e5ff;
    }

    #sulfur {
        color: #c4d300;
    }

    #fluoride {
        color: #a7f3d0;
    }

    .context {
        position: absolute;
        bottom: 145px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.85rem;
        color: #aaa;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif;
        z-index: 10000;
        text-align: center;
        background: rgba(20, 20, 24, 0.6);
        padding: 0.5rem 1.2rem;
        border-radius: 16px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        pointer-events: none;
        user-select: none;
        animation: bounce-width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes bounce-width {
        0% {
            transform: translateX(-50%) scaleX(0.85);
        }
        50% {
            transform: translateX(-50%) scaleX(1.04);
        }
        100% {
            transform: translateX(-50%) scaleX(1);
        }
    }
</style>
