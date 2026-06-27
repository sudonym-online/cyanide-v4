<script>
	let src = $state('/games/Balatro/balatro.html');
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
		height: 100%;
		border-radius: 8px;
		overflow: hidden;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
