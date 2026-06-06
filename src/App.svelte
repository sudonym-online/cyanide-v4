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
        onpointerdown={() => (context = "Launch cyanide")}
        onpointerup={() => (context = "Nothing is happening...")}
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
        onpointerdown={() => (context = "Launch sulfur")}
        onpointerup={() => (context = "Nothing is happening...")}
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
        onpointerdown={() => (context = "Launch fluoride")}
        onpointerup={() => (context = "Nothing is happening...")}
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
    .apps {
        display: flex;
        gap: 2rem;
        margin-left: 4rem;
        margin-top: 4rem;
        margin-bottom: 2rem;
    }

    .apps-button {
        border-radius: 20px;
        width: 5rem;
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    #cyanide {
        background-color: cyan;
    }

    #sulfur {
        background-color: yellow;
    }

    #fluoride {
        background-color: greenyellow;
    }

    .context {
        margin-left: 4rem;
    }
</style>
