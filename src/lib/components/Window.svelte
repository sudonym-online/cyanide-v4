<script>
	const THEMES = {
		cyanide:  { bg: '#0a1c1f', headerBg: '#061214', titleBg: '#102d33', titleColor: '#00E5FF' },
		sulfur:   { bg: '#17190d', headerBg: '#0f1008', titleBg: '#242813', titleColor: '#C4D300' },
		fluoride: { bg: '#0a1a14', headerBg: '#06110d', titleBg: '#102d22', titleColor: '#A7F3D0' },
		default:  { bg: '#1e1e22', headerBg: '#18181b', titleBg: '#28282c', titleColor: '#e0e0e0' },
	};

	const MIN_WIDTH = 250;
	const MIN_HEIGHT = 150;

	let {
		children,
		name,
		theme = 'default',
		x = $bindable(80),
		y = $bindable(60),
		width = $bindable(500),
		height = $bindable(350),
		isMaximized = $bindable(false),
		onClose,
		onMinimize,
		onContext,
		onFocus,
	} = $props();

	const palette = $derived(THEMES[theme] ?? THEMES.default);

	let dragging = $state(false);
	let resizing = $state(false);
	let animating = $state(false);
	let dragX = 0;
	let dragY = 0;
	let saved = { x: 0, y: 0, width: 0, height: 0 };
	let resizeOrigin = { x: 0, y: 0, width: 0, height: 0 };

	function getDesk() {
		return document.querySelector('.desktop-container').getBoundingClientRect();
	}

	function toggleMax() {
		animating = true;
		if (isMaximized) {
			({ x, y, width, height } = saved);
		} else {
			saved = { x, y, width, height };
			const desk = getDesk();
			x = 0; y = 0; width = desk.width; height = desk.height;
		}
		isMaximized = !isMaximized;
	}

	function onMove(e) {
		if (dragging) {
			const desk = getDesk();
			x = Math.max(0, Math.min(e.clientX - dragX, desk.width - width));
			y = Math.max(0, Math.min(e.clientY - dragY, desk.height - height));
		}
		if (resizing) {
			width  = Math.max(MIN_WIDTH,  resizeOrigin.width  + (e.clientX - resizeOrigin.x));
			height = Math.max(MIN_HEIGHT, resizeOrigin.height + (e.clientY - resizeOrigin.y));
		}
	}

	function onUp() {
		dragging = false;
		resizing = false;
	}

	$effect(() => {
		document.body.style.userSelect = (dragging || resizing) ? 'none' : '';
	});

	function beginDrag(e) {
		if (e.target.closest('.traffic-lights')) return;
		dragging = true;
		dragX = e.clientX - x;
		dragY = e.clientY - y;
	}

	function beginResize(e) {
		e.stopPropagation();
		resizing = true;
		resizeOrigin = { x: e.clientX, y: e.clientY, width, height };
	}
</script>

<svelte:window onpointermove={onMove} onpointerup={onUp} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="window inset-gradient-border"
	class:maximized={isMaximized}
	class:dragging={dragging}
	class:animating={animating}
	ontransitionend={(e) => { if (e.propertyName === 'width') animating = false; }}
	style:left="{x}px"
	style:top="{y}px"
	style:width="{width}px"
	style:height="{height}px"
	style:--theme-bg={palette.bg}
	style:--theme-header-bg={palette.headerBg}
	style:--theme-title-bg={palette.titleBg}
	style:--theme-title-color={palette.titleColor}
	onpointerdown={() => onFocus?.()}
>
	{#if name}
		<div
			class="window-header"
			role="button"
			tabindex="0"
			onpointerdown={beginDrag}
			ondblclick={toggleMax}
		>
			<div class="traffic-lights">
				<button
					class="traffic-light close"
					aria-label="Close"
					onclick={(e) => { e.stopPropagation(); onClose?.(e); }}
					onpointerenter={() => onContext?.(`Close ${name}`)}
					onpointerleave={() => onContext?.('Nothing is happening...')}
				>
					<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
						<text x="5" y="5" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="currentColor">▩</text>
					</svg>
				</button>
				<button
					class="traffic-light minimize"
					aria-label="Minimize"
					onclick={(e) => { e.stopPropagation(); onMinimize?.(e); }}
					onpointerenter={() => onContext?.(`Minimize ${name}`)}
					onpointerleave={() => onContext?.('Nothing is happening...')}
				>
					<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
						<text x="5" y="5" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="currentColor">▥</text>
					</svg>
				</button>
				<button
					class="traffic-light maximize"
					aria-label="Maximize"
					onclick={(e) => { e.stopPropagation(); toggleMax(); }}
					onpointerenter={() => onContext?.(`Maximize ${name}`)}
					onpointerleave={() => onContext?.('Nothing is happening...')}
				>
					<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
						<text x="5" y="5" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="currentColor">▣</text>
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
		onpointerdown={beginResize}
		aria-label="Resize window"
	></div>
</div>

<style>
	.window {
		background-color: var(--theme-bg, #1e1e22);
		border-radius: 12px;
		position: absolute;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: background-color 0.25s ease, box-shadow 0.25s ease;
	}

	.window.animating {
		transition:
			left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			border-radius 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			background-color 0.25s ease,
			box-shadow 0.25s ease;
	}

	.window.dragging {
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.15);
	}

	.window.maximized {
		border-radius: 0;
		box-shadow: none;
	}

	.window-header {
		height: 28px;
		background: var(--theme-header-bg, #18181b);
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 12px;
		cursor: default;
		user-select: none;
		transition: background-color 0.25s ease;
	}

	.traffic-lights {
		display: flex;
		gap: 3px;
		width: 60px;
		align-items: center;
	}

	.traffic-light {
		width: 14px;
		height: 14px;
		border-radius: 2px;
		border: 1px solid rgba(255, 255, 255, 0.05);
		padding: 0;
		margin: 0;
		cursor: default;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: none;
		background-clip: padding-box;
		transition: background-color 0.2s ease;
	}

	.traffic-light svg {
		width: 14px;
		height: 14px;
		transition: opacity 0.1s ease, fill 0.2s ease;
	}

	.traffic-light.close    { background-color: transparent; color: #ff5f56; }
	.traffic-light.minimize { background-color: transparent; color: #ffbd2e; }
	.traffic-light.maximize { background-color: transparent; color: #27c93f; }

	.traffic-light:hover.close    { background-color: rgba(255,  95,  86, 0.25); }
	.traffic-light:hover.minimize { background-color: rgba(255, 189,  46, 0.25); }
	.traffic-light:hover.maximize { background-color: rgba( 39, 201,  63, 0.25); }

	.window-title-wrapper {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.window-title {
		background-color: var(--theme-title-bg, rgba(255, 255, 255, 0.08));
		border-radius: 6px;
		padding: 2px 10px;
		user-select: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		font-size: 11px;
		font-weight: 600;
		color: var(--theme-title-color, #e0e0e0);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: -0.1px;
		max-width: 180px;
		line-height: 1.2;
		transition: background-color 0.25s ease, color 0.25s ease;
	}

	.spacer { width: 60px; }

	.window-content {
		flex: 1;
		overflow: auto;
		position: relative;
		background: transparent;
		color: #ffffff;
	}

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
