<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="relative min-h-screen bg-zinc-950 text-zinc-100">
	<div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
		<div class="absolute -top-40 -left-40 h-130 w-130 rounded-full bg-white/10 blur-3xl"></div>
		<div class="absolute top-1/4 -right-45 h-120 w-120 rounded-full bg-white/8 blur-3xl"></div>
		<div class="absolute -bottom-50 left-1/3 h-140 w-140 rounded-full bg-white/6 blur-3xl"></div>
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]"
		></div>
	</div>
	<div class="relative z-10">{@render children()}</div>
</div>
