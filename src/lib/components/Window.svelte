<script>
    let { children, name, onClose, onMinimize, theme = "default" } = $props();

    let x = $state(100);
    let y = $state(200);
    let width = $state(450);
    let height = $state(300);
    let isMaximized = $state(false);
    let maximizeBuffer = $state({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    let grabX = 0;
    let grabY = 0;
    let isDragging = $state(false);
    let isResizing = $state(false);
    let resizeBuffer = $state({
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
    });
</script>

<svelte:window
    onpointermove={(e) => {
        if (isDragging) {
            x = e.clientX - grabX;
            y = e.clientY - grabY;
        }
        if (isResizing) {
            width = Math.max(
                250,
                resizeBuffer.startWidth + (e.clientX - resizeBuffer.startX),
            );
            height = Math.max(
                150,
                resizeBuffer.startHeight + (e.clientY - resizeBuffer.startY),
            );
        }
    }}
    onpointerup={() => {
        isDragging = false;
        isResizing = false;
    }}
/>

<div
    class="window {isMaximized ? 'maximized' : ''} {isDragging
        ? 'dragging'
        : ''}"
    style:left="{x}px"
    style:top="{y}px"
    style:width="{width}px"
    style:height="{height}px"
    style:--theme-bg={theme === "cyanide"
        ? "#0a1c1f"
        : theme === "sulfur"
          ? "#17190d"
          : theme === "fluoride"
            ? "#0a1a14"
            : "#1e1e22"}
    style:--theme-header-bg={theme === "cyanide"
        ? "#061214"
        : theme === "sulfur"
          ? "#0f1008"
          : theme === "fluoride"
            ? "#06110d"
            : "#18181b"}
    style:--theme-title-bg={theme === "cyanide"
        ? "#102d33"
        : theme === "sulfur"
          ? "#242813"
          : theme === "fluoride"
            ? "#102d22"
            : "#28282c"}
    style:--theme-title-color={theme === "cyanide"
        ? "#00E5FF"
        : theme === "sulfur"
          ? "#C4D300"
          : theme === "fluoride"
            ? "#A7F3D0"
            : "#e0e0e0"}
>
    {#if name}
        <div
            class="window-header"
            role="button"
            tabindex="0"
            onpointerdown={(e) => {
                // Prevent dragging if clicking on the traffic light buttons
                if (e.target.closest(".traffic-lights")) return;
                isDragging = true;
                grabX = e.clientX - x;
                grabY = e.clientY - y;
            }}
            ondblclick={() => {
                isMaximized = !isMaximized;
                if (isMaximized) {
                    maximizeBuffer = { x, y, width, height };
                    x = 0;
                    y = 0;
                    width = window.innerWidth;
                    height = window.innerHeight;
                } else {
                    x = maximizeBuffer.x;
                    y = maximizeBuffer.y;
                    width = maximizeBuffer.width;
                    height = maximizeBuffer.height;
                }
            }}
        >
            <div class="traffic-lights">
                <button
                    class="traffic-light close"
                    onclick={(e) => {
                        e.stopPropagation();
                        onClose?.(e);
                    }}
                    aria-label="Close"
                >
                    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M 3 3 L 7 7 M 7 3 L 3 7"
                            stroke="currentColor"
                            stroke-width="1.2"
                            stroke-linecap="round"
                        />
                    </svg>
                </button>
                <button
                    class="traffic-light minimize"
                    onclick={(e) => {
                        e.stopPropagation();
                        onMinimize?.(e);
                    }}
                    aria-label="Minimize"
                >
                    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M 2 5 L 8 5"
                            stroke="currentColor"
                            stroke-width="1.2"
                            stroke-linecap="round"
                        />
                    </svg>
                </button>
                <button
                    class="traffic-light maximize"
                    onclick={(e) => {
                        e.stopPropagation();
                        isMaximized = !isMaximized;
                        if (isMaximized) {
                            maximizeBuffer = { x, y, width, height };
                            x = 0;
                            y = 0;
                            width = window.innerWidth;
                            height = window.innerHeight;
                        } else {
                            x = maximizeBuffer.x;
                            y = maximizeBuffer.y;
                            width = maximizeBuffer.width;
                            height = maximizeBuffer.height;
                        }
                    }}
                    aria-label="Maximize"
                >
                    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M 5 3 L 5 7 M 3 5 L 7 5"
                            stroke="currentColor"
                            stroke-width="1.2"
                            stroke-linecap="round"
                        />
                    </svg>
                </button>
            </div>
            <div class="window-title-wrapper">
                <span class="window-title">{name}</span>
            </div>
            <div class="spacer"></div>
        </div>
    {/if}
    <div class="window-content">
        {@render children?.()}
    </div>

    <div
        class="window-resize"
        role="button"
        tabindex="0"
        onpointerdown={(e) => {
            e.stopPropagation();
            isResizing = true;
            resizeBuffer = {
                startX: e.clientX,
                startY: e.clientY,
                startWidth: width,
                startHeight: height,
            };
        }}
        aria-label="Resize window"
    ></div>
</div>

<style>
    .window {
        background-color: var(--theme-bg, #1e1e22);
        border: none; /* Removed outline */
        border-radius: 12px;
        box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.6),
            0 0 1px rgba(255, 255, 255, 0.1); /* clean border shadow rim */
        position: absolute;
        display: flex;
        flex-direction: column;
        overflow: hidden; /* Clips content to border radius */
        transition:
            background-color 0.25s ease,
            box-shadow 0.25s ease;
    }

    .window.dragging {
        box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.7),
            0 0 1px rgba(255, 255, 255, 0.15);
    }

    .window.maximized {
        border-radius: 0;
        box-shadow: none;
    }

    .window-header {
        height: 28px; /* Thinner top bar */
        background: var(--theme-header-bg, #18181b); /* Themed header bar */
        border-bottom: 1px solid rgba(0, 0, 0, 0.2); /* Subtle dark border separating header */
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        cursor: default;
        user-select: none;
        transition: background-color 0.25s ease;
    }

    /* Traffic Lights Layout */
    .traffic-lights {
        display: flex;
        gap: 8px;
        width: 60px; /* Symmetry with the spacer */
        align-items: center;
    }

    .traffic-light {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.05); /* very light border for OLED dark theme */
        padding: 0;
        margin: 0;
        cursor: default;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        background-clip: padding-box;
    }

    .traffic-light svg {
        width: 8px;
        height: 8px;
        opacity: 0;
        transition: opacity 0.1s ease;
    }

    .window-header:hover .traffic-light svg {
        opacity: 1; /* Show icons only on header hover */
    }

    .traffic-light.close {
        background-color: #ff5f56;
        border-color: #e0443e;
        color: #4d0000;
    }
    .traffic-light.close:active {
        background-color: #bf4740;
    }

    .traffic-light.minimize {
        background-color: #ffbd2e;
        border-color: #dea123;
        color: #5c3300;
    }
    .traffic-light.minimize:active {
        background-color: #bf8e22;
    }

    .traffic-light.maximize {
        background-color: #27c93f;
        border-color: #1aab29;
        color: #004d09;
    }
    .traffic-light.maximize:active {
        background-color: #1d972f;
    }

    .window-title-wrapper {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .window-title {
        background-color: var(--theme-title-bg, rgba(255, 255, 255, 0.08));
        border: none; /* Removed title border */
        border-radius: 6px;
        padding: 2px 10px;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif;
        font-size: 11px; /* Slightly smaller for thinner header */
        font-weight: 600;
        color: var(--theme-title-color, #e0e0e0); /* Match theme color */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: -0.1px;
        max-width: 180px;
        line-height: 1.2;
        transition:
            background-color 0.25s ease,
            color 0.25s ease;
    }

    .spacer {
        width: 60px; /* Mirrors traffic lights width for exact center title alignment */
    }

    .window-content {
        flex: 1;
        overflow: auto;
        position: relative;
        background: var(
            --theme-bg,
            #1e1e22
        ); /* Content area matches themed window background */
        color: #ffffff;
    }

    /* Invisible resize area at bottom right corner (macOS standard) */
    .window-resize {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 20px;
        height: 20px;
        cursor: se-resize;
        z-index: 10;
        user-select: none;
        background-color: transparent;
    }
</style>
