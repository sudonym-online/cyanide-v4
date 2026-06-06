<script>
    let { children, name, onClose, onMinimize } = $props();

    let x = $state(100);
    let y = $state(200);
    let width = $state(200);
    let height = $state(150);
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
                100,
                resizeBuffer.startWidth + (e.clientX - resizeBuffer.startX),
            );
            height = Math.max(
                100,
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
    class="window"
    style:left="{x}px"
    style:top="{y}px"
    style:width="{width}px"
    style:height="{height}px"
>
    {#if name}
        <div
            class="window-header"
            role="button"
            tabindex="0"
            onpointerdown={(e) => {
                isDragging = true;
                grabX = e.clientX - x;
                grabY = e.clientY - y;
            }}
        >
            <span class="window-title">{name}</span>
            <button
                class="window-close"
                onclick={(e) => {
                    e.stopPropagation();
                    onClose?.(e);
                }}>×</button
            >
            <button
                class="window-minimize"
                onclick={(e) => {
                    e.stopPropagation();
                    onMinimize?.(e);
                }}>−</button
            >
            <button
                class="window-maximize"
                onclick={(e) => {
                    e.stopPropagation();
                    isMaximized = !isMaximized;
                    if (isMaximized) {
                        maximizeBuffer = {
                            x: x,
                            y: y,
                            width: width,
                            height: height,
                        };
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
                }}>＋</button
            >
        </div>
    {/if}
    {@render children?.()}
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
    >
        >
    </div>
</div>

<style>
    .window {
        background-color: white;
        border: 1px solid #333;
        position: absolute;
        user-select: none;
    }

    .window-header {
        background-color: #333;
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        cursor: grab;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .window-title {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .window-header button {
        background: none;
        border: none;
        color: white;
        padding: 0 4px;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .window-header button:hover {
        background-color: #555;
    }

    .window-close:hover {
        background-color: #e81123 !important;
    }

    .window-resize {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 16px;
        height: 16px;
        cursor: se-resize;
        background-color: #ccc;
        user-select: none;
    }

    .window-resize:hover {
        background-color: #999;
    }
</style>
