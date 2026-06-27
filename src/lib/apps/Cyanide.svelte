<script>
	const gameModules = import.meta.glob('../games/*/meta.json', { eager: true });
	const games = Object.values(gameModules).map((m) => m.default);

	let selected = $state(null);
</script>

{#if selected}
	<div class="game-view">
		<div class="game-bar">
			<button class="back-btn" onclick={() => (selected = null)}>↩ Library</button>
			<span class="game-title">{selected.name}</span>
		</div>
		<iframe
			src={selected.src}
			title={selected.name}
			frameborder="0"
			allowfullscreen
			sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
		></iframe>
	</div>
{:else}
	<div class="library">
		{#each games as game}
			<button class="game-card" onclick={() => (selected = game)}>
				{#if game['image-src']}
					<img src={game['image-src']} alt={game.name} class="thumbnail" />
				{:else}
					<div class="thumbnail placeholder">
						<span>{game.name[0]}</span>
					</div>
				{/if}
				<div class="card-info">
					<span class="card-name">{game.name}</span>
					<span class="card-genre">{game.genre}</span>
				</div>
			</button>
		{/each}
	</div>
{/if}

<style>
	/* ── Game view ─────────────────────────────────── */
	.game-view {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.game-bar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.4rem 0.75rem;
		background: rgba(10, 10, 14, 0.85);
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		flex-shrink: 0;
	}

	.back-btn {
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: #00e5ff;
		padding: 0.2rem 0.65rem;
		border-radius: 8px;
		font-size: 0.75rem;
		font-family: inherit;
		cursor: pointer;
		transition: background 0.15s;
	}

	.back-btn:hover {
		background: rgba(0, 229, 255, 0.12);
	}

	.game-title {
		font-size: 0.8rem;
		color: #ccc;
		font-weight: 600;
	}

	iframe {
		flex: 1;
		width: 100%;
		border: none;
	}

	/* ── Library grid ───────────────────────────────── */
	.library {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
		gap: 0.75rem;
		padding: 0.75rem;
		overflow-y: auto;
		height: 100%;
		box-sizing: border-box;
		align-content: start;
	}

	.game-card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 10px;
		overflow: hidden;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		text-align: left;
		transition:
			transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
			border-color 0.15s,
			background 0.15s;
	}

	.game-card:hover {
		transform: translateY(-3px);
		border-color: rgba(0, 229, 255, 0.35);
		background: rgba(0, 229, 255, 0.05);
	}

	.thumbnail {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		display: block;
		background: #111;
	}

	.placeholder {
		width: 100%;
		aspect-ratio: 16 / 9;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
		font-size: 2rem;
		font-weight: 700;
		color: rgba(0, 229, 255, 0.5);
	}

	.card-info {
		padding: 0.4rem 0.5rem 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.card-name {
		font-size: 0.75rem;
		font-weight: 600;
		color: #e0e0e0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-genre {
		font-size: 0.65rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
</style>
