<script>
    import Window from "./lib/components/Window.svelte";
    import Cyanide from "./lib/apps/Cyanide.svelte";
    // @ts-ignore
    let windows = $state([]);
    let context = $state("Nothing is happening...");
    $effect(() => {
        console.log("hello from cyanide!");
    });
</script>

<section class="apps">
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
        onClose={() => (windows = windows.filter((w) => w.id !== win.id))}
        onMinimize={() => (windows = windows.filter((w) => w.id !== win.id))}
    >
        {#if win.type === "cyanide"}
            <Cyanide />
        {:else if win.type === "sulfur"}
            <!-- <Sulfur /> -->
        {:else if win.type === "fluoride"}
            <!-- <Fluoride /> -->
        {/if}
    </Window>
{/each}

<section class="context">
    {context}
</section>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #18181c; /* Dark charcoal theme */
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        overflow: hidden;
    }

    .apps {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: rgba(20, 20, 24, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
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
        background-color: #202024; /* Darker button container */
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
        color: #00E5FF;
    }

    #sulfur {
        color: #C4D300;
    }

    #fluoride {
        color: #A7F3D0;
    }

    .context {
        position: fixed;
        bottom: 145px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.85rem;
        color: #aaa;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        z-index: 10000;
        text-align: center;
        background: rgba(20, 20, 24, 0.6);
        padding: 0.5rem 1.2rem;
        border-radius: 16px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        pointer-events: none;
    }
</style>
