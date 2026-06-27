<script>
	import Window from './lib/components/Window.svelte';
	import Cyanide from './lib/apps/Cyanide.svelte';
	import { Session, createWindow } from './lib/session.js';

	const LABELS = { cyanide: 'Cyanide', sulfur: 'Sulfur', fluoride: 'Fluoride' };
	const DOCK = ['cyanide', 'sulfur', 'fluoride'];

	let windows = $state(Session.load());
	let hint = $state('Nothing is happening...');
	let activeId = $state(null);

	let now = $state(new Date());
	$effect(() => {
		const id = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(id);
	});

	$effect(() => {
		Session.save($state.snapshot(windows));
	});

	let screenH = $state(window.innerHeight);
	let mouseY = $state(0);
	$effect(() => {
		const onResize = () => (screenH = window.innerHeight);
		const onMove = (e) => (mouseY = e.clientY);
		window.addEventListener('resize', onResize);
		window.addEventListener('pointermove', onMove);
		return () => {
			window.removeEventListener('resize', onResize);
			window.removeEventListener('pointermove', onMove);
		};
	});

	const covered = $derived(
		windows.some((win) => win.isMaximized || win.y + win.height > screenH - 52 - 130)
	);
	const peeking = $derived(covered && mouseY > screenH - 170);

	function launch(type) {
		windows.push(createWindow(type, windows.length));
	}

	function closeWin(id) {
		windows = windows.filter((w) => w.id !== id);
		if (activeId === id) activeId = null;
		hint = 'Nothing is happening...';
	}

	function raise(id) {
		activeId = id;
		const idx = windows.findIndex((w) => w.id === id);
		if (idx !== -1 && idx !== windows.length - 1) {
			const [win] = windows.splice(idx, 1);
			windows.push(win);
		}
	}

	const activeApp = $derived(
		activeId
			? LABELS[windows.find((w) => w.id === activeId)?.type] ?? 'cyanide'
			: 'cyanide'
	);

	function formatTime(date) {
		return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
	}

	function formatDate(date) {
		return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
	}
</script>

<div class="desktop-container">
	<section class="apps inset-gradient-border" class:hidden={covered && !peeking}>
		{#each DOCK as type}
			<button
				class="apps-button {type}"
				onpointerenter={() => (hint = `Launch ${LABELS[type]}`)}
				onpointerleave={() => (hint = 'Nothing is happening...')}
				onclick={() => launch(type)}
			>
				{type}
			</button>
		{/each}
	</section>

	{#each windows as win (win.id)}
		<Window
			name={LABELS[win.type]}
			theme={win.type}
			bind:x={win.x}
			bind:y={win.y}
			bind:width={win.width}
			bind:height={win.height}
			bind:isMaximized={win.isMaximized}
			onClose={() => closeWin(win.id)}
			onMinimize={() => closeWin(win.id)}
			onContext={(msg) => (hint = msg)}
			onFocus={() => raise(win.id)}
		>
			{#if win.type === 'cyanide'}
				<Cyanide />
			{:else if win.type === 'sulfur'}
				<!-- placeholder -->
			{:else if win.type === 'fluoride'}
				<!-- placeholder -->
			{/if}
		</Window>
	{/each}

</div>

<div class="context-wrap" class:in-bar={covered}>
	{#key hint}
		<div class="context" class:inset-gradient-border={!covered} class:in-bar={covered}>{hint}</div>
	{/key}
</div>

<div class="menu-bar">
	<span class="menu-bar-left">{activeApp}</span>
	<span class="menu-bar-right">{formatDate(now)}&nbsp;&nbsp;{formatTime(now)}</span>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		background-color: #000;
		color: #ffffff;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		overflow: hidden;
	}

	:global(.inset-gradient-border) {
		position: relative;
	}

	:global(.inset-gradient-border::before) {
		content: '';
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
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
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
		background-image: url('/generic-bg.jpg');
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
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
		user-select: none;
	}

	.menu-bar-left {
		font-weight: 600;
		color: #ccc;
		line-height: 32px;
	}

	.menu-bar-right {
		font-variant-numeric: tabular-nums;
		line-height: 32px;
	}

	.apps {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%) translateY(0);
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: rgba(20, 20, 24, 0.65);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-radius: 32px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
		z-index: 10000;
		transition:
			transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			opacity 0.4s ease;
	}

	.apps.hidden {
		transform: translateX(-50%) translateY(calc(100% + 24px));
		opacity: 0;
		pointer-events: none;
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

	.apps-button:hover  { transform: translateY(-12px) scale(1.05); box-shadow: 0 10px 20px currentColor; }
	.apps-button:active { transform: translateY(-5px) scale(0.95); }

	.apps-button.cyanide  { color: #00e5ff; }
	.apps-button.sulfur   { color: #c4d300; }
	.apps-button.fluoride { color: #a7f3d0; }

	.context-wrap {
		position: fixed;
		/* 32px menu-bar + 145px original offset from container bottom = 177px from viewport bottom */
		bottom: 177px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10001;
		pointer-events: none;
		user-select: none;
		text-align: center;
		transition: bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.context-wrap.in-bar {
		bottom: 0;
		height: 32px;
		display: flex;
		align-items: center;
	}

	.context {
		display: inline-block;
		font-size: 0.85rem;
		color: #aaa;
		background: rgba(20, 20, 24, 0.6);
		padding: 0.5rem 1.2rem;
		border-radius: 16px;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		white-space: nowrap;
		animation: bounce-width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		transition:
			background 0.4s ease,
			box-shadow 0.4s ease,
			border-radius 0.4s ease,
			padding 0.4s ease,
			color 0.35s ease,
			font-size 0.35s ease;
	}

	.context.in-bar {
		background: transparent;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		box-shadow: none;
		border-radius: 4px;
		padding: 0.25rem 0.8rem;
		color: #888;
		font-size: 0.78rem;
	}

	@keyframes bounce-width {
		0%   { transform: scaleX(0.85); }
		50%  { transform: scaleX(1.04); }
		100% { transform: scaleX(1); }
	}
</style>
